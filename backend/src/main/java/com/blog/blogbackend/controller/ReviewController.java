package com.blog.blogbackend.controller;

import com.blog.blogbackend.dto.ReviewRequest;
import com.blog.blogbackend.dto.ReviewResponse;
import com.blog.blogbackend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping("/blogs/{blogId}")
    public ResponseEntity<?> createReview(@PathVariable Long blogId, @Valid @RequestBody ReviewRequest reviewRequest) {
        try {
            ReviewResponse review = reviewService.createReview(blogId, reviewRequest);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @Valid @RequestBody ReviewRequest reviewRequest) {
        try {
            ReviewResponse review = reviewService.updateReview(reviewId, reviewRequest);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/blogs/{blogId}")
    public ResponseEntity<?> getReviewsByBlog(@PathVariable Long blogId) {
        try {
            List<ReviewResponse> reviews = reviewService.getReviewsByBlog(blogId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-reviews")
    public ResponseEntity<?> getCurrentUserReviews() {
        try {
            List<ReviewResponse> reviews = reviewService.getCurrentUserReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
