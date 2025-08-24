package com.example.backend.controller;
import com.example.backend.dtos.PlateRequestDTO;
import com.example.backend.models.Plates;
import com.example.backend.service.PlatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
/* A */

@RestController
@RequestMapping("api/plates")
public class PlatesController {

    private final PlatesService platesService;

    @Autowired
    public PlatesController(PlatesService platesService) {
        this.platesService = platesService;
    }

    @GetMapping
    public List<Plates> getAll() {
        return platesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plates> getById(@PathVariable Long id) {
        Optional<Plates> plates = platesService.findById(id);
        return plates.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{id}")
    public List<Plates> getByUserId(@PathVariable Long id) {
        return platesService.findAllByUserId(id);
    }

    @PostMapping
    public Plates save(@RequestBody PlateRequestDTO plateRequest) {
        return platesService.save(plateRequest.getNumber());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        platesService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    
}
