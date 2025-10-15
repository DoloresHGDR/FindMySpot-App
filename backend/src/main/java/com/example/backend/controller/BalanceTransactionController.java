package com.example.backend.controller;

import com.example.backend.dtos.TransactionRequestDTO;
import com.example.backend.models.BalanceTransaction;
import com.example.backend.service.BalanceService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("api/balance")
public class BalanceTransactionController {

    private final BalanceService balanceService;

    public BalanceTransactionController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @PostMapping("/add")
    BalanceTransaction addBalanceTransaction(@RequestBody TransactionRequestDTO transactionRequestDTO) {
        return balanceService.addBalance(BigDecimal.valueOf(transactionRequestDTO.amount()));
    }

}
