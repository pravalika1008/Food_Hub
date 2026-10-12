package com.foodhub.service;

import com.foodhub.dto.LoginRequest;
import com.foodhub.dto.LoginResponse;
import com.foodhub.dto.RegisterRequest;
import com.foodhub.entity.Cart;
import com.foodhub.entity.User;
import com.foodhub.exception.ResourceNotFoundException;
import com.foodhub.repository.CartRepository;
import com.foodhub.repository.UserRepository;
import com.foodhub.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Registration request, email, and password must not be null");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already registered!");
        }

        String role = request.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "CUSTOMER";
        } else {
            role = role.toUpperCase().trim();
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        // If customer, initialize a cart
        if ("CUSTOMER".equalsIgnoreCase(role)) {
            Cart cart = new Cart(savedUser);
            cartRepository.save(cart);
        }

        // Generate JWT
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                java.util.Collections.emptyList());
        String token = jwtService.generateToken(userDetails, savedUser.getRole());

        return new LoginResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getPhone(),
                savedUser.getAddress());
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Login request, email, and password must not be null");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String email = user.getEmail() != null ? user.getEmail() : "";
        String password = user.getPassword() != null ? user.getPassword() : "";
        String role = user.getRole() != null ? user.getRole() : "CUSTOMER";

        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                email,
                password,
                java.util.Collections.emptyList());
        String token = jwtService.generateToken(userDetails, role);

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress());
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        String email = authentication.getName();
        if (email == null) {
            throw new IllegalStateException("No email found in security context");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
