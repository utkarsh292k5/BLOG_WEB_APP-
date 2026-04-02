package com.blog.blogbackend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReviewRequest {
    
    @NotBlank
    @Size(max = 1000)
    private String content;
    
    @Min(1)
    @Max(5)
    private Integer rating;
    
    public ReviewRequest() {}
    
    public ReviewRequest(String content, Integer rating) {
        this.content = content;
        this.rating = rating;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
