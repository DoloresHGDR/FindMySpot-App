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
    private Long plateId;

    public Fines () {
    }

    public Fines(Long id, String description, Float amount, LocalDateTime datetime, Long plateId) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.datetime = datetime;
        this.plateId = plateId;
    }
}
