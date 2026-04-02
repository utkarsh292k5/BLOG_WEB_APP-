package com.blog.blogbackend.dto;

import com.blog.blogbackend.entity.BlogStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class BlogRequest {
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    private String content;
    
    @Size(max = 500)
    private String excerpt;
    
    @Size(max = 200)
    private String featuredImage;
    
    @Size(max = 100)
    private String tags;
    
    public BlogRequest() {}
    
    public BlogRequest(String title, String content, String excerpt, String featuredImage, String tags) {
        this.title = title;
        this.content = content;
        this.excerpt = excerpt;
        this.featuredImage = featuredImage;
        this.tags = tags;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getExcerpt() {
        return excerpt;
    }
    
    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }
    
    public String getFeaturedImage() {
        return featuredImage;
    }
    
    public void setFeaturedImage(String featuredImage) {
        this.featuredImage = featuredImage;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
}
