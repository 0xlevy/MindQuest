package com.mindquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityStatsResponse {
    private int totalPosts;
    private int activeUsers;
    private List<CategoryStats> categoryStats;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStats {
        private String id;
        private String name;
        private int postCount;
    }
}