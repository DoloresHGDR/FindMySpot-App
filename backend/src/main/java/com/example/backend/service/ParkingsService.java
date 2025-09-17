package com.example.backend.service;
import com.example.backend.dtos.HistoryDTO;
import com.example.backend.dtos.ParkingRequestDTO;
import com.example.backend.models.*;
import com.example.backend.models.enums.ParkingStatus;
import com.example.backend.repository.ParkingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.backend.dtos.ParkingMapDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ParkingsService {
    private final ParkingsRepository parkingsRepository;
    private final PlatesService platesService;
    private final UserService userService;
    private final FcmMessagingService fcmMessagingService;
    private final FcmTokenService fcmTokenService;

    @Autowired
    public ParkingsService(ParkingsRepository parkingsRepository, PlatesService platesService, UserService userService, FcmMessagingService fcmMessagingService, FcmTokenService fcmTokenService) {
        this.parkingsRepository = parkingsRepository;
        this.platesService = platesService;
        this.userService = userService;
        this.fcmMessagingService = fcmMessagingService;
        this.fcmTokenService = fcmTokenService;
    }


    public List<Parkings> findAllParkings(){
        return parkingsRepository.findAll();
    }

    public Optional<Parkings> findParkingsById(Long id){
        return parkingsRepository.findById(id);
    }

    private HistoryDTO mapToHistoryDTO(Parkings parking) {
        Long id = parking.getId();
        String plate = platesService.findById(parking.getPlateId()).get().getNumber();
        String address = parking.getAddress();
        LocalDateTime startDate = parking.getStartTime();
        LocalDateTime endDate = parking.getEndTime();
        String duration = formatDuration(parking.getDurationMinutes());
        String price = parking.getPrice().toString();

        return new HistoryDTO(id, startDate, endDate, address, plate, duration, price);
    }

    public List<HistoryDTO> getLast3DistinctParkings(Long userId) {
        List<Parkings> parkings = parkingsRepository.findLast3DistinctByAddress(userId);
        // stream convierte la lista en una secuencia de elementos al que se le puede aplicar map
        // map toma cada elemento del stream parkings y el this:: dice que para cada objeto parking de parkings va a llamar a la funcion
        // collect toma todos los elementos del stream y con toList los convierte nuevamente en una lista.
        return parkings.stream().map(this::mapToHistoryDTO).collect(Collectors.toList());

    }

    // Busca una lista de parkings hechos por un usuario especifico, sirve para el historial.

    public List<HistoryDTO> getParkingHistoryByUserId(Long userId, Long plateId) {
        List<Parkings> parkings = parkingsRepository.findByUserIdAndPlateIdOrderByStartTimeDesc(userId, plateId);

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
        List<Parkings> parkings = parkingsRepository.findByStatus(ParkingStatus.ABOUT_TO_FINISH);
        return parkings.stream()
                .map(p -> new ParkingMapDTO(p.getId(), p.getAddress()))
                .collect(Collectors.toList());
    }

    public Parkings createParking(ParkingRequestDTO ParkingRequestDTO){
        Parkings parking = new Parkings(
                ParkingRequestDTO.getUserId(),
                ParkingRequestDTO.getPlateId(),
                LocalDateTime.now(),
                null,
                ParkingRequestDTO.getAddress(),
                ParkingRequestDTO.getDurationMinutes(),
                ParkingStatus.ACTIVE,
                BigDecimal.ZERO
        );

        parking.calculatePrice();
        return parkingsRepository.save(parking);
    }

    //Finaliza el estacionamiento de manera MANUAL
    public Parkings finishParking(Long parkingId){
        Parkings parking = parkingsRepository.findById(parkingId)
                .orElseThrow(()-> new RuntimeException("Parking not found"));

        if (parking.getStatus() == ParkingStatus.FINISHED){
            return parking;
        }

        long realMinutes = java.time.Duration.between(parking.getStartTime(), LocalDateTime.now()).toMinutes();
        parking.setDurationMinutes((int) realMinutes);
        parking.calculatePrice();
        parking.setStatus(ParkingStatus.FINISHED);

        return parkingsRepository.save(parking);
    }

    //Finaliza el estacionamiento Automaticamente una vez que termina el tiempo de duracion
    @Scheduled(fixedRateString = "${parking.schedule.fixedRate}")
    public void AutoFinishExpiredParkings() {
        List<Parkings> expiringParkings = parkingsRepository.findByStatus(ParkingStatus.ABOUT_TO_FINISH);
        for (Parkings parking : expiringParkings) {
            if (parking.isFinished()) {
                long realMinutes = java.time.Duration.between(parking.getStartTime(), LocalDateTime.now()).toMinutes();
                parking.setDurationMinutes((int) realMinutes);
                parking.calculatePrice();
                parking.setStatus(ParkingStatus.FINISHED);
                parkingsRepository.save(parking);
            }
        }
    }

    //Marca automaticamente un estacionamiento como "Por finalizar"
    @Scheduled(fixedRateString = "${parking.schedule.fixedRate}")
    public void markParkingsAboutToFinish() {
        List<Parkings> active = parkingsRepository.findByStatus(ParkingStatus.ACTIVE);
        for (Parkings p : active) {
            if (p.isAboutToFinish()) {
                p.setStatus(ParkingStatus.ABOUT_TO_FINISH);
                parkingsRepository.save(p);

                Optional<Users> user = userService.getUserById(p.getUserId());

                List<FcmToken> tokens = fcmTokenService.findByUser(user);
                for (FcmToken token : tokens) {
                    fcmMessagingService.sendNotification(
                            token.getFcmToken(),
                            "Estacionamiento por finalizar",
                            "Tu estacionamiento en " + p.getAddress() + " esta por finalizar."
                    );
                }
            }
        }
    }



    public void delete(Long id){
        parkingsRepository.deleteById(id);
    }
}
