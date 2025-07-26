package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reward_redemptions")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardRedemption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id")
    private CryptoReward reward;

    private Long pointsUsed;

    @Size(max = 20)
    private String value;

    @Enumerated(EnumType.STRING)
    private RedemptionStatus status = RedemptionStatus.PENDING;

    @NotBlank
    @Size(max = 255)
    private String walletAddress;

    @Size(max = 255)
    private String transactionId;

    private LocalDateTime estimatedDelivery;
    private LocalDateTime completedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Custom constructor for business logic
    public RewardRedemption(User user, CryptoReward reward, String walletAddress) {
        this.user = user;
        this.reward = reward;
        this.pointsUsed = reward.getMinPoints();
        this.value = reward.getValue();
        this.walletAddress = walletAddress;
        this.estimatedDelivery = LocalDateTime.now().plusDays(1);
    }

    public enum RedemptionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}