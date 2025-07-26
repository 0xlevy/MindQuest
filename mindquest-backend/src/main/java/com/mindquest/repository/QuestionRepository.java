package com.mindquest.repository;

import com.mindquest.entity.Question;
import com.mindquest.entity.QuizCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.category = :category ORDER BY RANDOM()")
    List<Question> findRandomQuestionsByCategory(@Param("category") QuizCategory category, Pageable pageable);
    
    @Query("SELECT q FROM Question q WHERE " +
           "(:category IS NULL OR q.category.id = :category) AND " +
           "(:difficulty IS NULL OR q.difficulty = :difficulty) AND " +
           "(:search IS NULL OR LOWER(q.question) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "q.isActive = true")
    Page<Question> findQuestionsWithFilters(@Param("category") Long categoryId, 
                                          @Param("difficulty") QuizCategory.Difficulty difficulty, 
                                          @Param("search") String search, 
                                          Pageable pageable);
    
    Long countByCategory(QuizCategory category);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.isActive = true")
    Long countActiveQuestions();
}