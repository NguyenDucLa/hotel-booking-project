package com.hotel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStats {
    private long totalHotels;
    private long totalUsers;
    private long totalBookings;
    private double totalRevenue;
}