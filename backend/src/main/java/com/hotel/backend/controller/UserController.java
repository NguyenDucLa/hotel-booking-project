package com.hotel.backend.controller;

import com.hotel.backend.dto.UserDashboardResponse;
import com.hotel.backend.entity.Booking;
import com.hotel.backend.entity.User;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/dashboard")
    public UserDashboardResponse getDashboardStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).get();
        List<Booking> myBookings = bookingRepository.findByUserId(user.getId());

        long total = myBookings.size();
        long pending = myBookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
        long confirmed = myBookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        double spent = myBookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalAmount().doubleValue())
                .sum();

        return new UserDashboardResponse(total, pending, confirmed, spent);
    }
}