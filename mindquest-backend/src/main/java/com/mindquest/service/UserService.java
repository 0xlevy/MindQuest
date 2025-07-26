package com.mindquest.service;

import com.mindquest.dto.response.UserResponse;
import com.mindquest.entity.User;
import com.mindquest.exception.ResourceNotFoundException;
import com.mindquest.repository.QuizAttemptRepository;
import com.mindquest.repository.UserRepository;
import com.mindquest.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public UserResponse getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        UserResponse userResponse = new UserResponse(user);
        
        // Add user stats
        Long totalQuizzes = quizAttemptRepository.countByUser(user);
        Double averageScore = quizAttemptRepository.getAverageScoreByUser(user);
        Long totalTimeSpent = quizAttemptRepository.getTotalTimeSpentByUser(user);
        
        String timeSpentFormatted = formatTimeSpent(totalTimeSpent != null ? totalTimeSpent : 0L);
        
        UserResponse.UserStatsResponse stats = new UserResponse.UserStatsResponse(
                totalQuizzes != null ? totalQuizzes : 0L,
                averageScore != null ? averageScore : 0.0,
                timeSpentFormatted,
                0, // streak - would need additional logic
                0  // achievements - would need additional logic
        );
        
        userResponse.setStats(stats);
        return userResponse;
    }

    public UserResponse updateProfile(Authentication authentication, UserResponse.UpdateProfileRequest request) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        if (request.getName() != null) {
            user.setName((String) request.getName());
        }
        if (request.getBio() != null) {
            user.setBio((String) request.getBio());
        }
        if (request.getLocation() != null) {
            user.setLocation((String) request.getLocation());
        }
        if (request.getWebsite() != null) {
            user.setWebsite((String) request.getWebsite());
        }

        user = userRepository.save(user);
        return new UserResponse(user);
    }

    public UserResponse uploadAvatar(Authentication authentication, MultipartFile file) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = "avatar_" + user.getId() + "_" + UUID.randomUUID() + extension;
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Update user avatar
            user.setAvatar("/uploads/" + filename);
            user = userRepository.save(user);

            return new UserResponse(user);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload avatar", e);
        }
    }

    private String formatTimeSpent(Long seconds) {
        if (seconds == null || seconds == 0) {
            return "0m";
        }
        
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        
        if (hours > 0) {
            return hours + "h " + minutes + "m";
        } else {
            return minutes + "m";
        }
    }
}