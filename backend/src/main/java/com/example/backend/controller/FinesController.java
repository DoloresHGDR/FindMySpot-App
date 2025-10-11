package com.example.backend.controller;

import com.example.backend.models.Fines;
import com.example.backend.models.Users;
import com.example.backend.service.AuthService;
import com.example.backend.service.FinesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/fines")
public class FinesController {

    private final FinesService finesService;

    public FinesController(FinesService finesService) {
        this.finesService = finesService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<Fines>> findByUserIdentityNumber() {
        Users user = AuthService.getAuthenticatedUser();
        List<Fines> fines = finesService.findByUserIdentityNumber(user.getIdentityNumber());

        return ResponseEntity.ok(fines);

    }
}
