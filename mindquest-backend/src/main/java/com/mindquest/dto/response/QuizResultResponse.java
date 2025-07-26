package com.mindquest.dto.response;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    private String id;
    private String quizId;
    private String quizTitle;
    private int totalQuestions;
    private int correctAnswers;
    private int score;
    private int pointsEarned;
    private LocalDateTime completedAt;
    private long timeTaken;
    private double accuracy;
}