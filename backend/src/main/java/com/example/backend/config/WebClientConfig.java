package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient mockApiWebClient() {
        return WebClient.builder()
                .baseUrl("http://mock-api:8082/api")
                .build();
    }
}
