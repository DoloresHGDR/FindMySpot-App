package com.example.backend.models;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Fines {
    @Id
    @GeneratedValue
    private Long id;
    private Integer id_user;
    private Integer id_plate;
    private String description;
    private Float amount;
    private LocalDateTime datetime;
}
