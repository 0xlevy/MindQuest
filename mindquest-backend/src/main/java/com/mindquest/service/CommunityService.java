package com.mindquest.service;

import com.mindquest.dto.request.CreatePostRequest;
import com.mindquest.dto.response.CommunityStatsResponse;
import com.mindquest.dto.response.CommunityPostResponse;
import com.mindquest.dto.response.QuizCategoryResponse;
import com.mindquest.entity.CommunityPost;
import com.mindquest.entity.QuizCategory;
import com.mindquest.entity.User;
import com.mindquest.exception.ResourceNotFoundException;
import com.mindquest.repository.CommunityPostRepository;
import com.mindquest.repository.QuizCategoryRepository;
import com.mindquest.repository.UserRepository;
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
public class CommunityService {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private QuizCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public CommunityStatsResponse getCommunityStats() {
        Long totalPosts = postRepository.countAllPosts();
        Long activeUsers = userRepository.countActiveUsers();
        
        // Get top categories by post count
        List<QuizCategory> categories = categoryRepository.findAll();
        List<CommunityStatsResponse.CategoryStats> categoryStats = categories.stream()
                .limit(5)
                .map(category -> {
                    Long postCount = postRepository.countByCategory(category);
                    return new CommunityStatsResponse.CategoryStats(
                        "cat_" + category.getId(),
                        category.getTitle(),
                        postCount.intValue()
                    );
                })
                .collect(Collectors.toList());

        return new CommunityStatsResponse(
            totalPosts.intValue(),
            activeUsers.intValue(),
            categoryStats
        );
    }

    public List<QuizCategoryResponse> getCommunityCategories() {
        List<QuizCategory> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }

    public Page<CommunityPostResponse> getCategoryPosts(Long categoryId, String sort, int page, int size) {
        QuizCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        Pageable pageable = PageRequest.of(page, size);
        Page<CommunityPost> posts = postRepository.findByCategoryWithSort(category, sort, pageable);

        return posts.map(this::convertToPostResponse);
    }

    public CommunityPostResponse createPost(Long categoryId, CreatePostRequest request, Authentication authentication) {
        QuizCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        CommunityPost post = new CommunityPost(request.getTitle(), request.getContent(), user, category);
        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }

        post = postRepository.save(post);
        return convertToPostResponse(post);
    }

    public List<User> getExperts() {
        // Get top users by points (experts)
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> topUsers = userRepository.findTopUsersByPoints(pageable);
        
        return topUsers.getContent();
    }

    private QuizCategoryResponse convertToCategoryResponse(QuizCategory category) {
        Long postCount = postRepository.countByCategory(category);
        
        return new QuizCategoryResponse(
            "cat_" + category.getId(),
            category.getTitle(),
            category.getDescription(),
            category.getIcon(),
            category.getDifficulty().name().toLowerCase(),
            category.getColor(),
            category.getBgColor(),
            category.getBorderColor(),
            postCount.intValue(), // Using post count instead of question count
            category.getSubcategories(),
            category.getModerators(),
            category.getRules()
        );
    }

    private CommunityPostResponse convertToPostResponse(CommunityPost post) {
        return new CommunityPostResponse(
            "post_" + post.getId(),
            post.getTitle(),
            post.getContent(),
            new CommunityPostResponse.AuthorInfo(
                "user_" + post.getAuthor().getId(),
                post.getAuthor().getName(),
                post.getAuthor().getAvatar(),
                post.getAuthor().getLevel()
            ),
            "cat_" + post.getCategory().getId(),
            post.getCategory().getTitle(),
            post.getLikes().intValue(),
            post.getReplies().intValue(),
            post.getViews().intValue(),
            post.getTags(),
            post.getCreatedAt()
        );
    }
}