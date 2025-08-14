package com.example.backend.service;

import com.example.backend.models.FcmToken;
import com.example.backend.models.Users;
import com.example.backend.repository.FcmTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FcmTokenService {

    private final FcmTokenRepository fcmTokenRepository;

    public FcmTokenService(FcmTokenRepository fcmTokenRepository) {
        this.fcmTokenRepository = fcmTokenRepository;
    }

    public FcmToken saveOrUpdateToken(Users user, String token, String platform) {
        Optional<FcmToken> existingTokenOpt = fcmTokenRepository.findByUserAndFcmToken(user, token);

        if (existingTokenOpt.isPresent()) {
            FcmToken existingToken = existingTokenOpt.get();
            existingToken.setLastUpdated(LocalDateTime.now());
            return fcmTokenRepository.save(existingToken);
        } else {
            FcmToken fcmToken = new FcmToken(user, token, platform, LocalDateTime.now());
            return fcmTokenRepository.save(fcmToken);
        }
    }

    public List<FcmToken> findByUser(Optional<Users> user) {
        return fcmTokenRepository.findAllByUser(user);
    }
}
