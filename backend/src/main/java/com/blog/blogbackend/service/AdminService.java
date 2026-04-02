package com.blog.blogbackend.service;

import com.blog.blogbackend.dto.UserResponse;
import com.blog.blogbackend.entity.Role;
import com.blog.blogbackend.entity.User;
import com.blog.blogbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersWithPendingAuthorRequests() {
        return userRepository.findAll().stream()
                .filter(user -> user.getAuthorRequestPending() != null && user.getAuthorRequestPending())
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setRole(newRole);
        user.setAuthorRequestPending(false); // Clear pending request when role is updated

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    public UserResponse approveAuthorRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getAuthorRequestPending() == null || !user.getAuthorRequestPending()) {
            throw new RuntimeException("User does not have a pending author request");
        }

        user.setRole(Role.AUTHOR);
        user.setAuthorRequestPending(false);

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    public UserResponse rejectAuthorRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getAuthorRequestPending() == null || !user.getAuthorRequestPending()) {
            throw new RuntimeException("User does not have a pending author request");
        }

        user.setAuthorRequestPending(false);

        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public void deleteUser(Long userId) {
        User currentUser = authService.getCurrentUser();
        if (currentUser != null && currentUser.getId().equals(userId)) {
            throw new RuntimeException("You cannot delete your own account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        userRepository.delete(user);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAuthorRequestPending(user.getAuthorRequestPending());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}