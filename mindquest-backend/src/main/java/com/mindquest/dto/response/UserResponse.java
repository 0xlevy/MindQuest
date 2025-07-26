package com.mindquest.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mindquest.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String bio;
    private String location;
    private String website;
    private String avatar;
    private String role;
    private Set<String> permissions;
    private Integer level;
    private Long points;
    private Long rank;
    private String provider;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;
    
    private UserStatsResponse stats;

    // Custom constructor kept because it has business logic
    public UserResponse(User user) {
        this.id = "user_" + user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.location = user.getLocation();
        this.website = user.getWebsite();
        this.avatar = user.getAvatar();
        this.role = user.getRole().name().toLowerCase();
        this.permissions = Set.of(user.getPermissions().stream()
                .map(p -> p.name().toLowerCase())
                .toArray(String[]::new));
        this.level = user.getLevel();
        this.points = user.getPoints();
        this.rank = user.getRank();
        this.provider = user.getProvider().name().toLowerCase();
        this.createdAt = user.getCreatedAt();
    }

    @Data
    @NoArgsConstructor
    public static class UserStatsResponse {
        private Long totalQuizzes;
        private Double averageScore;
        private String timeSpent;
        private Integer streak;
        private Integer achievements;

        public UserStatsResponse(Long totalQuizzes, Double averageScore, String timeSpent, Integer streak, Integer achievements) {
            this.totalQuizzes = totalQuizzes;
            this.averageScore = averageScore;
            this.timeSpent = timeSpent;
            this.streak = streak;
            this.achievements = achievements;
        }
    }

    public class UpdateProfileRequest {

        public Object getName() {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'getName'");
        }

        public Object getBio() {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'getBio'");
        }

        public Object getLocation() {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'getLocation'");
        }

        public Object getWebsite() {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'getWebsite'");
        }
    }
}