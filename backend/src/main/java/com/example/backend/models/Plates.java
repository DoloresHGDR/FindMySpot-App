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

    @Embedded
    private VehicleDetails vehicleDetails;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Plates() {
    }

    public Plates(String number, VehicleDetails vehicleDetails, Long userId) {
        this.number = number;
        this.vehicleDetails = vehicleDetails;
        this.userId = userId;
    };
}

