package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Embeddable
public class VehicleDetails {

    @Column(name = "vehicle_model")
    private String model;

    @Column(name = "vehicle_brand")
    private String brand;

    @Column(name = "vehicle_type")
    private String type;

    @Column(name = "chassis_number", unique = true)
    private String chassis;

    @Column(name = "engine_number", unique = true)
    private String engine;

    public VehicleDetails(String model, String brand, String type, String chassis, String engine) {
        this.model = model;
        this.brand = brand;
        this.type = type;
        this.chassis = chassis;
        this.engine = engine;
    }

    public VehicleDetails() {

    }
}
