package com.example.backend.service;

import com.example.backend.dtos.FinesRequest;
import com.example.backend.dtos.FinesResponse;
import com.example.backend.models.Fines;
import com.example.backend.models.Plates;
import com.example.backend.repository.FinesRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class FinesService {
    private final FinesRepository finesRepository;
    private final PlatesService platesService;
    private final WebClient webClient;

    public FinesService(FinesRepository finesRepository, PlatesService platesService, WebClient webClient) {
        this.finesRepository = finesRepository;
        this.platesService = platesService;
        this.webClient = webClient;
    }

    public List<Fines> findAll() {
        return finesRepository.findAll();
    }
    public Optional<Fines> findById(Long id) {
        return finesRepository.findById(id);
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
            response = Collections.emptyList();
            throw e;
        }
        List<Fines> finesList = new ArrayList<>();
        assert response != null;
        response
                .forEach (fine -> {
                        Fines element = new Fines(
                                fine.getId(),
                                fine.getDescription(),
                                fine.getAmount(),
                                fine.getDatetime(),
                                fine.getAddress(),
                                platesService.findByPlateNumber(fine.getPlateNumber()).getId()
                        );
                        finesList.add(element);
                }
                );
        return finesList;
    };

    public Fines save(Fines fines) {
        return finesRepository.save(fines);
    }

    public void deleteById(Long id) {
        finesRepository.deleteById(id);
    }

}
