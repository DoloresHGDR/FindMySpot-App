package com.example.backend.models;
import jakarta.persistence.*;


@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String dni;
    private String password;
    private Integer id_plate;
    private Integer id_fines;

    public User() {
    }

    public User(String name, String surname, String dni, String password, Integer id_plate, Integer id_fines) {
        this.name = name;
        this.surname = surname;
        this.dni = dni;
        this.password = password;
        this.id_plate = id_plate;
        this.id_fines = id_fines;
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
    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getId_plate() {
        return id_plate;
    }
    public void setId_plate(Integer id_plate) {
        this.id_plate = id_plate;
    }
    public Integer getId_fines() {
        return id_fines;
    }
    public void setId_fines(Integer id_fines) {
        this.id_fines = id_fines;
    }
}
