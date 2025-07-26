package com.mindquest.config;

import com.mindquest.entity.QuizCategory;
import com.mindquest.entity.Question;
import com.mindquest.entity.User;
import com.mindquest.repository.QuizCategoryRepository;
import com.mindquest.repository.QuestionRepository;
import com.mindquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Configuration
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private QuizCategoryRepository categoryRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;
   @Autowired
   private com.mindquest.repository.QuizAttemptRepository quizAttemptRepository;
   @Autowired
   private com.mindquest.repository.CommunityPostRepository communityPostRepository;
   @Autowired
   private com.mindquest.repository.CryptoRewardRepository cryptoRewardRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed Users
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@mindquest.com");
            admin.setPassword("$2a$10$testhash"); // bcrypt hash for 'password'
            admin.setLevel(10);
            admin.setPoints(5000L);
            userRepository.save(admin);

            User user1 = new User();
            user1.setName("Alice");
            user1.setEmail("alice@mindquest.com");
            user1.setPassword("$2a$10$testhash");
            user1.setLevel(3);
            user1.setPoints(1200L);
            userRepository.save(user1);

            User user2 = new User();
            user2.setName("Bob");
            user2.setEmail("bob@mindquest.com");
            user2.setPassword("$2a$10$testhash");
            user2.setLevel(5);
            user2.setPoints(2500L);
            userRepository.save(user2);
        }

        // Seed Categories & Questions
        if (categoryRepository.count() == 0) {
            QuizCategory science = new QuizCategory("Science & Technology", "All about science and tech", "🧬");
            QuizCategory history = new QuizCategory("History & Culture", "World history and cultures", "🏺");
            QuizCategory math = new QuizCategory("Mathematics", "Math quizzes", "➗");
            categoryRepository.saveAll(Arrays.asList(science, history, math));

            User admin = userRepository.findAll().stream().findFirst().orElse(null);

            Question q1 = new Question("What is the chemical symbol for water?", science, Arrays.asList("H2O", "CO2", "O2", "NaCl"), 0);
            q1.setExplanation("H2O is the chemical formula for water.");
            q1.setCreatedBy(admin);
            Question q2 = new Question("Who was the first President of the United States?", history, Arrays.asList("Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"), 1);
            q2.setExplanation("George Washington was the first President.");
            q2.setCreatedBy(admin);
            Question q3 = new Question("What is 7 x 8?", math, Arrays.asList("54", "56", "58", "60"), 1);
            q3.setExplanation("7 multiplied by 8 is 56.");
            q3.setCreatedBy(admin);
            questionRepository.saveAll(Arrays.asList(q1, q2, q3));
        }

        // Seed Quiz Attempts
        if (quizAttemptRepository.count() == 0) {
            User user = userRepository.findAll().stream().filter(u -> !u.getEmail().equals("admin@mindquest.com")).findFirst().orElse(null);
            QuizCategory category = categoryRepository.findAll().stream().findFirst().orElse(null);
            if (user != null && category != null) {
                com.mindquest.entity.QuizAttempt attempt = new com.mindquest.entity.QuizAttempt(user, category);
                attempt.setScore(80);
                attempt.setTotalQuestions(10);
                attempt.setCorrectAnswers(8);
                attempt.setStartedAt(java.time.LocalDateTime.now().minusDays(1));
                attempt.setCompletedAt(java.time.LocalDateTime.now().minusDays(1).plusMinutes(10));
                attempt.setTimeSpent(600);
                quizAttemptRepository.save(attempt);
            }
        }

        // Seed Rewards
        if (cryptoRewardRepository.count() == 0) {
            com.mindquest.entity.CryptoReward reward = new com.mindquest.entity.CryptoReward();
            reward.setName("Starter Pack");
            reward.setDescription("Welcome bonus for new users");
            reward.setMinPoints(100L);
            reward.setValue("0.1 ETH");
            reward.setAvailable(true);
            cryptoRewardRepository.save(reward);
        }

        // Seed Community Posts
        if (communityPostRepository.count() == 0) {
            User user = userRepository.findAll().stream().filter(u -> !u.getEmail().equals("admin@mindquest.com")).findFirst().orElse(null);
            QuizCategory category = categoryRepository.findAll().stream().findFirst().orElse(null);
            if (user != null && category != null) {
                com.mindquest.entity.CommunityPost post = new com.mindquest.entity.CommunityPost();
                post.setTitle("Welcome to MindQuest!");
                post.setContent("This is the first post in the community. Feel free to ask questions and share your thoughts.");
                post.setCategory(category);
                post.setAuthor(user);
                post.setCreatedAt(java.time.LocalDateTime.now().minusDays(2));
                communityPostRepository.save(post);
            }
        }
    }
}
