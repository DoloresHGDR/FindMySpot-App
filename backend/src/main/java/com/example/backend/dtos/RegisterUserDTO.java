package com.example.backend.dtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$", message = "El nombre solo puede contener letras y espacios")
    private String name;

    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$", message = "El apellido solo puede contener letras y espacios")
    @NotBlank(message = "El apellido es obligatorio")
    private String surname;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{6,10}$", message = "El DNI debe tener entre 6 y 10 dígitos")
    private String identityNumber;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @Pattern(regexp = "^(USER|ADMIN)$", message = "El rol debe ser 'USER' o 'ADMIN'")
    private String role = "USER";

}
