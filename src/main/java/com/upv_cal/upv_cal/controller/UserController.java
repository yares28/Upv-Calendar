package com.upv_cal.upv_cal.controller;

import com.upv_cal.upv_cal.model.User;
import com.upv_cal.upv_cal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for user-related endpoints
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * User registration endpoint
     * 
     * @param user User information for registration
     * @return Registration result with user ID
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Validate email and password
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (!validateEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format"));
        }

        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }

        // Check if user already exists
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }

        // Set default name if not provided
        if (user.getName() == null || user.getName().isEmpty()) {
            user.setName(user.getEmail().split("@")[0]);
        }

        // Register user
        User registeredUser = userService.registerUser(user);

        // Return success with user id
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", registeredUser.getId());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * User login endpoint
     * 
     * @param credentials User credentials
     * @return User information if login successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Validate input
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        // Find and validate user
        User user = userService.findByEmail(email);
        if (user == null || !password.equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        // Create response with user info
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("email", user.getEmail());
        userInfo.put("name", user.getName() != null ? user.getName() : user.getEmail().split("@")[0]);

        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }

    /**
     * Validate email format
     * 
     * @param email Email to validate
     * @return True if email format is valid
     */
    private boolean validateEmail(String email) {
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        return email.matches(emailRegex);
    }
}