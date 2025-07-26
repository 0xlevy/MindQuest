package com.mindquest.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class QuizSubmissionRequest {
    @NotEmpty
    private List<QuizAnswerRequest> answers;

    @NotNull
    private Integer totalTimeSpent;

    @NotNull
    private LocalDateTime startedAt;

    @NotNull
    private LocalDateTime completedAt;

    // Constructors
    public QuizSubmissionRequest() {}

    // Getters and Setters
    public List<QuizAnswerRequest> getAnswers() { return answers; }
    public void setAnswers(List<QuizAnswerRequest> answers) { this.answers = answers; }

    public Integer getTotalTimeSpent() { return totalTimeSpent; }
    public void setTotalTimeSpent(Integer totalTimeSpent) { this.totalTimeSpent = totalTimeSpent; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public static class QuizAnswerRequest {
        @NotNull
        private Long questionId;

        @NotNull
        private Integer selectedAnswer;

        @NotNull
        private Integer timeSpent;

        // Constructors
        public QuizAnswerRequest() {}

        // Getters and Setters
        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public Integer getSelectedAnswer() { return selectedAnswer; }
        public void setSelectedAnswer(Integer selectedAnswer) { this.selectedAnswer = selectedAnswer; }

        public Integer getTimeSpent() { return timeSpent; }
        public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }
    }
}