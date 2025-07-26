package com.mindquest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MindQuestApplication {
    public static void main(String[] args) {
        SpringApplication.run(MindQuestApplication.class, args);
    }
}