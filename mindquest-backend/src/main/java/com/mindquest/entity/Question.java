package com.mindquest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@EntityListeners(AuditingEntityListener.class)
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 1000)
    private String question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private QuizCategory category;

    @Enumerated(EnumType.STRING)
    private QuizCategory.Difficulty difficulty = QuizCategory.Difficulty.MEDIUM;

    @ElementCollection
    @OrderColumn
    private List<String> options = new ArrayList<>();

    @NotNull
    private Integer correctAnswer;

    @Size(max = 1000)
    private String explanation;

    private Integer points = 10;
    private Integer timeLimit = 30;

    @ElementCollection
    private List<String> tags = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    private Boolean isActive = true;

    // Usage statistics
    private Long timesUsed = 0L;
    private Double averageScore = 0.0;
    private Double correctPercentage = 0.0;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Constructors
    public Question() {}

    public Question(String question, QuizCategory category, List<String> options, Integer correctAnswer) {
        this.question = question;
        this.category = category;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public QuizCategory getCategory() { return category; }
    public void setCategory(QuizCategory category) { this.category = category; }

    public QuizCategory.Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(QuizCategory.Difficulty difficulty) { this.difficulty = difficulty; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public Integer getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(Integer correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Long getTimesUsed() { return timesUsed; }
    public void setTimesUsed(Long timesUsed) { this.timesUsed = timesUsed; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Double getCorrectPercentage() { return correctPercentage; }
    public void setCorrectPercentage(Double correctPercentage) { this.correctPercentage = correctPercentage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}