package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Fines {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private Float amount;
    private LocalDateTime datetime;
    private String address;

    @ManyToOne
    @JoinColumn(name = "plate_id")
    private Plates plate;

    public Fines () {
    }
}
