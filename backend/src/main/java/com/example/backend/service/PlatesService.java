package com.example.backend.service;
import com.example.backend.models.Plates;
import com.example.backend.repository.PlatesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlatesService {
    private final PlatesRepository platesRepository;

    @Autowired
    public PlatesService(PlatesRepository platesRepository) {
        this.platesRepository = platesRepository;
    }

    public List<Plates> findAll() {
        return platesRepository.findAll();
    }

    public Optional<Plates> findById(Long id) {
        return platesRepository.findById(id);
    }

    public Plates findByUserId(Long userId) {
        return platesRepository.findByUserId(userId);
    }

    public Plates save(Plates plates) {
        return platesRepository.save(plates);
    }
    public void delete(Long id) {
        platesRepository.deleteById(id);
    }
    
}
