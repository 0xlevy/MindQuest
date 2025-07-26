package com.mindquest.repository;

import com.mindquest.entity.QuizCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizCategoryRepository extends JpaRepository<QuizCategory, Long> {
    
    @Query("SELECT c FROM QuizCategory c WHERE c.isActive = true AND " +
           "(:search IS NULL OR :search = '' OR UPPER(c.title) LIKE UPPER(CONCAT('%', :search, '%')) OR UPPER(c.description) LIKE UPPER(CONCAT('%', :search, '%'))) AND " +
           "(:difficulty IS NULL OR c.difficulty = :difficulty)")
    Page<QuizCategory> findActiveCategoriesWithFilters(@Param("search") String search, 
                                                      @Param("difficulty") QuizCategory.Difficulty difficulty, 
                                                      Pageable pageable);
    
    @Query("SELECT c FROM QuizCategory c WHERE c.isActive = true")
    Page<QuizCategory> findActiveCategories(Pageable pageable);
}