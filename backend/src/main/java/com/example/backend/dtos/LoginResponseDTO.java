package com.example.backend.dtos;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String name;
    private String surname;
    private String identityNumber;
    private String role;
}
