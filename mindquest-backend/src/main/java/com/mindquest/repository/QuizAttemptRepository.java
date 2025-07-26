package com.mindquest.repository;

import com.mindquest.entity.QuizAttempt;
import com.mindquest.entity.QuizCategory;
import com.mindquest.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.user = :user ORDER BY qa.createdAt DESC")
    Page<QuizAttempt> findByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);

    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.user = :user AND " +
           "(:categoryId IS NULL OR qa.category.id = :categoryId) " +
           "ORDER BY qa.createdAt DESC")
    Page<QuizAttempt> findByUserWithFilters(@Param("user") User user,
                                            @Param("categoryId") Long categoryId,
                                            Pageable pageable);

    Optional<QuizAttempt> findByUserAndCategory(User user, QuizCategory category);

    // Corrected: Use BETWEEN for LocalDateTime range (recommended for compatibility)
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.createdAt >= :start AND qa.createdAt < :end")
    Long countQuizzesToday(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa")
    Double getAverageScore();

    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.user = :user")
    Long countByUser(@Param("user") User user);

    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa WHERE qa.user = :user")
    Double getAverageScoreByUser(@Param("user") User user);

    @Query("SELECT SUM(qa.timeSpent) FROM QuizAttempt qa WHERE qa.user = :user")
    Long getTotalTimeSpentByUser(@Param("user") User user);
}