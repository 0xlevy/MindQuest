package com.mindquest.repository;

import com.mindquest.entity.CryptoReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CryptoRewardRepository extends JpaRepository<CryptoReward, Long> {
    
    @Query("SELECT r FROM CryptoReward r WHERE r.available = true ORDER BY r.minPoints ASC")
    List<CryptoReward> findAvailableRewards();
}