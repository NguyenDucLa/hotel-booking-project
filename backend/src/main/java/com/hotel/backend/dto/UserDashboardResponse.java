package com.hotel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardResponse {
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private double totalSpent;
}