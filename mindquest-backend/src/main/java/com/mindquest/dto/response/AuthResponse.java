package com.mindquest.dto.response;

public class AuthResponse {
    private UserResponse user;
    private String token;
    private String refreshToken;
    private int expiresIn;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(UserResponse user, String token, String refreshToken, int expiresIn) {
        this.user = user;
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
    }

    // Getters and Setters
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public int getExpiresIn() { return expiresIn; }
    public void setExpiresIn(int expiresIn) { this.expiresIn = expiresIn; }
}