package com.example.backend.service;

import com.example.backend.models.DeviceToken;
import com.example.backend.models.UserDevice;
import com.example.backend.models.Users;
import com.example.backend.repository.DeviceTokenRepository;
import com.example.backend.repository.UserDeviceRepository;
import com.example.backend.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static UserService userService;
    private final DeviceTokenRepository deviceTokenRepository;
    private final UserDeviceRepository userDeviceRepository;

    public AuthService(UserService userService, DeviceTokenRepository deviceTokenRepository, UserDeviceRepository userDeviceRepository) {
        AuthService.userService = userService;
        this.deviceTokenRepository = deviceTokenRepository;
        this.userDeviceRepository = userDeviceRepository;
    }

    public static Users getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Users user = userService.getUserByIdentityNumber(userDetails.getIdentityNumber());

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }

        return user;
    }

    public static Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) principal).getId();
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Principal");
    }

    public void registerDeviceToken(Users user, String fcmToken, String platform) {
        DeviceToken deviceToken = deviceTokenRepository.findByFcmToken(fcmToken)
                .orElseGet(() -> {
                    DeviceToken newToken = new DeviceToken();
                    newToken.setFcmToken(fcmToken);
                    newToken.setPlatform(platform);
                    newToken.setCreatedAt(LocalDateTime.now());
                    return deviceTokenRepository.save(newToken);
                });

        userDeviceRepository.findByUserAndDeviceToken(user, deviceToken)
                .ifPresentOrElse(
                        existingAssociation -> {
                            existingAssociation.setLastLoggedIn(LocalDateTime.now());
                            userDeviceRepository.save(existingAssociation);
                        },
                        () -> {
                            UserDevice newAssociation = new UserDevice();
                            newAssociation.setUser(user);
                            newAssociation.setDeviceToken(deviceToken);
                            newAssociation.setLastLoggedIn(LocalDateTime.now());
                            userDeviceRepository.save(newAssociation);
                        }
                );
    }
}
