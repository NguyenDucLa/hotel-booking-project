package com.hotel.backend.service;

import com.hotel.backend.dto.AuthResponse;
import com.hotel.backend.dto.LoginRequest;
import com.hotel.backend.dto.RegisterRequest;
import com.hotel.backend.entity.Role;
import com.hotel.backend.entity.User;
import com.hotel.backend.repository.RoleRepository;
import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại trong hệ thống");
            }

            Role customerRole = roleRepository.findByName("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Lỗi: Role CUSTOMER chưa được tạo trong Database. Vui lòng chạy seed_data.sql để tạo dữ liệu mẫu."));

            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setRole(customerRole);
            user.setIsActive(true);

            userRepository.save(user);

            String token = jwtUtils.generateToken(user.getEmail());

            return new AuthResponse(token, user.getEmail(), user.getFullName(), customerRole.getName(), user.getId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Đăng ký thất bại: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole().getName(), user.getId());
    }
}
