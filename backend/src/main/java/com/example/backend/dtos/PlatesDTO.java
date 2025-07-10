package com.example.backend.dtos;
import com.example.backend.models.Plates;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlatesDTO {
    private Long id;
    private String number;

    public PlatesDTO(Plates plate) {
        this.id = plate.getId();
        this.number = plate.getNumber();
    }
}
