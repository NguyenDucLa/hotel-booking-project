package com.hotel.backend.controller;

import com.hotel.backend.dto.AuthResponse;
import com.hotel.backend.dto.LoginRequest;
import com.hotel.backend.dto.RegisterRequest;
import com.hotel.backend.entity.User;
import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        AuthResponse response = new AuthResponse(
            null,
            user.getEmail(),
            user.getFullName(),
            user.getRole().getName(),
            user.getId()
        );
        return ResponseEntity.ok(response);
    }
}
