package com.example.backend.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "plate_id")
    private Plates plate;

    public Fines() {

    }
    public Fines(Plates plate, String description, Float amount) {
        this.plate = plate;
        this.description = description;
        this.amount = amount;
        this.datetime = LocalDateTime.now();
    }

}

