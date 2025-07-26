package com.mindquest.dto.request;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {
    @NotBlank
    private String googleToken;

    @NotBlank
    private String clientId;

    // Constructors
    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String googleToken, String clientId) {
        this.googleToken = googleToken;
        this.clientId = clientId;
    }

    // Getters and Setters
    public String getGoogleToken() { return googleToken; }
    public void setGoogleToken(String googleToken) { this.googleToken = googleToken; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
}