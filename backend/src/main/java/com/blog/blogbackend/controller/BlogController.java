package com.blog.blogbackend.controller;

import com.blog.blogbackend.dto.BlogRequest;
import com.blog.blogbackend.dto.BlogResponse;
import com.blog.blogbackend.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {
    
    @Autowired
    private BlogService blogService;
    
    @GetMapping
    public ResponseEntity<?> getAllPublishedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<BlogResponse> blogs = blogService.getAllPublishedBlogs(page, size);
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id) {
        try {
            BlogResponse blog = blogService.getBlogById(id);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createBlog(@Valid @RequestBody BlogRequest blogRequest) {
        try {
            BlogResponse blog = blogService.createBlog(blogRequest);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest blogRequest) {
        try {
            BlogResponse blog = blogService.updateBlog(id, blogRequest);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok("Blog deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/author/{authorId}")
    public ResponseEntity<?> getBlogsByAuthor(@PathVariable Long authorId) {
        try {
            List<BlogResponse> blogs = blogService.getBlogsByAuthor(authorId);
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-blogs")
    public ResponseEntity<?> getCurrentUserBlogs() {
        try {
            List<BlogResponse> blogs = blogService.getCurrentUserBlogs();
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
