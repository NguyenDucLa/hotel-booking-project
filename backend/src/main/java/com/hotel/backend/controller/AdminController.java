package com.hotel.backend.controller;

import com.hotel.backend.dto.AdminDashboardStats;
import com.hotel.backend.entity.Booking;
import com.hotel.backend.entity.User;
import com.hotel.backend.entity.Role;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.RoleRepository;
import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Cấp quyền cho Frontend gọi API Admin
public class AdminController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Lấy userId từ Authentication object (Principal)
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getId();
    }

    /**
     * Lấy role từ Authentication object
     */
    private String getRoleFromAuth(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getRole().getName();
    }

    // Lấy các con số thống kê cho trang Dashboard
    // ADMIN: xem tổng toàn sàn, HOTEL_OWNER: chỉ xem của riêng họ
    @GetMapping("/stats")
    public AdminDashboardStats getStats(Authentication authentication) {
        String role = getRoleFromAuth(authentication);

        if ("HOTEL_OWNER".equals(role)) {
            Long ownerId = getUserIdFromAuth(authentication);
            long hotels = hotelRepository.countByOwnerId(ownerId);
            long users = 0; // Owner không xem được danh sách User hệ thống
            long bookings = bookingRepository.countByHotelOwnerId(ownerId);
            double revenue = bookingRepository.sumRevenueByOwnerId(ownerId);
            return new AdminDashboardStats(hotels, users, bookings, revenue);
        }

        // ADMIN: thống kê toàn sàn
        long hotels = hotelRepository.count();
        long users = userRepository.count();
        long bookings = bookingRepository.count();
        // Tính doanh thu từ các đơn CONFIRMED hoặc PAID
        List<Booking> allBookings = bookingRepository.findAll();
        double revenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "PAID".equals(b.getStatus()))
                .filter(b -> b.getTotalAmount() != null)
                .mapToDouble(b -> b.getTotalAmount().doubleValue())
                .sum();

        return new AdminDashboardStats(hotels, users, bookings, revenue);
    }

    // 1. API lấy danh sách đơn đặt phòng
    // ADMIN: tất cả đơn, HOTEL_OWNER: chỉ đơn thuộc khách sạn của họ
    @GetMapping("/bookings")
    public List<Booking> getAllBookings(Authentication authentication) {
        String role = getRoleFromAuth(authentication);

        if ("HOTEL_OWNER".equals(role)) {
            Long ownerId = getUserIdFromAuth(authentication);
            return bookingRepository.findByHotelOwnerId(ownerId);
        }

        // ADMIN: tất cả đơn, sắp xếp mới nhất lên đầu
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 2. API cập nhật trạng thái đơn hàng (Admin hoặc Owner xác nhận đơn)
    @PatchMapping("/bookings/{id}/status")
    public Booking updateBookingStatus(@PathVariable Long id, @RequestParam String status, Authentication authentication) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));

        String role = getRoleFromAuth(authentication);

        // Nếu là HOTEL_OWNER, kiểm tra đơn này có thuộc khách sạn của họ không
        if ("HOTEL_OWNER".equals(role)) {
            Long ownerId = getUserIdFromAuth(authentication);
            if (!booking.getHotel().getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền cập nhật đơn này!");
            }
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // 3. API lấy danh sách Users (CHỈ ADMIN mới được gọi)
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 4. API cập nhật quyền User (CHỈ ADMIN mới được gọi)
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateUserRole(@PathVariable Long id, @RequestParam String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + id));
        Role newRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Role: " + roleName));
        user.setRole(newRole);
        return userRepository.save(user);
    }
}