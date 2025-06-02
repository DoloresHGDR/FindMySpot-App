package com.example.backend.models;
import com.example.backend.models.enums.ParkingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Parkings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plate_id", nullable = false)
    private Plates plate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String address;
    private int durationMinutes;
    @Enumerated(EnumType.STRING)
    private ParkingStatus status;
    private BigDecimal price;

    public Parkings() {}

    public Parkings(Users user, Plates plate, LocalDateTime startTime, LocalDateTime endTime, String address, int durationMinutes, ParkingStatus status, BigDecimal price) {
        this.user = user;
        this.plate = plate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.address = address;
        this.durationMinutes = durationMinutes;
        this.status = status;
        this.price = price;
    }

    public boolean isAboutToFinish() {
        LocalDateTime endTime = startTime.plusMinutes(durationMinutes);
        return LocalDateTime.now().isAfter(endTime.minusMinutes(5)) &&
                LocalDateTime.now().isBefore(endTime);
    }

    public boolean isFinished() {
        return LocalDateTime.now().isAfter(startTime.plusMinutes(durationMinutes));
    }

    public void updateEndTime() {
        this.endTime = this.startTime.plusMinutes(this.durationMinutes);
    }

    public void calculatePrice() {
        int timeBlocks = (int) Math.ceil(durationMinutes / 10.0);
        this.price = BigDecimal.valueOf(timeBlocks * 100L);
        updateEndTime();
    }

}

