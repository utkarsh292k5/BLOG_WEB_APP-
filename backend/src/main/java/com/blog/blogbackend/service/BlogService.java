package com.blog.blogbackend.service;

import com.blog.blogbackend.dto.BlogRequest;
import com.blog.blogbackend.dto.BlogResponse;
import com.blog.blogbackend.entity.Blog;
import com.blog.blogbackend.entity.BlogStatus;
import com.blog.blogbackend.entity.Role;
import com.blog.blogbackend.entity.User;
import com.blog.blogbackend.repository.BlogRepository;
import com.blog.blogbackend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {
    
    @Autowired
    private BlogRepository blogRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private AuthService authService;
    
    public List<BlogResponse> getAllPublishedBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Blog> blogs = blogRepository.findByStatus(BlogStatus.APPROVED, pageable);
        
        return blogs.getContent().stream()
                .map(this::convertToBlogResponse)
                .collect(Collectors.toList());
    }
    
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        return convertToBlogResponse(blog);
    }
    
    public BlogResponse createBlog(BlogRequest blogRequest) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null || (currentUser.getRole() != Role.AUTHOR && currentUser.getRole() != Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only authors and admins can create blogs");
        }
        
        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setExcerpt(blogRequest.getExcerpt());
        blog.setFeaturedImage(blogRequest.getFeaturedImage());
        blog.setTags(blogRequest.getTags());
        blog.setAuthor(currentUser);
        
        // Set status based on user role
        if (currentUser.getRole() == Role.ADMIN) {
            blog.setStatus(BlogStatus.APPROVED);
        } else {
            blog.setStatus(BlogStatus.PENDING);
        }
        
        Blog savedBlog = blogRepository.save(blog);
        return convertToBlogResponse(savedBlog);
    }
    
    public BlogResponse updateBlog(Long id, BlogRequest blogRequest) {
        User currentUser = authService.getCurrentUser();
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        // Check if user can update this blog
        if (currentUser.getRole() != Role.ADMIN && !blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only update your own blogs");
        }
        
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setExcerpt(blogRequest.getExcerpt());
        blog.setFeaturedImage(blogRequest.getFeaturedImage());
        blog.setTags(blogRequest.getTags());
        
        // If author updates, set to pending for re-approval
        if (currentUser.getRole() == Role.AUTHOR) {
            blog.setStatus(BlogStatus.PENDING);
        }
        
        Blog updatedBlog = blogRepository.save(blog);
        return convertToBlogResponse(updatedBlog);
    }
    
    public void deleteBlog(Long id) {
        User currentUser = authService.getCurrentUser();
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        // Check if user can delete this blog
        if (currentUser.getRole() != Role.ADMIN && !blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only delete your own blogs");
        }
        
        blogRepository.delete(blog);
    }
    
    public List<BlogResponse> getBlogsByAuthor(Long authorId) {
        User author = new User();
        author.setId(authorId);
        List<Blog> blogs = blogRepository.findByAuthor(author);
        
        return blogs.stream()
                .map(this::convertToBlogResponse)
                .collect(Collectors.toList());
    }
    
    public List<BlogResponse> getCurrentUserBlogs() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        List<Blog> blogs = blogRepository.findByAuthor(currentUser);
        return blogs.stream()
                .map(this::convertToBlogResponse)
                .collect(Collectors.toList());
    }
    
    public List<BlogResponse> getPendingBlogs() {
        List<Blog> blogs = blogRepository.findByStatus(BlogStatus.PENDING);
        return blogs.stream()
                .map(this::convertToBlogResponse)
                .collect(Collectors.toList());
    }
    
    public BlogResponse approveBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        blog.setStatus(BlogStatus.APPROVED);
        Blog approvedBlog = blogRepository.save(blog);
        return convertToBlogResponse(approvedBlog);
    }
    
    public BlogResponse rejectBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        blog.setStatus(BlogStatus.REJECTED);
        Blog rejectedBlog = blogRepository.save(blog);
        return convertToBlogResponse(rejectedBlog);
    }
    
    private BlogResponse convertToBlogResponse(Blog blog) {
        BlogResponse response = new BlogResponse();
        response.setId(blog.getId());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        response.setExcerpt(blog.getExcerpt());
        response.setFeaturedImage(blog.getFeaturedImage());
        response.setTags(blog.getTags());
        response.setStatus(blog.getStatus());
        response.setCreatedAt(blog.getCreatedAt());
        response.setUpdatedAt(blog.getUpdatedAt());
        response.setPublishedAt(blog.getPublishedAt());
        response.setAuthorId(blog.getAuthor().getId());
        response.setAuthorUsername(blog.getAuthor().getUsername());
        response.setAuthorRole(blog.getAuthor().getRole());
        
        // Calculate average rating and review count
        Double averageRating = reviewRepository.getAverageRatingByBlog(blog);
        Long reviewCount = reviewRepository.countByBlog(blog);
        
        response.setAverageRating(averageRating != null ? averageRating : 0.0);
        response.setReviewCount(reviewCount != null ? reviewCount : 0L);
        
        return response;
    }
}
