package com.example.backend.service;

import com.example.backend.dtos.TransactionResponseDTO;
import com.example.backend.models.BalanceTransaction;
import com.example.backend.models.Users;
import com.example.backend.models.enums.BalanceStatus;
import com.example.backend.repository.BalanceTransactionRepository;
import com.example.backend.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BalanceService {
    private final BalanceTransactionRepository balanceTransactionRepository;
    private final UsersRepository usersRepository;

    public BalanceService(BalanceTransactionRepository balanceTransactionRepository, UsersRepository usersRepository) {
        this.balanceTransactionRepository = balanceTransactionRepository;
        this.usersRepository = usersRepository;
    }

    public BalanceTransaction addBalance(BigDecimal amount) {
        Users user = AuthService.getAuthenticatedUser();
        BigDecimal currentBalance = user.getBalance();
        BalanceTransaction balanceTransaction = new BalanceTransaction(
                user.getId(),
                BalanceStatus.ADD,
                amount,
                LocalDateTime.now()
        );
        BigDecimal newBalance = currentBalance.add(amount);
        user.setBalance(newBalance);
        usersRepository.save(user);
        return balanceTransactionRepository.save(balanceTransaction);
    }

    public TransactionResponseDTO subtractBalance(Long userId, BigDecimal finalPrice) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con ID: " + userId
                ));
        BigDecimal newBalance = user.getBalance().subtract(finalPrice);

        user.setBalance(newBalance);
        usersRepository.save(user);

        BalanceTransaction balanceTransaction = new BalanceTransaction(
                userId,
                BalanceStatus.SUBTRACT,
                finalPrice,
                LocalDateTime.now()
        );
        balanceTransactionRepository.save(balanceTransaction);
        return new TransactionResponseDTO(
                userId,
                "Pago realizado con exito. Saldo actualizado",
                finalPrice,
                newBalance
        );
    }

    public BalanceTransaction getBalanceTransaction(Long userId) {
        return balanceTransactionRepository.getBalanceTransactionByUserId(userId);
    }

    public void checkMinimumBalance(Long userId) {
        final BigDecimal MINIMUM_REQUIRED_BALANCE = new BigDecimal("100.00");

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con ID: " + userId
                ));
        BigDecimal currentBalance = user.getBalance();

        if (currentBalance.compareTo(MINIMUM_REQUIRED_BALANCE) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.PRECONDITION_FAILED,
                    "Saldo insuficiente para iniciar un nuevo parking. Saldo mínimo requerido: $" + MINIMUM_REQUIRED_BALANCE +
                            ". Saldo actual: $" + currentBalance + "."
            );
        }
    }
}
