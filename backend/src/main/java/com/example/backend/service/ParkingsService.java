package com.example.backend.service;
import com.example.backend.models.Parkings;
import com.example.backend.models.enums.ParkingStatus;
import com.example.backend.repository.ParkingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.backend.dtos.ParkingMapDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ParkingsService {
    private final ParkingsRepository parkingsRepository;

    @Autowired
    public ParkingsService(ParkingsRepository parkingsRepository) {
        this.parkingsRepository = parkingsRepository;
    }

    public List<Parkings> findAllParkings(){
        return parkingsRepository.findAll();
    }

    public Optional<Parkings> findParkingsById(Long id){
        return parkingsRepository.findById(id);
    }

    // Busca una lista de parkings hechos por un usuario especifico, sirve para el historial.
    public List<Parkings> getParkingHistoryByUserId(Long userId){
        return parkingsRepository.findByUser_Id(userId);
    }

    // Busca Parkings que esten por finalizar
    public List<ParkingMapDTO> getParkingsAboutToFinish(){
        List<Parkings> parkings = parkingsRepository.findByStatus(ParkingStatus.ABOUT_TO_FINISH);
        return parkings.stream()
                .map(p -> new ParkingMapDTO(p.getId(), p.getAddress()))
                .collect(Collectors.toList());
    }

    public Parkings createParking(Parkings parking){
        if (parking.getDurationMinutes() < 10) {
            throw new IllegalArgumentException("The duration minutes must be at least 10");
        }

        parking.setStartTime(LocalDateTime.now());
        parking.setStatus(ParkingStatus.ACTIVE);
        parking.calculatePrice();
        return parkingsRepository.save(parking);
    }

    //Finaliza el estacionamiento de manera MANUAL
    public Parkings finishParking(Long parkingId){
        Parkings parking = parkingsRepository.findById(parkingId)
                .orElseThrow(()-> new RuntimeException("Parking not found"));

        if (parking.getStatus() == ParkingStatus.ACTIVE){
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
            }
        }
    }

    public void delete(Long id){
        parkingsRepository.deleteById(id);
    }
}
