package com.blog.blogbackend.repository;

import com.blog.blogbackend.entity.Blog;
import com.blog.blogbackend.entity.Review;
import com.blog.blogbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBlog(Blog blog);
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndBlog(User user, Blog blog);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.blog = :blog")
    Double getAverageRatingByBlog(@Param("blog") Blog blog);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.blog = :blog")
    Long countByBlog(@Param("blog") Blog blog);
}
