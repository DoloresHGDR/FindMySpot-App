package com.example.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try (InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("config/firebase-service-account.json")) {
            if (serviceAccount == null) {
                throw new IOException("Firebase service account file not found in classpath: config/firebase-service-account.json");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase app has been initialized");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
