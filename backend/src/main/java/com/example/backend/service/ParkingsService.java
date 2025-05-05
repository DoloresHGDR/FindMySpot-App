package com.example.backend.service;
import com.example.backend.models.Parkings;
import com.example.backend.repository.ParkingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ParkingsService {
    private ParkingsRepository parkingsRepository;

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

    public Parkings save(Parkings parking){
        return parkingsRepository.save(parking);
    }

    public void delete(Long id){
        parkingsRepository.deleteById(id);
    }
}
