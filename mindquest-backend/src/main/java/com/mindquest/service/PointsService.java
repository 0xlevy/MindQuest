package com.mindquest.service;

import com.mindquest.dto.response.PointsSummaryResponse;
import com.mindquest.dto.response.PointsHistoryResponse;
import com.mindquest.entity.PointsTransaction;
import com.mindquest.entity.User;
import com.mindquest.repository.PointsTransactionRepository;
import com.mindquest.repository.UserRepository;
import com.mindquest.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointsService {

    @Autowired
    private PointsTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public PointsSummaryResponse getPointsSummary(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long totalEarned = transactionRepository.getTotalEarnedPointsByUser(user);
        Long totalRedeemed = transactionRepository.getTotalRedeemedPointsByUser(user);
        
        List<PointsTransaction> recentTransactions = transactionRepository.findRecentByUser(
            user, PageRequest.of(0, 5));

        List<PointsHistoryResponse> recent = recentTransactions.stream()
                .map(this::convertToHistoryResponse)
                .collect(Collectors.toList());

        return new PointsSummaryResponse(
            user.getPoints(),
            totalEarned != null ? totalEarned : 0L,
            totalRedeemed != null ? totalRedeemed : 0L,
            user.getLevel(),
            calculateNextLevelPoints(user.getLevel()),
            recent
        );
    }

    public Page<PointsHistoryResponse> getPointsHistory(Authentication authentication, String type, int page, int size) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PointsTransaction.TransactionType transactionType = type != null ? 
            PointsTransaction.TransactionType.valueOf(type.toUpperCase()) : null;

        Pageable pageable = PageRequest.of(page, size);
        Page<PointsTransaction> transactions = transactionRepository.findByUserWithFilters(
            user, transactionType, pageable);

        return transactions.map(this::convertToHistoryResponse);
    }

    public void awardPoints(User user, Long points, String source, String description) {
        // Create transaction record
        PointsTransaction transaction = new PointsTransaction(
            user, PointsTransaction.TransactionType.EARNED, points, source, description);
        transactionRepository.save(transaction);

        // Update user points
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }

    public void deductPoints(User user, Long points, String source, String description) {
        if (user.getPoints() < points) {
            throw new RuntimeException("Insufficient points");
        }

        // Create transaction record
        PointsTransaction transaction = new PointsTransaction(
            user, PointsTransaction.TransactionType.REDEEMED, points, source, description);
        transactionRepository.save(transaction);

        // Update user points
        user.setPoints(user.getPoints() - points);
        userRepository.save(user);
    }

    private PointsHistoryResponse convertToHistoryResponse(PointsTransaction transaction) {
        return new PointsHistoryResponse(
            "tx_" + transaction.getId(),
            transaction.getType().name().toLowerCase(),
            transaction.getPoints(),
            transaction.getSource(),
            transaction.getDescription(),
            transaction.getCreatedAt()
        );
    }

    private Long calculateNextLevelPoints(Integer currentLevel) {
        // Points needed for next level = (level^2) * 100
        int nextLevel = currentLevel + 1;
        return (long) (nextLevel * nextLevel * 100);
    }
}