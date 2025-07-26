package com.mindquest.dto.response;

import java.util.List;

public class PointsSummaryResponse {
    private long totalPoints;
    private long availablePoints;
    private long usedPoints;
    private int currentStreak;
    private long currentLevel;
    private List<PointsHistoryResponse> history;

    public PointsSummaryResponse() {}

    public PointsSummaryResponse(long totalPoints, long availablePoints, long usedPoints, int currentStreak, long currentLevel, List<PointsHistoryResponse> history) {
        this.totalPoints = totalPoints;
        this.availablePoints = availablePoints;
        this.usedPoints = usedPoints;
        this.currentStreak = currentStreak;
        this.currentLevel = currentLevel;
        this.history = history;
    }

    // Getters and Setters
    public long getTotalPoints() { return totalPoints; }
    public void setTotalPoints(long totalPoints) { this.totalPoints = totalPoints; }

    public long getAvailablePoints() { return availablePoints; }
    public void setAvailablePoints(long availablePoints) { this.availablePoints = availablePoints; }

    public long getUsedPoints() { return usedPoints; }
    public void setUsedPoints(long usedPoints) { this.usedPoints = usedPoints; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public long getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(long currentLevel) { this.currentLevel = currentLevel; }

    public List<PointsHistoryResponse> getHistory() { return history; }
    public void setHistory(List<PointsHistoryResponse> history) { this.history = history; }
}