package com.example.backend.service;
import com.example.backend.dtos.HistoryDTO;
import com.example.backend.dtos.ParkingRequestDTO;
import com.example.backend.dtos.TransactionResponseDTO;
import com.example.backend.models.*;
import com.example.backend.models.enums.ParkingStatus;
import com.example.backend.repository.ParkingRepository;
import com.example.backend.repository.UserDeviceRepository;
import com.example.backend.repository.UsersRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.backend.dtos.ParkingMapDTO;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
public class ParkingService {
    private final ParkingRepository parkingRepository;
    private final PlatesService platesService;
    private final UserService userService;
    private final FcmMessagingService fcmMessagingService;
    private final UserDeviceRepository userDeviceRepository;
    private final BalanceService balanceService;
    private final UsersRepository usersRepository;
    private static final BigDecimal CREDIT_LIMIT = new BigDecimal("-2000.00");

    @Autowired
    public ParkingService(ParkingRepository parkingRepository, PlatesService platesService, UserService userService, FcmMessagingService fcmMessagingService, UserDeviceRepository userDeviceRepository, BalanceService balanceService, UsersRepository usersRepository) {
        this.parkingRepository = parkingRepository;
        this.platesService = platesService;
        this.userService = userService;
        this.fcmMessagingService = fcmMessagingService;
        this.userDeviceRepository = userDeviceRepository;
        this.balanceService = balanceService;
        this.usersRepository = usersRepository;
    }

    public List<Parking> findAllParkings(){
        return parkingRepository.findAll();
    }

    public Optional<Parking> findParkingsById(Long id){
        return parkingRepository.findById(id);
    }

    private HistoryDTO mapToHistoryDTO(Parking parking) {
        Long id = parking.getId();
        String plate = platesService.findById(parking.getPlateId())
                .map(Plates::getNumber)
                .orElse("plate not found");
        String address = parking.getAddress();
        LocalDateTime startDate = parking.getStartTime();
        LocalDateTime endDate = parking.getEndTime();
        String duration = formatDuration(parking.getDurationMinutes());
        String price = parking.getPrice().toString();

        return new HistoryDTO(id, startDate, endDate, address, plate, duration, price);
    }

    public List<HistoryDTO> getLast3DistinctParkings(Long userId) {
        List<Parking> parkings = parkingRepository.findLast3DistinctByAddress(userId);
        // stream convierte la lista en una secuencia de elementos al que se le puede aplicar map
        // map toma cada elemento del stream parkings y el this:: dice que para cada objeto parking de parkings va a llamar a la funcion
        // collect toma todos los elementos del stream y con toList los convierte nuevamente en una lista.
        return parkings.stream().map(this::mapToHistoryDTO).collect(Collectors.toList());

    }

    // Busca una lista de parkings hechos por un usuario especifico, sirve para el historial.

    public List<HistoryDTO> getParkingHistoryByUserId(Long userId, Long plateId) {
        List<Parking> parkings = parkingRepository.findByUserIdAndPlateIdOrderByStartTimeDesc(userId, plateId);

        return parkings.stream().map(this::mapToHistoryDTO).collect(Collectors.toList());

    }

    private String formatDuration(int minutes) {
        int hours = minutes / 60;
        int remainingMinutes = minutes % 60;

        if (hours > 0 && remainingMinutes > 0) {
            return hours + "h " + remainingMinutes + "min";
        } else if (hours > 0) {
            return hours + "h";
        } else {
            return remainingMinutes + "min";
        }
    }

    // Busca Parkings que esten por finalizar
    public List<ParkingMapDTO> getParkingsAboutToFinish(){
        List<Parking> parkings = parkingRepository.findByStatus(ParkingStatus.ABOUT_TO_FINISH);
        return parkings.stream()
                .map(p -> new ParkingMapDTO(p.getId(), p.getAddress()))
                .collect(Collectors.toList());
    }

    public Parking createParking(ParkingRequestDTO ParkingRequestDTO){
        Long userId = AuthService.getAuthenticatedUserId();

        balanceService.checkMinimumBalance(userId);

        Parking parking = new Parking(
                userId,
                ParkingRequestDTO.getPlateId(),
                LocalDateTime.now(),
                null,
                ParkingRequestDTO.getAddress(),
                ParkingRequestDTO.getDurationMinutes(),
                ParkingStatus.ACTIVE,
                BigDecimal.ZERO
        );

        parking.calculatePrice();
        return parkingRepository.save(parking);
    }

