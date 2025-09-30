package com.example.backend.controller;
import com.example.backend.models.Users;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class FcmTokenController {

    private final AuthService authService;

    public FcmTokenController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/save-fcm-token")
    public ResponseEntity<?> saveFcmToken(@Valid @RequestBody Map<String,String> requestBody) {
        String token = requestBody.get("token");
        String platform =  requestBody.get("platform");

        Users user = AuthService.getAuthenticatedUser();

        authService.registerDeviceToken(user, token, platform);

        return ResponseEntity.ok("Token saved");
    }
}
