package com.example.backend.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    @Column(unique = true, nullable = false)
    private String identityNumber;
    private String password;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Plates> plates;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parkings> parkings;
    private String role;

    public Users() {
    }

    public Users(String name, String surname, String identityNumber, String password, List<Plates> plates, List<Parkings> parkings, String role) {
        this.name = name;
        this.surname = surname;
        this.identityNumber = identityNumber;
        this.plates = plates;
        this.parkings = parkings;
        this.password = password;
        this.role = role;
    }
}
