package com.mindquest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RedeemRewardRequest {
    @NotNull
    private Long rewardId;

    @NotBlank
    private String walletAddress;

    // Constructors
    public RedeemRewardRequest() {}

    public RedeemRewardRequest(Long rewardId, String walletAddress) {
        this.rewardId = rewardId;
        this.walletAddress = walletAddress;
    }

    // Getters and Setters
    public Long getRewardId() { return rewardId; }
    public void setRewardId(Long rewardId) { this.rewardId = rewardId; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
}