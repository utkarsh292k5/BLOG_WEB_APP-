package com.blog.blogbackend.repository;

import com.blog.blogbackend.entity.Blog;
import com.blog.blogbackend.entity.BlogStatus;
import com.blog.blogbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);
    List<Blog> findByStatus(BlogStatus status);
    List<Blog> findByAuthor(User author);
    List<Blog> findByAuthorAndStatus(User author, BlogStatus status);
    
    @Query("SELECT b FROM Blog b WHERE b.status = :status ORDER BY b.publishedAt DESC")
    List<Blog> findPublishedBlogsOrderByPublishedDate(@Param("status") BlogStatus status);
    
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.status = :status")
    Long countByStatus(@Param("status") BlogStatus status);
}
