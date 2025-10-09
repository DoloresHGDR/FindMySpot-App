package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class FinesResponse {
        private Long id;
        private String description;
        private Float amount;
        private LocalDateTime datetime;
        private String address;
        private String plateNumber;
}
