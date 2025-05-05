package com.example.backend.models;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Parkings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer id_user;
    private Integer id_plate;
    private LocalDate date;
    private String address;
    private LocalTime duration;
    private String status;

    public Parkings() {}

    public Parkings(Integer id_user, Integer id_plate, LocalDate date, String address, LocalTime duration, String status) {
        this.id_user = id_user;
        this.id_plate = id_plate;
        this.date = date;
        this.address = address;
        this.duration = duration;
        this.status = status;
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
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public LocalTime getDuration() {
        return duration;
    }
    public void setDuration(LocalTime duration) {
        this.duration = duration;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}

