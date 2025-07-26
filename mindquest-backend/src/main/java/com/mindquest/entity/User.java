package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;

    @Size(max = 255)
    private String password;

    @Size(max = 500)
    private String bio;

    @Size(max = 100)
    private String location;

    @Size(max = 255)
    private String website;

    @Size(max = 255)
    private String avatar;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Permission> permissions = new HashSet<>();

    private Integer level = 1;
    private Long points = 0L;
    private Long rank = 0L;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider = AuthProvider.EMAIL;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    private LocalDateTime lastActive;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Custom constructor (keep this as it has specific logic)
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.lastActive = LocalDateTime.now();
    }

    // Wallet address method (implement this properly)
    public String getWalletAddress() {
        // Placeholder implementation - replace with actual logic
        return null; // or return a real wallet address if available
    }

    public enum Role {
        USER, MODERATOR, ADMIN
    }

    public enum Permission {
        TAKE_QUIZ, VIEW_LEADERBOARD, MODERATE_COMMUNITY, MANAGE_QUESTIONS, 
        MANAGE_USERS, VIEW_ANALYTICS, MANAGE_REWARDS, SYSTEM_ADMIN
    }

    public enum AuthProvider {
        EMAIL, GOOGLE
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, BANNED
    }
}