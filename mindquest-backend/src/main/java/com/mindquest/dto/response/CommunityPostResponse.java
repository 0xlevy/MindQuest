package com.mindquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostResponse {
    private String id;
    private String title;
    private String content;
    private AuthorInfo author;
    private String categoryId;
    private String categoryName;
    private int likes;
    private int replies;
    private int views;
    private List<String> tags;
    private LocalDateTime createdAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorInfo {
        private String id;
        private String name;
        private String avatar;
        private Integer level;
    }
}