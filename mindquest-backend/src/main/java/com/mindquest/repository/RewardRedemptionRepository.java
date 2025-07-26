package com.mindquest.repository;

import com.mindquest.entity.RewardRedemption;
import com.mindquest.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {
    
    @Query("SELECT rr FROM RewardRedemption rr WHERE rr.user = :user ORDER BY rr.createdAt DESC")
    Page<RewardRedemption> findByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT rr FROM RewardRedemption rr WHERE rr.status = :status")
    Page<RewardRedemption> findByStatus(@Param("status") RewardRedemption.RedemptionStatus status, Pageable pageable);
}