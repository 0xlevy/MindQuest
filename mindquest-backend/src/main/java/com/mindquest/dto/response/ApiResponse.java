package com.mindquest.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    private List<ErrorDetail> errors;

    // Constructors
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(boolean success, T data, String message) {
        this();
        this.success = success;
        this.data = data;
        this.message = message;
    }

    public ApiResponse(boolean success, T data, String message, LocalDateTime timestamp) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = timestamp;
    }

    public ApiResponse(boolean success, T data, String message, List<ErrorDetail> errors) {
        this();
        this.success = success;
        this.data = data;
        this.message = message;
        this.errors = errors;
    }

    // Static factory methods
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Success");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }

    public static <T> ApiResponse<T> error(String message, List<ErrorDetail> errors) {
        return new ApiResponse<>(false, null, message, errors);
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public List<ErrorDetail> getErrors() { return errors; }
    public void setErrors(List<ErrorDetail> errors) { this.errors = errors; }

    public static class ErrorDetail {
        private String field;
        private String code;
        private String message;

        public ErrorDetail() {}

        public ErrorDetail(String field, String code, String message) {
            this.field = field;
            this.code = code;
            this.message = message;
        }

        // Getters and Setters
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}