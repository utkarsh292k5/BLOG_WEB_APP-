package com.blog.blogbackend.controller;

import com.blog.blogbackend.dto.BlogResponse;
import com.blog.blogbackend.dto.UserResponse;
import com.blog.blogbackend.entity.Role;
import com.blog.blogbackend.service.AdminService;
import com.blog.blogbackend.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private BlogService blogService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/users/pending-author-requests")
    public ResponseEntity<?> getUsersWithPendingAuthorRequests() {
        try {
            List<UserResponse> users = adminService.getUsersWithPendingAuthorRequests();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestParam Role role) {
        try {
            UserResponse user = adminService.updateUserRole(userId, role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/approve-author")
    public ResponseEntity<?> approveAuthorRequest(@PathVariable Long userId) {
        try {
            UserResponse user = adminService.approveAuthorRequest(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/reject-author")
    public ResponseEntity<?> rejectAuthorRequest(@PathVariable Long userId) {
        try {
            UserResponse user = adminService.rejectAuthorRequest(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/blogs/pending")
    public ResponseEntity<?> getPendingBlogs() {
        try {
            List<BlogResponse> blogs = blogService.getPendingBlogs();
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/blogs/{blogId}/approve")
    public ResponseEntity<?> approveBlog(@PathVariable Long blogId) {
        try {
            BlogResponse blog = blogService.approveBlog(blogId);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/blogs/{blogId}/reject")
    public ResponseEntity<?> rejectBlog(@PathVariable Long blogId) {
        try {
            BlogResponse blog = blogService.rejectBlog(blogId);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}