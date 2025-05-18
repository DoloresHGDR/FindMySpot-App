package com.example.backend.models;
import jakarta.persistence.*;
import java.util.List;


@Entity
public class Plates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String number;
    private boolean parked;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
    @OneToMany(mappedBy = "plate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parkings> parkings;
    @OneToMany(mappedBy = "plate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fines> fines;


    public Plates() {
    }

    public Plates(String number, boolean parked, Users user, List<Parkings> parkings, List<Fines> fines) {
        this.number = number;
        this.parked = parked;
        this.user = user;
        this.parkings = parkings;
        this.fines = fines;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNumber() {
        return number;
    }
    public void setNumber(String number) {
        this.number = number;
    }
    public boolean getParked() {
        return parked;
    }
    public void setParked(boolean parked) {
        this.parked = parked;
    }
    public Users getUser() {
        return user;
    }
    public void setUser(Users user) {
        this.user = user;
    }
    public List<Parkings> getParkings() {
        return parkings;
    }
    public void setParkings(List<Parkings> parkings) {
        this.parkings = parkings;
    }

}

