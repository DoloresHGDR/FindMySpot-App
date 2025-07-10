package com.example.backend.dtos;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserIdDTO {
    @NotNull(message = "El ID de usuario es obligatorio")
    private Long id;

}
