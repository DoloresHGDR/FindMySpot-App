package com.example.backend.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
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
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Plates getPlate() {
        return plate;
    }
    public void setPlate(Plates plate) {
        this.plate = plate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Float getAmount() {
        return amount;
    }
    public void setAmount(Float amount) {
        this.amount = amount;
    }
    public LocalDateTime getDatetime() {
        return datetime;
    }
    public void setDatetime(LocalDateTime datetime) {
        this.datetime = datetime;
    }

}

