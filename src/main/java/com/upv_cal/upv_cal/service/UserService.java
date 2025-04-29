package com.upv_cal.upv_cal.service;

import com.upv_cal.upv_cal.model.User;

/**
 * Service interface for user management
 */
public interface UserService {

    /**
     * Register a new user
     * 
     * @param user User information
     * @return Registered user with ID
     */
    User registerUser(User user);

    /**
     * Find user by email
     * 
     * @param email User email
     * @return User if found, null otherwise
     */
    User findByEmail(String email);

    /**
     * Check if user exists by email
     * 
     * @param email User email
     * @return True if user exists
     */
    boolean existsByEmail(String email);
}