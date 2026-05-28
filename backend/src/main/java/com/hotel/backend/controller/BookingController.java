package com.hotel.backend.controller;

import com.hotel.backend.dto.BookingRequest;
import com.hotel.backend.entity.Booking;
import com.hotel.backend.entity.User;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend gọi API
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Principal principal) {
        // 1. Kiểm tra xem người dùng đã đăng nhập chưa thông qua Token
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để thực hiện chức năng này!");
        }

        try {
            // 2. Lấy thông tin User từ email trong Token (principal.getName() trả về email)
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // 3. Gọi Service để xử lý lưu đơn đặt phòng
            return ResponseEntity.ok(bookingService.createBooking(request, user));
            
        } catch (Exception e) {
            // Trả về lỗi nếu có vấn đề trong quá trình đặt phòng
            return ResponseEntity.badRequest().body("Lỗi đặt phòng: " + e.getMessage());
        }
    }

    //api lịch sử đặt phòng của user
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        
        // Tìm User từ email trong Token
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        // Lấy danh sách booking của user đó
        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        return ResponseEntity.ok(bookings);
    }
}