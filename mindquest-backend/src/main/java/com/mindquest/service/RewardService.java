package com.mindquest.service;


import com.mindquest.dto.request.RedeemRewardRequest;
import com.mindquest.dto.response.CryptoRewardResponse;
import com.mindquest.dto.response.RedemptionResponse;
import com.mindquest.entity.CryptoReward;
import com.mindquest.entity.RewardRedemption;
import com.mindquest.entity.User;
import com.mindquest.exception.BadRequestException;
import com.mindquest.exception.ResourceNotFoundException;
import com.mindquest.repository.CryptoRewardRepository;
import com.mindquest.repository.RewardRedemptionRepository;
import com.mindquest.repository.UserRepository;
import com.mindquest.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RewardService {

    @Autowired
    private CryptoRewardRepository rewardRepository;

    @Autowired
    private RewardRedemptionRepository redemptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointsService pointsService;

    public List<CryptoRewardResponse> getAvailableRewards(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        List<CryptoReward> rewards = rewardRepository.findAvailableRewards();
        
        return rewards.stream()
                .map(reward -> convertToRewardResponse(reward, user))
                .collect(Collectors.toList());
    }

    private CryptoRewardResponse convertToRewardResponse(CryptoReward reward, User user) {
        boolean canRedeem = user.getPoints() >= reward.getMinPoints() && reward.getAvailable();
        
        return new CryptoRewardResponse(
            "reward_" + reward.getId(),
            user.getWalletAddress(),
            reward.getCryptoType(),
            reward.getValue(),
            "", // transactionHash is empty for available rewards
            canRedeem ? "available" : "unavailable",
            LocalDateTime.now(),
            reward.getNetwork()
        );
    }

    public RedemptionResponse redeemReward(RedeemRewardRequest request, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        CryptoReward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new ResourceNotFoundException("Reward", "id", request.getRewardId()));

        if (!reward.getAvailable()) {
            throw new BadRequestException("Reward is not available");
        }

        if (user.getPoints() < reward.getMinPoints()) {
            throw new BadRequestException("Insufficient points");
        }

        // Create redemption record
        RewardRedemption redemption = new RewardRedemption(user, reward, request.getWalletAddress());
        redemption = redemptionRepository.save(redemption);

        // Deduct points from user
        pointsService.deductPoints(user, reward.getMinPoints(), "reward_redemption", 
            "Redeemed " + reward.getName());

        return convertToRedemptionResponse(redemption);
    }

    public Page<RedemptionResponse> getRedemptionHistory(Authentication authentication, int page, int size) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        Pageable pageable = PageRequest.of(page, size);
        Page<RewardRedemption> redemptions = redemptionRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        return redemptions.map(this::convertToRedemptionResponse);
    }

    private RedemptionResponse convertToRedemptionResponse(RewardRedemption redemption) {
        LocalDateTime estimatedDelivery = redemption.getEstimatedDelivery();
        
        // Safe conversion from String to double with error handling
        double value;
        try {
            value = Double.parseDouble(redemption.getValue());
        } catch (NumberFormatException e) {
            value = 0.0; // Default value if parsing fails
        }

        return new RedemptionResponse(
            "redemption_" + redemption.getId(),
            new RedemptionResponse.RewardInfo(
                "reward_" + redemption.getReward().getId(),
                redemption.getReward().getName(),
                redemption.getReward().getIcon()
            ),
            redemption.getPointsUsed(),
            value,                                          // Use safely parsed double
            redemption.getStatus().name().toLowerCase(),
            redemption.getWalletAddress(),
            redemption.getTransactionId(),
            estimatedDelivery,
            redemption.getCreatedAt()
        );
    }
}