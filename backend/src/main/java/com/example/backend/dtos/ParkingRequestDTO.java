package com.example.backend.dtos;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingRequestDTO {

    @NotNull(message= "El usuario es obligatorio")
    private Long userId;

    @NotNull(message= "La patente es obligatoria")
    private Long plateId;

    @NotBlank(message = "La direccion es obligatoria")
    @Size(max = 100, message = "La direccion no puede contener mas de 100 caracteres")
    private String address;

    @NotNull(message = "La duracion es obligatoria")
    @Min(value = 10, message = "La duracion minima es de 10 minutos")
    @Max(value = 240, message = "La duracion maxima es de 240 minutos")
    private Integer durationMinutes;

}
