package com.example.backend.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class FcmToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "fcm_token", nullable = false, length = 512, unique = true)
    private String fcmToken;

    @Column(name = "platform", nullable = false, length = 20)
    private String platform;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    public FcmToken() {}

    public FcmToken(Users user, String fcmToken, String platform, LocalDateTime lastUpdated) {
        this.user = user;
        this.fcmToken = fcmToken;
        this.platform = platform;
        this.lastUpdated = lastUpdated;
    }
}
