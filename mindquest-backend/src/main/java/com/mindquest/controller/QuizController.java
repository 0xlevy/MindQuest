package com.mindquest.controller;

import com.mindquest.dto.request.QuizSubmissionRequest;
import com.mindquest.dto.response.*;
import com.mindquest.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Page<QuizCategoryResponse>>> getCategories(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuizCategoryResponse> categories = quizService.getCategories(search, difficulty, page, size);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{categoryId}/questions")
    public ResponseEntity<ApiResponse<List<QuizQuestionResponse>>> getQuizQuestions(
            @PathVariable Long categoryId,
            Authentication authentication) {
        List<QuizQuestionResponse> questions = quizService.getQuizQuestions(categoryId, authentication);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping("/{categoryId}/submit")
    public ResponseEntity<ApiResponse<QuizResultResponse>> submitQuiz(
            @PathVariable Long categoryId,
            @Valid @RequestBody QuizSubmissionRequest request,
            Authentication authentication) {
        QuizResultResponse result = quizService.submitQuiz(categoryId, request, authentication);
        return ResponseEntity.ok(ApiResponse.success(result, "Quiz submitted successfully"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<QuizHistoryResponse>>> getQuizHistory(
            Authentication authentication,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuizHistoryResponse> history = quizService.getQuizHistory(authentication, categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}