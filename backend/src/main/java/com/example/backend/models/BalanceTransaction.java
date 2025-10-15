package com.example.backend.models;

import com.example.backend.models.enums.BalanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BalanceTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private BalanceStatus type;
    private BigDecimal amount;
    private LocalDateTime timestamp;

    public BalanceTransaction(Long userId, BalanceStatus balanceStatus, BigDecimal amount, LocalDateTime now) {
        this.userId = userId;
        this.type = balanceStatus;
        this.amount = amount;
        this.timestamp = now;
    }
}
