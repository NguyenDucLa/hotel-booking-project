package com.hotel.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long hotelId;
    private Long roomId; 
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String paymentMethod;
}