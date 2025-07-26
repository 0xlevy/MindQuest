package com.mindquest.controller;

import com.mindquest.dto.request.GoogleLoginRequest;
import com.mindquest.dto.request.LoginRequest;
import com.mindquest.dto.request.RegisterRequest;
import com.mindquest.dto.request.RefreshTokenRequest;
import com.mindquest.dto.response.ApiResponse;
import com.mindquest.dto.response.AuthResponse;
import com.mindquest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        AuthResponse result = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(ApiResponse.success(result, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse result = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(result, "User authenticated successfully"));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateWithGoogle(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        AuthResponse result = authService.authenticateWithGoogle(googleLoginRequest);
        return ResponseEntity.ok(ApiResponse.success(result, "Google authentication successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        AuthResponse result = authService.refreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(result, "Token refreshed successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        // In a stateless JWT setup, logout is handled client-side by removing the token
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}