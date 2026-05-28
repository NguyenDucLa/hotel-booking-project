package com.hotel.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String authHeader = request.getHeader("Authorization");

            // 1. Kiểm tra Header Authorization
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtils.getEmailFromToken(token);

                // 2. Nếu có email và chưa được xác thực trong phiên này
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    
                    // 3. Kiểm tra token có hợp lệ không
                    if (jwtUtils.validateToken(token)) {
                        // QUAN TRỌNG: Phải nạp userDetails.getAuthorities() để nạp ROLE từ DB vào Security Context
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                        
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        logger.info("Xác thực thành công cho người dùng: {}, quyền: {}", email, userDetails.getAuthorities());
                    }
                }
            }
        } catch (Exception e) {
            // Nếu token sai hoặc hết hạn, không làm sập app, chỉ ghi log và cho đi tiếp như khách vãng lai
            logger.error("Lỗi xác thực JWT: {}", e.getMessage());
        }

        // Luôn gọi filterChain để request tiếp tục được xử lý (tránh bị treo trang)
        filterChain.doFilter(request, response);
    }
}