package com.mindquest.controller;

import com.mindquest.dto.response.ApiResponse;
import com.mindquest.dto.response.PointsHistoryResponse;
import com.mindquest.dto.response.PointsSummaryResponse;
import com.mindquest.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/points")
public class PointsController {

    @Autowired
    private PointsService pointsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<PointsSummaryResponse>> getPointsSummary(Authentication authentication) {
        PointsSummaryResponse summary = pointsService.getPointsSummary(authentication);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<PointsHistoryResponse>>> getPointsHistory(
            Authentication authentication,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PointsHistoryResponse> history = pointsService.getPointsHistory(authentication, type, page, size);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}