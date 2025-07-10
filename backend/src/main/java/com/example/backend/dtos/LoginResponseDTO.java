package com.example.backend.dtos;
import com.example.backend.models.Plates;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String name;
    private String surname;
    private String identityNumber;
    private String role;
    private List<Plates> plates;

}

