package com.mindquest.dto.response;

import java.util.List;

public class QuizCategoryResponse {
    private String id;
    private String name;
    private String description;
    private String difficulty;
    private String iconUrl;
    private String color;
    private String creator;
    private String createdAt;
    private int questionCount;
    private List<String> tags;
    private List<String> allowedRoles;
    private List<String> relatedCategories;

    public QuizCategoryResponse() {}

    public QuizCategoryResponse(
        String id, String name, String description, String difficulty, String iconUrl,
        String color, String creator, String createdAt, int questionCount,
        List<String> tags, List<String> allowedRoles, List<String> relatedCategories
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.iconUrl = iconUrl;
        this.color = color;
        this.creator = creator;
        this.createdAt = createdAt;
        this.questionCount = questionCount;
        this.tags = tags;
        this.allowedRoles = allowedRoles;
        this.relatedCategories = relatedCategories;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    
    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public List<String> getAllowedRoles() { return allowedRoles; }
    public void setAllowedRoles(List<String> allowedRoles) { this.allowedRoles = allowedRoles; }
    
    public List<String> getRelatedCategories() { return relatedCategories; }
    public void setRelatedCategories(List<String> relatedCategories) { this.relatedCategories = relatedCategories; }
}