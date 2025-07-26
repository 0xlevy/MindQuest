package com.mindquest.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.mindquest.dto.request.GoogleLoginRequest;
import com.mindquest.dto.request.LoginRequest;
import com.mindquest.dto.request.RegisterRequest;
import com.mindquest.dto.response.AuthResponse;
import com.mindquest.dto.response.UserResponse;
import com.mindquest.entity.User;
import com.mindquest.exception.BadRequestException;
import com.mindquest.exception.ResourceNotFoundException;
import com.mindquest.repository.UserRepository;
import com.mindquest.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${app.admin-emails}")
    private List<String> adminEmails;

    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        // Create new user account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setProvider(User.AuthProvider.EMAIL);
        user.setLastActive(LocalDateTime.now());

        // Set admin role if email is in admin list
        if (adminEmails.contains(signUpRequest.getEmail())) {
            user.setRole(User.Role.ADMIN);
            user.setPermissions(Set.of(
                User.Permission.TAKE_QUIZ,
                User.Permission.VIEW_LEADERBOARD,
                User.Permission.MODERATE_COMMUNITY,
                User.Permission.MANAGE_QUESTIONS,
                User.Permission.MANAGE_USERS,
                User.Permission.VIEW_ANALYTICS,
                User.Permission.MANAGE_REWARDS,
                User.Permission.SYSTEM_ADMIN
            ));
        } else {
            user.setRole(User.Role.USER);
            user.setPermissions(Set.of(
                User.Permission.TAKE_QUIZ,
                User.Permission.VIEW_LEADERBOARD
            ));
        }

        User result = userRepository.save(user);

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getEmail(),
                        signUpRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        UserResponse userResponse = new UserResponse(result);
        return new AuthResponse(userResponse, jwt, refreshToken, tokenProvider.getJwtExpirationInMs());
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

        // Update last active
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);

        UserResponse userResponse = new UserResponse(user);
        return new AuthResponse(userResponse, jwt, refreshToken, tokenProvider.getJwtExpirationInMs());
    }

    public AuthResponse authenticateWithGoogle(GoogleLoginRequest googleLoginRequest) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleLoginRequest.getGoogleToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    // Create new user
                    user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setProvider(User.AuthProvider.GOOGLE);
                    user.setAvatar(pictureUrl);
                    user.setLastActive(LocalDateTime.now());

                    // Set admin role if email is in admin list
                    if (adminEmails.contains(email)) {
                        user.setRole(User.Role.ADMIN);
                        user.setPermissions(Set.of(
                            User.Permission.TAKE_QUIZ,
                            User.Permission.VIEW_LEADERBOARD,
                            User.Permission.MODERATE_COMMUNITY,
                            User.Permission.MANAGE_QUESTIONS,
                            User.Permission.MANAGE_USERS,
                            User.Permission.VIEW_ANALYTICS,
                            User.Permission.MANAGE_REWARDS,
                            User.Permission.SYSTEM_ADMIN
                        ));
                    } else {
                        user.setRole(User.Role.USER);
                        user.setPermissions(Set.of(
                            User.Permission.TAKE_QUIZ,
                            User.Permission.VIEW_LEADERBOARD
                        ));
                    }

                    user = userRepository.save(user);
                } else {
                    // Update existing user
                    user.setLastActive(LocalDateTime.now());
                    if (user.getAvatar() == null || user.getAvatar().isEmpty()) {
                        user.setAvatar(pictureUrl);
                    }
                    user = userRepository.save(user);
                }

                // Create authentication token
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = tokenProvider.generateToken(authentication);
                String refreshToken = tokenProvider.generateRefreshToken(authentication);

                UserResponse userResponse = new UserResponse(user);
                return new AuthResponse(userResponse, jwt, refreshToken, tokenProvider.getJwtExpirationInMs());
            } else {
                throw new BadRequestException("Invalid Google token");
            }
        } catch (GeneralSecurityException | IOException e) {
            throw new BadRequestException("Failed to verify Google token");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (tokenProvider.validateToken(refreshToken)) {
            Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), null, Collections.emptyList());

            String newJwt = tokenProvider.generateToken(authentication);
            String newRefreshToken = tokenProvider.generateRefreshToken(authentication);

            UserResponse userResponse = new UserResponse(user);
            return new AuthResponse(userResponse, newJwt, newRefreshToken, tokenProvider.getJwtExpirationInMs());
        } else {
            throw new BadRequestException("Invalid refresh token");
        }
    }
}