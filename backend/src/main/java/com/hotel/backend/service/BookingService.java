package com.hotel.backend.service;

import com.hotel.backend.dto.BookingRequest;
import com.hotel.backend.entity.*;
import com.hotel.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private BookingDetailRepository bookingDetailRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private HotelRepository hotelRepository;

    @Transactional
    public Map<String, String> createBooking(BookingRequest request, User user) {
        // 1. Lấy thông tin phòng cụ thể
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // 2. Tính số đêm và tổng tiền
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) nights = 1; // Mặc định ở 1 đêm nếu chọn trùng ngày
        
        BigDecimal roomPrice = room.getRoomType().getBasePrice();
        BigDecimal totalAmount = roomPrice.multiply(new BigDecimal(nights));

        // 3. Tạo đơn hàng (Booking)
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(room.getRoomType().getHotel());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setTotalAmount(totalAmount);
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setStatus("CONFIRMED"); // Tiền mặt thì xác nhận luôn
        Booking savedBooking = bookingRepository.save(booking);

        // 4. Tạo chi tiết đơn hàng (BookingDetail)
        BookingDetail detail = new BookingDetail();
        detail.setBooking(savedBooking);
        detail.setRoom(room); // Liên kết với phòng 101, 102...
        detail.setPriceAtBooking(roomPrice);
        bookingDetailRepository.save(detail);

        
        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        

        return Map.of("message", "Đặt phòng thành công! Quý khách vui lòng thanh toán tại khách sạn.");
    }
}