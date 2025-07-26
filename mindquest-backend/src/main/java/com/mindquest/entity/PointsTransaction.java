package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "points_transactions")
@EntityListeners(AuditingEntityListener.class)
public class PointsTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private Long points;

    @NotBlank
    @Size(max = 100)
    private String source;

    @Size(max = 500)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON string for additional data

    @CreatedDate
    private LocalDateTime createdAt;

    // Constructors
    public PointsTransaction() {}

    public PointsTransaction(User user, TransactionType type, Long points, String source, String description) {
        this.user = user;
        this.type = type;
        this.points = points;
        this.source = source;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public Long getPoints() { return points; }
    public void setPoints(Long points) { this.points = points; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum TransactionType {
        EARNED, REDEEMED, BONUS
    }
}