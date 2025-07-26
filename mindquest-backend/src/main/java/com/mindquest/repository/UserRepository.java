package com.mindquest.repository;

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
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:search IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findUsersWithFilters(@Param("role") User.Role role, 
                                   @Param("status") User.UserStatus status, 
                                   @Param("search") String search, 
                                   Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'ACTIVE'")
    Long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :today")
    Long countNewUsersToday(@Param("today") LocalDateTime today);
    
    @Query("SELECT u FROM User u ORDER BY u.points DESC")
    Page<User> findTopUsersByPoints(Pageable pageable);
}