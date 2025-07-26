package com.mindquest.dto.response;

public class CategoryStats {
    private String categoryName;
    private int quizCount;

    public CategoryStats() {}

    public CategoryStats(String categoryName, int quizCount) {
        this.categoryName = categoryName;
        this.quizCount = quizCount;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getQuizCount() {
        return quizCount;
    }

    public void setQuizCount(int quizCount) {
        this.quizCount = quizCount;
    }
}