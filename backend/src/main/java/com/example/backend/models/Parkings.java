package com.example.backend.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Parkings {
    @Id
    @GeneratedValue
    private Long id;
    private Integer id_user;
    private Integer id_plate;
    private LocalDateTime date;
    private String address;
    @Temporal(TemporalType.TIMESTAMP)
    private Date time_to_expire;
}
