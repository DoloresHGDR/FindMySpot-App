package com.example.backend.controller;
import com.example.backend.models.Fines;
import com.example.backend.service.FinesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/fines")
public class FinesController {

    private final FinesService finesService;

    @Autowired
    public FinesController(FinesService finesService) {
        this.finesService = finesService;
    }

    @GetMapping
    public List<Fines> getAll() {
        return finesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fines> getById(@PathVariable Long id) {
        Optional<Fines> fines = finesService.findById(id);
        return fines.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Fines save(@RequestBody Fines fines) {
        return finesService.save(fines);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        finesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}