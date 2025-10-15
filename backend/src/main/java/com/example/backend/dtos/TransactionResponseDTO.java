package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionResponseDTO {
    private final Long userId;
    private final String message;
    private final BigDecimal amount;
    private final BigDecimal newBalance;

    public TransactionResponseDTO(Long userId, String message, BigDecimal amount, BigDecimal newBalance) {
        this.userId = userId;
        this.message = message;
        this.amount = amount;
        this.newBalance = newBalance;
    }
}
