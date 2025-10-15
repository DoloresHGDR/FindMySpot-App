package com.example.backend.repository;

import com.example.backend.models.BalanceTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BalanceTransactionRepository extends JpaRepository<BalanceTransaction, Long> {
    BalanceTransaction getBalanceTransactionByUserId(Long userId);
}
