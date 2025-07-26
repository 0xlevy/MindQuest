package com.mindquest.dto.response;

import java.time.LocalDateTime;

public class PointsHistoryResponse {
    private String id;
    private String type;
    private long points;
    private String description;
    private String source;
    private LocalDateTime createdAt;

    public PointsHistoryResponse() {}

    public PointsHistoryResponse(String id, String type, long points, String description, String source, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.points = points;
        this.description = description;
        this.source = source;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public long getPoints() { return points; }
    public void setPoints(long points) { this.points = points; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}