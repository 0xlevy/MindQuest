// filepath: /home/primes/Sandbox/MindQuest/mindquest-backend/src/main/java/com/mindquest/dto/request/UpdateProfileRequest.java
package com.mindquest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String bio;
    private String profilePicture;
}