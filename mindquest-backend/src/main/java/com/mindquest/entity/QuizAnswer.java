package com.mindquest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_answers")
public class QuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id")
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private Integer selectedAnswer;
    private Boolean correct;
    private Integer timeSpent; // in seconds
    private Integer points;

    // Constructors
    public QuizAnswer() {}

    public QuizAnswer(QuizAttempt attempt, Question question, Integer selectedAnswer, Integer timeSpent) {
        this.attempt = attempt;
        this.question = question;
        this.selectedAnswer = selectedAnswer;
        this.timeSpent = timeSpent;
        this.correct = selectedAnswer.equals(question.getCorrectAnswer());
        this.points = this.correct ? question.getPoints() : 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public QuizAttempt getAttempt() { return attempt; }
    public void setAttempt(QuizAttempt attempt) { this.attempt = attempt; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Integer getSelectedAnswer() { return selectedAnswer; }
    public void setSelectedAnswer(Integer selectedAnswer) { this.selectedAnswer = selectedAnswer; }

    public Boolean getCorrect() { return correct; }
    public void setCorrect(Boolean correct) { this.correct = correct; }

    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
}