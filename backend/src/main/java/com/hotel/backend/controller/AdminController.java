package com.hotel.backend.controller;

import com.hotel.backend.dto.AdminDashboardStats;
import com.hotel.backend.entity.Booking;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

    // Lấy các con số thống kê cho trang Dashboard Admin
    @GetMapping("/stats")
    public AdminDashboardStats getStats() {
        long hotels = hotelRepository.count();
        long users = userRepository.count();
        long bookings = bookingRepository.count();
        
        // Tính doanh thu từ các đơn CONFIRMED (Tiền mặt) hoặc PAID (PayOS)
        List<Booking> allBookings = bookingRepository.findAll();
        double revenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "PAID".equals(b.getStatus()))
                .filter(b -> b.getTotalAmount() != null) // Chống lỗi Null doanh thu
                .mapToDouble(b -> b.getTotalAmount().doubleValue())
                .sum();

        return new AdminDashboardStats(hotels, users, bookings, revenue);
    }

    // 1. API lấy toàn bộ danh sách đơn đặt phòng (Đã sửa lỗi 404)
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        // Sắp xếp đơn mới nhất hiện lên đầu
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 2. API cập nhật trạng thái đơn hàng (Ví dụ: Admin bấm xác nhận đơn Tiền mặt)
    @PatchMapping("/bookings/{id}/status")
    public Booking updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}