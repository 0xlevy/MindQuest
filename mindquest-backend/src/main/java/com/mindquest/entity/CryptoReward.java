package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "crypto_rewards")
@EntityListeners(AuditingEntityListener.class)
public class CryptoReward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String name;

    @Size(max = 10)
    private String icon;

    private Long minPoints;

    @Size(max = 20)
    private String value;

    @Size(max = 100)
    private String color;

    private Boolean available = true;

    @Size(max = 500)
    private String description;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Constructors
    public CryptoReward() {}

    public CryptoReward(String name, String icon, Long minPoints, String value) {
        this.name = name;
        this.icon = icon;
        this.minPoints = minPoints;
        this.value = value;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Long getMinPoints() { return minPoints; }
    public void setMinPoints(Long minPoints) { this.minPoints = minPoints; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCryptoType() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCryptoType'");
    }

    public String getNetwork() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNetwork'");
    }
}