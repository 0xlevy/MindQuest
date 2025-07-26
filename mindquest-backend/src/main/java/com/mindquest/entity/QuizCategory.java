package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_categories")
@EntityListeners(AuditingEntityListener.class)
public class QuizCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String title;

    @Size(max = 500)
    private String description;

    @Size(max = 10)
    private String icon;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Size(max = 50)
    private String color;

    @Size(max = 50)
    private String bgColor;

    @Size(max = 50)
    private String borderColor;

    @ElementCollection
    private List<String> subcategories = new ArrayList<>();

    @ElementCollection
    private List<String> moderators = new ArrayList<>();

    @ElementCollection
    private List<String> rules = new ArrayList<>();

    private Boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Constructors
    public QuizCategory() {}

    public QuizCategory(String title, String description, String icon) {
        this.title = title;
        this.description = description;
        this.icon = icon;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getBorderColor() { return borderColor; }
    public void setBorderColor(String borderColor) { this.borderColor = borderColor; }

    public List<String> getSubcategories() { return subcategories; }
    public void setSubcategories(List<String> subcategories) { this.subcategories = subcategories; }

    public List<String> getModerators() { return moderators; }
    public void setModerators(List<String> moderators) { this.moderators = moderators; }

    public List<String> getRules() { return rules; }
    public void setRules(List<String> rules) { this.rules = rules; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}