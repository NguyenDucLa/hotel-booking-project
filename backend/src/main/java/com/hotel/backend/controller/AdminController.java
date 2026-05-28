package com.hotel.backend.controller;

import com.hotel.backend.dto.AdminDashboardStats;
import com.hotel.backend.entity.Booking;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private HotelRepository hotelRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;

    @GetMapping("/stats")
    public AdminDashboardStats getStats() {
        long hotels = hotelRepository.count();
        long users = userRepository.count();
        long bookings = bookingRepository.count();
        
        // Tính doanh thu từ các đơn CONFIRMED (đã xác nhận/thanh toán)
        List<Booking> allBookings = bookingRepository.findAll();
        double revenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalAmount().doubleValue())
                .sum();

        return new AdminDashboardStats(hotels, users, bookings, revenue);
    }
}