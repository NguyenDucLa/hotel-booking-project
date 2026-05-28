package com.hotel.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore // BẮT BUỘC giữ cái này để chặn vòng lặp quay lại bảng Booking
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    // XÓA @JsonIgnore TẠI ĐÂY để hiện số phòng 101, 201...
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "price_at_booking", precision = 12, scale = 2)
    private BigDecimal priceAtBooking;
}