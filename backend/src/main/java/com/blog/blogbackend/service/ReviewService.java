package com.blog.blogbackend.service;

import com.blog.blogbackend.dto.ReviewRequest;
import com.blog.blogbackend.dto.ReviewResponse;
import com.blog.blogbackend.entity.Blog;
import com.blog.blogbackend.entity.Review;
import com.blog.blogbackend.entity.User;
import com.blog.blogbackend.repository.BlogRepository;
import com.blog.blogbackend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private BlogRepository blogRepository;
    
    @Autowired
    private AuthService authService;
    
    public ReviewResponse createReview(Long blogId, ReviewRequest reviewRequest) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User must be logged in to create reviews");
        }
        
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));
        
        // Check if user already reviewed this blog
        Optional<Review> existingReview = reviewRepository.findByUserAndBlog(currentUser, blog);
        if (existingReview.isPresent()) {
            throw new RuntimeException("You have already reviewed this blog");
        }
        
        Review review = new Review();
        review.setContent(reviewRequest.getContent());
        review.setRating(reviewRequest.getRating());
        review.setUser(currentUser);
        review.setBlog(blog);
        
        Review savedReview = reviewRepository.save(review);
        return convertToReviewResponse(savedReview);
    }
    
    public ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest) {
        User currentUser = authService.getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        // Check if user can update this review
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only update your own reviews");
        }
        
        review.setContent(reviewRequest.getContent());
        review.setRating(reviewRequest.getRating());
        
        Review updatedReview = reviewRepository.save(review);
        return convertToReviewResponse(updatedReview);
    }
    
    public void deleteReview(Long reviewId) {
        User currentUser = authService.getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        // Check if user can delete this review
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied: You can only delete your own reviews");
        }
        
        reviewRepository.delete(review);
    }
    
    public List<ReviewResponse> getReviewsByBlog(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));
        
        List<Review> reviews = reviewRepository.findByBlog(blog);
        return reviews.stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }
    
    public List<ReviewResponse> getCurrentUserReviews() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        List<Review> reviews = reviewRepository.findByUser(currentUser);
        return reviews.stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }
    
    private ReviewResponse convertToReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        response.setUserId(review.getUser().getId());
        response.setUserUsername(review.getUser().getUsername());
        response.setBlogId(review.getBlog().getId());
        
        return response;
    }
}
