package com.securehaven.control.controller;

import com.securehaven.control.model.User;
import com.securehaven.control.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            // In a real app, you'd return a JWT or session token. 
            // Here we just return the user info for simplicity.
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}
