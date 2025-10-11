package com.example.backend.service;

import com.example.backend.dtos.FinesRequest;
import com.example.backend.dtos.FinesResponse;
import com.example.backend.models.Fines;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class FinesService {
    private final PlatesService platesService;
    private final WebClient webClient;

    public FinesService(PlatesService platesService, WebClient webClient) {
        this.platesService = platesService;
        this.webClient = webClient;
    }

    public List<Fines> findByUserIdentityNumber(String identityNumber) {
        List<FinesResponse> response;
        try {
            response = webClient.post()
                    .uri("/fines/")
                    .bodyValue(new FinesRequest(identityNumber))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<FinesResponse>>() {})
                    .block();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw e;
        }

        if (response == null || response.isEmpty()) {
            return Collections.emptyList();
        }

        List<Fines> finesList = new ArrayList<>();
        response
                .forEach (fine -> {
                    Long plateId = platesService.findByPlateNumber(fine.getPlateNumber()).getId();
                    Fines element = new Fines(
                            fine.getId(),
                            fine.getDescription(),
                            fine.getAmount(),
                            fine.getDatetime(),
                            fine.getAddress(),
                            plateId
                    );
                    finesList.add(element);
                });
        return finesList;
    };

}
