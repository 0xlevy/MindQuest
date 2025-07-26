package com.mindquest.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RedemptionResponse {
    private String id;
    private RewardInfo rewardInfo;
    private long pointsUsed;
    private double value;
    private String status;
    private String walletAddress;
    private String transactionId;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RewardInfo {
        private String id;
        private String name;
        private String icon;
    }
}