package com.mindquest.controller;

import com.mindquest.dto.request.RedeemRewardRequest;
import com.mindquest.dto.response.ApiResponse;
import com.mindquest.dto.response.CryptoRewardResponse;
import com.mindquest.dto.response.RedemptionResponse;
import com.mindquest.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<CryptoRewardResponse>>> getAvailableRewards(Authentication authentication) {
        List<CryptoRewardResponse> rewards = rewardService.getAvailableRewards(authentication);
        return ResponseEntity.ok(ApiResponse.success(rewards));
    }

    @PostMapping("/redeem")
    public ResponseEntity<ApiResponse<RedemptionResponse>> redeemReward(
            @Valid @RequestBody RedeemRewardRequest request,
            Authentication authentication) {
        RedemptionResponse redemption = rewardService.redeemReward(request, authentication);
        return ResponseEntity.ok(ApiResponse.success(redemption, "Reward redeemed successfully"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<RedemptionResponse>>> getRedemptionHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RedemptionResponse> history = rewardService.getRedemptionHistory(authentication, page, size);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}