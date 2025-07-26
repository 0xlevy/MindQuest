package com.mindquest.service;

import com.mindquest.dto.request.QuizSubmissionRequest;
import com.mindquest.dto.response.QuizCategoryResponse;
import com.mindquest.dto.response.QuizQuestionResponse;
import com.mindquest.dto.response.QuizResultResponse;
import com.mindquest.dto.response.QuizHistoryResponse;
import com.mindquest.entity.*;
import com.mindquest.exception.BadRequestException;
import com.mindquest.exception.ResourceNotFoundException;
import com.mindquest.repository.*;
import com.mindquest.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {

    @Autowired
    private QuizCategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointsService pointsService;

    public Page<QuizCategoryResponse> getCategories(String search, String difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Handle empty string as null
        if (search != null && search.trim().isEmpty()) {
            search = null;
        }
        
        QuizCategory.Difficulty difficultyEnum = difficulty != null ? 
            QuizCategory.Difficulty.valueOf(difficulty.toUpperCase()) : null;
        
        Page<QuizCategory> categories = categoryRepository.findActiveCategoriesWithFilters(
            search, difficultyEnum, pageable);
        
        return categories.map(this::convertToCategoryResponse);
    }

    public List<QuizQuestionResponse> getQuizQuestions(Long categoryId, Authentication authentication) {
        QuizCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        // Check if user already has an attempt for this category
        if (attemptRepository.findByUserAndCategory(user, category).isPresent()) {
            throw new BadRequestException("You have already taken this quiz");
        }

        // Get 10 random questions from the category
        List<Question> questions = questionRepository.findRandomQuestionsByCategory(
            category, PageRequest.of(0, 10));

        if (questions.isEmpty()) {
            throw new BadRequestException("No questions available for this category");
        }

        return questions.stream()
                .map(this::convertToQuestionResponse)
                .collect(Collectors.toList());
    }

    public QuizResultResponse submitQuiz(Long categoryId, QuizSubmissionRequest request, Authentication authentication) {
        QuizCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        // Check if user already has an attempt for this category
        if (attemptRepository.findByUserAndCategory(user, category).isPresent()) {
            throw new BadRequestException("You have already taken this quiz");
        }

        // Create quiz attempt
        QuizAttempt attempt = new QuizAttempt(user, category);
        attempt.setStartedAt(request.getStartedAt());
        attempt.setCompletedAt(request.getCompletedAt());
        attempt.setTimeSpent(request.getTotalTimeSpent());
        attempt.setTotalQuestions(request.getAnswers().size());

        // Process answers
        int correctAnswers = 0;
        long totalPoints = 0L;

        for (QuizSubmissionRequest.QuizAnswerRequest answerRequest : request.getAnswers()) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question", "id", answerRequest.getQuestionId()));

            QuizAnswer answer = new QuizAnswer(attempt, question, 
                answerRequest.getSelectedAnswer(), answerRequest.getTimeSpent());
            
            attempt.getAnswers().add(answer);

            if (answer.getCorrect()) {
                correctAnswers++;
                totalPoints += question.getPoints();
            }

            // Update question statistics
            question.setTimesUsed(question.getTimesUsed() + 1);
            questionRepository.save(question);
        }

        // Calculate score and bonuses
        int score = (int) Math.round((double) correctAnswers / request.getAnswers().size() * 100);
        
        // Time bonus (faster completion = more bonus)
        long timeBonus = calculateTimeBonus(request.getTotalTimeSpent(), request.getAnswers().size());
        
        // Perfect score bonus
        long perfectBonus = (score == 100) ? 50L : 0L;
        
        long finalPoints = totalPoints + timeBonus + perfectBonus;

        attempt.setCorrectAnswers(correctAnswers);
        attempt.setScore(score);
        attempt.setPoints(totalPoints);
        attempt.setTimeBonus(timeBonus);
        attempt.setPerfectBonus(perfectBonus);
        attempt.setTotalPoints(finalPoints);

        attempt = attemptRepository.save(attempt);

        // Award points to user
        pointsService.awardPoints(user, finalPoints, "quiz_completion", 
            "Completed quiz: " + category.getTitle());

        // Update user level based on points
        updateUserLevel(user);

        return convertToResultResponse(attempt);
    }

    public Page<QuizHistoryResponse> getQuizHistory(Authentication authentication, Long categoryId, int page, int size) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        Pageable pageable = PageRequest.of(page, size);
        Page<QuizAttempt> attempts = attemptRepository.findByUserWithFilters(user, categoryId, pageable);

        return attempts.map(this::convertToHistoryResponse);
    }

    private QuizCategoryResponse convertToCategoryResponse(QuizCategory category) {
        Long questionCount = questionRepository.countByCategory(category);
        
        return new QuizCategoryResponse(
            "cat_" + category.getId(),
            category.getTitle(),
            category.getDescription(),
            category.getIcon(),
            category.getDifficulty().name().toLowerCase(),
            category.getColor(),
            category.getBgColor(),
            category.getBorderColor(),
            questionCount.intValue(),
            category.getSubcategories(),
            category.getModerators(),
            category.getRules()
        );
    }

    private QuizQuestionResponse convertToQuestionResponse(Question question) {
        return new QuizQuestionResponse(
            "q_" + question.getId(),
            question.getQuestion(),
            question.getOptions(),
            question.getTimeLimit(),
            question.getPoints()
        );
    }

    private QuizResultResponse convertToResultResponse(QuizAttempt attempt) {
        return new QuizResultResponse(
            "attempt_" + attempt.getId(),
            "quiz_" + attempt.getCategory().getId(),     // Changed: proper quiz ID string
            attempt.getCategory().getTitle(),            // Changed: proper quiz title string
            attempt.getTotalQuestions(),
            attempt.getCorrectAnswers(),
            attempt.getScore(),
            attempt.getTotalPoints().intValue(),         // Changed: proper conversion from Long to int
            attempt.getCompletedAt(),
            attempt.getTimeSpent(),                      // Added: missing timeTaken parameter
            (double)attempt.getCorrectAnswers() / attempt.getTotalQuestions() * 100  // Added: calculate accuracy
        );
    }

    private QuizHistoryResponse convertToHistoryResponse(QuizAttempt attempt) {
        return new QuizHistoryResponse(
            "attempt_" + attempt.getId(),
            "cat_" + attempt.getCategory().getId(),
            attempt.getCategory().getTitle(),
            attempt.getScore(),
            attempt.getTotalPoints(),
            attempt.getRank(),
            attempt.getCompletedAt()
        );
    }

    private long calculateTimeBonus(int timeSpent, int questionCount) {
        // Expected time: 30 seconds per question
        int expectedTime = questionCount * 30;
        if (timeSpent < expectedTime) {
            // Award bonus for faster completion (max 20 points)
            return Math.min(20L, (expectedTime - timeSpent) / 10);
        }
        return 0L;
    }

    private void updateUserLevel(User user) {
        Long points = user.getPoints();
        int newLevel = calculateLevel(points);
        
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
            userRepository.save(user);
            
            // Award level up bonus
            pointsService.awardPoints(user, 100L, "level_up", 
                "Level up bonus - reached level " + newLevel);
        }
    }

    private int calculateLevel(Long points) {
        // Level calculation: Level = floor(sqrt(points / 100)) + 1
        return (int) Math.floor(Math.sqrt(points / 100.0)) + 1;
    }
}