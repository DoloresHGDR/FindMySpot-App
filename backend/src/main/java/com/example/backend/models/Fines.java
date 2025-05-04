package com.example.backend.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Fines {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer id_user;
    private Integer id_plate;
    private String description;
    private Float amount;
    private LocalDateTime datetime;

    public Fines() {

    }
    public Fines(Integer id_user, Integer id_plate, String description, Float amount) {
        this.id_user = id_user;
        this.id_plate = id_plate;
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
    public Integer getId_user() {
        return id_user;
    }
    public void setId_user(Integer id_user) {
        this.id_user = id_user;
    }
    public Integer getId_plate() {
        return id_plate;
    }
    public void setId_plate(Integer id_plate) {
        this.id_plate = id_plate;
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

