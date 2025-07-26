package com.mindquest.controller;

import com.mindquest.dto.response.ApiResponse;
import com.mindquest.dto.response.UserResponse;
import com.mindquest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @RequestBody UserResponse.UpdateProfileRequest request) {
        UserResponse user = userService.updateProfile(authentication, request);
        return ResponseEntity.ok(ApiResponse.success(user, "Profile updated successfully"));
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        UserResponse user = userService.uploadAvatar(authentication, file);
        return ResponseEntity.ok(ApiResponse.success(user, "Avatar uploaded successfully"));
    }
}