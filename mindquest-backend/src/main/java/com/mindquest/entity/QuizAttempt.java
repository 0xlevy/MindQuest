package com.mindquest.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@EntityListeners(AuditingEntityListener.class)
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private QuizCategory category;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizAnswer> answers = new ArrayList<>();

    private Integer score;
    private Long points;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Integer timeSpent; // in seconds
    private Long bonusPoints = 0L;
    private Long timeBonus = 0L;
    private Long perfectBonus = 0L;
    private Long totalPoints;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    // Constructors
    public QuizAttempt() {}

    public QuizAttempt(User user, QuizCategory category) {
        this.user = user;
        this.category = category;
        this.startedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public QuizCategory getCategory() { return category; }
    public void setCategory(QuizCategory category) { this.category = category; }

    public List<QuizAnswer> getAnswers() { return answers; }
    public void setAnswers(List<QuizAnswer> answers) { this.answers = answers; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Long getPoints() { return points; }
    public void setPoints(Long points) { this.points = points; }

    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }

    public Long getBonusPoints() { return bonusPoints; }
    public void setBonusPoints(Long bonusPoints) { this.bonusPoints = bonusPoints; }

    public Long getTimeBonus() { return timeBonus; }
    public void setTimeBonus(Long timeBonus) { this.timeBonus = timeBonus; }

    public Long getPerfectBonus() { return perfectBonus; }
    public void setPerfectBonus(Long perfectBonus) { this.perfectBonus = perfectBonus; }

    public Long getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Long totalPoints) { this.totalPoints = totalPoints; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getRank() {
        if (score >= 90) return "Excellent";
        if (score >= 80) return "Very Good";
        if (score >= 70) return "Good";
        if (score >= 60) return "Average";
        return "Needs Improvement";
    }
}