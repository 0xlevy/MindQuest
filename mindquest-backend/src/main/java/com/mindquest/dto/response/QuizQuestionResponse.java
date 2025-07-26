package com.mindquest.dto.response;

import java.util.List;

public class QuizQuestionResponse {
    private String id;
    private String question;
    private List<String> options;
    private Integer timeLimit;
    private Integer points;

    public QuizQuestionResponse() {}

    public QuizQuestionResponse(String id, String question, List<String> options, Integer timeLimit, Integer points) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.timeLimit = timeLimit;
        this.points = points;
    }

    // getters and setters...
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}