package com.example.backend.service;
import com.example.backend.dtos.ValidationRequest;
import com.example.backend.dtos.ValidationResponse;
import com.example.backend.models.Plates;
import com.example.backend.models.Users;
import com.example.backend.repository.PlatesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Optional;

@Service
public class PlatesService {
    private final PlatesRepository platesRepository;
    private final WebClient webClient;

    @Autowired
    public PlatesService(PlatesRepository platesRepository, WebClient webClient) {
        this.platesRepository = platesRepository;
        this.webClient = webClient;
    }

    public List<Plates> findAll() {
        return platesRepository.findAll();
    }

    public Optional<Plates> findById(Long id) {
        return platesRepository.findById(id);
    }

    public Plates findByUserId(Long userId) {
        return platesRepository.findByUserId(userId);
    }

    public List<Plates> findAllByUserId(Long userId) {
        return platesRepository.findAllByUserId(userId);
    }



    public Plates save (String plate) {
        Users user = AuthService.getAuthenticatedUser();
        ValidationResponse response;

        try {
            response = webClient.post()
                    .uri("/validate-plate")
                    .bodyValue(new ValidationRequest(plate, user.getIdentityNumber()))
                    .retrieve()
                    .bodyToMono(ValidationResponse.class)
                    .block();

        } catch (Exception ex) {
            System.out.println("Error al llamar mock-api: " + ex.getMessage());
            throw ex;
        }

        if (response == null || !response.valid() || response.vehicleDetails() == null) {
            throw new IllegalArgumentException("La matrícula no corresponde al DNI proporcionado");
        }

        Plates p = new Plates(
                plate,
                response.vehicleDetails(),
                user.getId()
        );
        return platesRepository.save(p);
    }

    public void delete(Long id) {
        platesRepository.deleteById(id);
    }



 }
