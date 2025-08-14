package com.example.backend.controller;
import com.example.backend.models.Users;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.service.FcmTokenService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class FcmTokenController {

    private final FcmTokenService fcmTokenService;
    private final UserService userService;

    public FcmTokenController(FcmTokenService fcmTokenService, UserService userService) {
        this.fcmTokenService = fcmTokenService;
        this.userService = userService;
    }

    @PostMapping("/save-fcm-token")
    public ResponseEntity<?> saveFcmToken(@Valid @RequestBody Map<String,String> requestBody, Principal principal) {
        String token = requestBody.get("token");
        String platform =  requestBody.get("platform");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String identityNumber = userDetails.getIdentityNumber();

        Users user = userService.getUserByIdentityNumber(identityNumber);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        fcmTokenService.saveOrUpdateToken(user, token, platform);
        return ResponseEntity.ok("Token saved");
    }
}
