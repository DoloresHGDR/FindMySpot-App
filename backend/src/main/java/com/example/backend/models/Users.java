package com.example.backend.models;
import jakarta.persistence.*;
import java.util.List;


@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String identity_number;
    private String password;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Plates> plates;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parkings> parkings;
    private String role;

    public Users() {
    }

    public Users(String name, String surname, String identity_number, String password, List<Plates> plates, List<Parkings> parkings, String role) {
        this.name = name;
        this.surname = surname;
        this.identity_number = identity_number;
        this.plates = plates;
        this.parkings = parkings;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSurname() {
        return surname;
    }
    public void setSurname(String surname) {
        this.surname = surname;
    }
    public String getIdentity_number() {
        return identity_number;
    }
    public void setIdentity_number(String identity_number) {
        this.identity_number = identity_number;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public List<Plates> getPlates() {
        return plates;
    }
    public void setPlates(List<Plates> plates) {
        this.plates = plates;
    }
    public List<Parkings> getParkings() {
        return parkings;
    }
    public void setParkings(List<Parkings> parkings) {
        this.parkings = parkings;
    }
}
