package com.example.backend.models;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Fines {
    private Long id;
    private String description;
    private Float amount;
    private LocalDateTime datetime;
    private String address;
    private Long plateId;

    public Fines () {
    }

    public Fines(Long id, String description, Float amount, LocalDateTime datetime, String address, Long plateId) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.datetime = datetime;
        this.address = address;
        this.plateId = plateId;
    }
}
