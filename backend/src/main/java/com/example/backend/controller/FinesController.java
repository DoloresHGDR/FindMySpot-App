package com.example.backend.controller;

import com.example.backend.models.Fines;
import com.example.backend.models.Users;
import com.example.backend.service.AuthService;
import com.example.backend.service.FinesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/fines")
public class FinesController {

    private final FinesService finesService;

    public FinesController(FinesService finesService) {
        this.finesService = finesService;
    }

    @GetMapping
    public List<Fines> findAll() {
        return finesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fines> findById(@PathVariable Long id) {
        Optional<Fines> fines = finesService.findById(id);
        return fines.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Fines>> findByUserId() {
        Users user = AuthService.getAuthenticatedUser();
        List<Fines> fines = finesService.findByUserId(user.getId());

        return ResponseEntity.ok(fines);

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
