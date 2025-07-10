package com.example.backend.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Plates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String number;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Plates() {
    }

    public Plates(String number, Long userId) {
        this.number = number;
        this.userId = userId;
    };
}

