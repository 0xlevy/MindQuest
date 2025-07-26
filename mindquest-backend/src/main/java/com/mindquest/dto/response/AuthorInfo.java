package com.mindquest.dto.response;

public class AuthorInfo {
    private String authorId;
    private String authorName;

    public AuthorInfo() {}

    public AuthorInfo(String authorId, String authorName) {
        this.authorId = authorId;
        this.authorName = authorName;
    }

    // getters and setters
    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}