    private Parking processParkingPaymentAndFinalize(Parking parking){

        long realMinutes = java.time.Duration.between(parking.getStartTime(), LocalDateTime.now()).toMinutes();
        parking.setDurationMinutes((int) realMinutes);

        BigDecimal finalPrice = parking.calculatePrice();

        TransactionResponseDTO transactionResult = balanceService.subtractBalance(
                parking.getUserId(),
                finalPrice
        );
        log.info(
            "Parking ID: {} finalizado y cobrado. | Mensaje de Pago: {} | Nuevo Saldo del usuario {}: {}",
            parking.getId(),
            transactionResult.getMessage(),
            transactionResult.getUserId(),
            transactionResult.getNewBalance()
        );

        parking.setStatus(ParkingStatus.FINISHED);

        return parkingRepository.save(parking);
    }

    //Finaliza el estacionamiento de manera MANUAL
    public Parking finishParking(Long parkingId){
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(()-> new RuntimeException("Parking not found"));

        if (parking.getStatus() == ParkingStatus.FINISHED){
            return parking;
        }

        return this.processParkingPaymentAndFinalize(parking);
    }

    //Finaliza el estacionamiento Automaticamente una vez que termina el tiempo de duracion
    @Scheduled(fixedRateString = "${parking.schedule.fixedRate}")
    public void AutoFinishExpiredParkings() {
        List<Parking> expiringParkings = parkingRepository.findByStatus(ParkingStatus.ABOUT_TO_FINISH);
        for (Parking parking : expiringParkings) {
            if (parking.isFinished()) {
                try {
                    this.processParkingPaymentAndFinalize(parking);
                } catch (Exception e) {
                    log.error("Error al procesar el cobro automatico para Parking ID: {}", parking.getId(), e);
                }
            }
        }
    }

    //Marca automaticamente un estacionamiento como "Por finalizar"
    @Scheduled(fixedRateString = "${parking.schedule.fixedRate}")
    public void markParkingsAboutToFinish() {
        List<Parking> active = parkingRepository.findByStatus(ParkingStatus.ACTIVE);
        for (Parking p : active) {
            if (p.isAboutToFinish()) {
                p.setStatus(ParkingStatus.ABOUT_TO_FINISH);
                parkingRepository.save(p);

                Optional<Users> user = userService.getUserById(p.getUserId());

                user.ifPresent(u -> {
                    List<UserDevice> userDevices = userDeviceRepository.findAllByUser(u);
                    for (UserDevice userDevice : userDevices) {
                        fcmMessagingService.sendNotification(
                                userDevice.getDeviceToken().getFcmToken(),
                                "Estacionamiento por finalizar",
                                "Tu estacionamiento en " + p.getAddress() + " está por finalizar."
                        );
                    }
                });
            }
        }
    }

    private BigDecimal calculateCurrentPrice(Parking parking) {
        long realMinutes = java.time.Duration.between(parking.getStartTime(), LocalDateTime.now()).toMinutes();

        if (realMinutes <= 0) {
            return BigDecimal.ZERO;
        }

        int timeBlocks = (int) Math.ceil(realMinutes/10.0);
        return BigDecimal.valueOf(timeBlocks * 100L);
    }

    @Scheduled(fixedRate = 60000)
    public void checkCreditLimitAndAutoFinish() {
        List<Parking> activeParkings = parkingRepository.findByStatus(ParkingStatus.ACTIVE);
        for (Parking parking : activeParkings) {
            try {
                Users user = usersRepository.findById(parking.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                BigDecimal currentBalance = user.getBalance();
                BigDecimal currentPrice = this.calculateCurrentPrice(parking);
                BigDecimal projectedBalance = currentBalance.subtract(currentPrice);
                if (projectedBalance.compareTo(CREDIT_LIMIT) <= 0) {
                    log.warn(
                            "Parking ID {} detenido automáticamente. Límite de crédito de {} excedido. Saldo Proyectado: {}",
                            parking.getId(),
                            CREDIT_LIMIT,
                            projectedBalance
                    );
                    this.processParkingPaymentAndFinalize(parking);
                } else {
                    log.info(
                            "Parking ID {} activo. Balance: {} - Precio actual: {} = Proyectado: {} (Límite: {})",
                            parking.getId(),
                            currentBalance,
                            currentPrice,
                            projectedBalance,
                            CREDIT_LIMIT
                    );
                }
            } catch (Exception e) {
                log.error("Error al verificar límite de crédito para Parking ID: {}", parking.getId(), e);
            }
        }
    }

    public void delete(Long id){
        parkingRepository.deleteById(id);
    }
}
