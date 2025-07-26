package com.mindquest.repository;

import com.mindquest.entity.CommunityPost;
import com.mindquest.entity.QuizCategory;
import com.mindquest.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    
    @Query("SELECT p FROM CommunityPost p WHERE p.category = :category ORDER BY " +
           "CASE WHEN :sort = 'popular' THEN p.likes END DESC, " +
           "CASE WHEN :sort = 'replies' THEN p.replies END DESC, " +
           "CASE WHEN :sort = 'recent' THEN p.createdAt END DESC")
    Page<CommunityPost> findByCategoryWithSort(@Param("category") QuizCategory category, 
                                              @Param("sort") String sort, 
                                              Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM CommunityPost p")
    Long countAllPosts();
    
    @Query("SELECT COUNT(p) FROM CommunityPost p WHERE p.category = :category")
    Long countByCategory(@Param("category") QuizCategory category);
    
    @Modifying
    @Query("UPDATE CommunityPost p SET p.views = p.views + 1 WHERE p.id = :postId")
    void incrementViews(@Param("postId") Long postId);
    
    @Query("SELECT p FROM CommunityPost p WHERE p.author = :author ORDER BY p.createdAt DESC")
    Page<CommunityPost> findByAuthor(@Param("author") User author, Pageable pageable);
}