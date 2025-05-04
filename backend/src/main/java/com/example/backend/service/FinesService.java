package com.example.backend.service;
import com.example.backend.models.Fines;
import com.example.backend.repository.FinesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FinesService {
    private final FinesRepository finesRepository;

    @Autowired
    public FinesService(FinesRepository finesRepository) {
        this.finesRepository = finesRepository;
    }
    public List<Fines> findAll() {
        return finesRepository.findAll();
    }
    public Optional<Fines> findById(Long id) {
        return finesRepository.findById(id);
    }
    public Fines save(Fines fines) {
        return finesRepository.save(fines);
    }
    public void deleteById(Long id) {
        finesRepository.deleteById(id);
    }
}