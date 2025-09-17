package com.example.backend.service;

import com.example.backend.models.Fines;
import com.example.backend.models.Plates;
import com.example.backend.repository.FinesRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FinesService {
    private final FinesRepository finesRepository;
    private final PlatesService platesService;

    public FinesService(FinesRepository finesRepository, PlatesService platesService) {
        this.finesRepository = finesRepository;
        this.platesService = platesService;
    }

    public List<Fines> findAll() {
        return finesRepository.findAll();
    }
    public Optional<Fines> findById(Long id) {
        return finesRepository.findById(id);
    }

    public List<Fines> findByUserId(Long userId) {
        List<Plates> plates = platesService.findAllByUserId(userId);
        List<Fines> fines = new ArrayList<>();

        for (Plates plate : plates) {
            List<Fines> finesForPlate = finesRepository.findByPlateId(plate.getId());
            fines.addAll(finesForPlate);
        }

        return fines;
    }

    public Fines save(Fines fines) {
        return finesRepository.save(fines);
    }

    public void deleteById(Long id) {
        finesRepository.deleteById(id);
    }

}
