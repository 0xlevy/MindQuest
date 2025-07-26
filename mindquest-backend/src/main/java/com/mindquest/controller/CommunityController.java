package com.mindquest.controller;

import com.mindquest.dto.request.CreatePostRequest;
import com.mindquest.dto.response.*;
import com.mindquest.entity.User;
import com.mindquest.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<CommunityStatsResponse>> getCommunityStats() {
        CommunityStatsResponse stats = communityService.getCommunityStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<QuizCategoryResponse>>> getCommunityCategories() {
        List<QuizCategoryResponse> categories = communityService.getCommunityCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/categories/{categoryId}/posts")
    public ResponseEntity<ApiResponse<Page<CommunityPostResponse>>> getCategoryPosts(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommunityPostResponse> posts = communityService.getCategoryPosts(categoryId, sort, page, size);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @PostMapping("/categories/{categoryId}/posts")
    public ResponseEntity<ApiResponse<CommunityPostResponse>> createPost(
            @PathVariable Long categoryId,
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {
        CommunityPostResponse post = communityService.createPost(categoryId, request, authentication);
        return ResponseEntity.ok(ApiResponse.success(post, "Post created successfully"));
    }

    @GetMapping("/experts")
    public ResponseEntity<ApiResponse<List<User>>> getExperts() {
        List<User> experts = communityService.getExperts();
        return ResponseEntity.ok(ApiResponse.success(experts));
    }
}