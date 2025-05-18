package com.example.backend.models;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Parkings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
    @ManyToOne
    @JoinColumn(name = "plate_id")
    private Plates plate;
    private LocalDate date;
    private String address;
    private LocalTime duration;
    private String status;

    public Parkings() {}

    public Parkings(Users user, Plates plate, LocalDate date, String address, LocalTime duration, String status) {
        this.user = user;
        this.plate = plate;
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
    public Users getUser() {
        return user;
    }
    public void setUser(Users user) {
        this.user = user;
    }
    public Plates getPlate() {
        return plate;
    }
    public void setPlate(Plates plate) {
        this.plate = plate;
    }

}

