package com.mindquest.repository;

import com.mindquest.entity.PointsTransaction;
import com.mindquest.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {
    
    @Query("SELECT pt FROM PointsTransaction pt WHERE pt.user = :user AND " +
           "(:type IS NULL OR pt.type = :type) " +
           "ORDER BY pt.createdAt DESC")
    Page<PointsTransaction> findByUserWithFilters(@Param("user") User user, 
                                                 @Param("type") PointsTransaction.TransactionType type, 
                                                 Pageable pageable);
    
    @Query("SELECT pt FROM PointsTransaction pt WHERE pt.user = :user ORDER BY pt.createdAt DESC")
    List<PointsTransaction> findRecentByUser(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT SUM(pt.points) FROM PointsTransaction pt WHERE pt.user = :user AND pt.type = 'EARNED'")
    Long getTotalEarnedPointsByUser(@Param("user") User user);
    
    @Query("SELECT SUM(pt.points) FROM PointsTransaction pt WHERE pt.user = :user AND pt.type = 'REDEEMED'")
    Long getTotalRedeemedPointsByUser(@Param("user") User user);
}