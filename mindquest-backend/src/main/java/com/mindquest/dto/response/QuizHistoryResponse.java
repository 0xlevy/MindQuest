package com.mindquest.dto.response;

import java.time.LocalDateTime;

public class QuizHistoryResponse {
    private String id;
    private String quizTitle;
    private String category;
    private Integer score;
    private Long totalQuestions;
    private String correctAnswers;
    private LocalDateTime completedAt;

    public QuizHistoryResponse() {}

    public QuizHistoryResponse(String id, String quizTitle, String category, Integer score, Long totalQuestions, String correctAnswers, LocalDateTime completedAt) {
        this.id = id;
        this.quizTitle = quizTitle;
        this.category = category;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.completedAt = completedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Long getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public String getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(String correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}