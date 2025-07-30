package com.example.backend.dtos;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class HistoryDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String address;
    private String plate;
    private String duration;
    private String price;
}
