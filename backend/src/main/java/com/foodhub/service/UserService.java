package com.foodhub.service;

import com.foodhub.entity.User;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public List<User> getUsersByRole(String role) {
        if (role == null || role.isBlank()) {
            return List.of();
        }
        return userRepository.findByRole(role.toUpperCase());
    }

    public User updateUser(Long id, User userDetails) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = getUserById(id);
        if (userDetails == null) {
            return user;
        }
        if (userDetails.getName() != null)
            user.setName(userDetails.getName());
        if (userDetails.getPhone() != null)
            user.setPhone(userDetails.getPhone());
        if (userDetails.getAddress() != null)
            user.setAddress(userDetails.getAddress());
        if (userDetails.getRole() != null && !userDetails.getRole().isBlank()) {
            user.setRole(userDetails.getRole().toUpperCase());
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
