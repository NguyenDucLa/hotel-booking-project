package com.hotel.backend.service;

import com.hotel.backend.dto.BookingRequest;
import com.hotel.backend.entity.*;
import com.hotel.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private BookingDetailRepository bookingDetailRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomTypeRepository roomTypeRepository;
    @Autowired private HotelRepository hotelRepository;

    @Transactional
    public Map<String, String> createBooking(BookingRequest request, User user) {
        // 1. Lấy thông tin loại phòng
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));

        // 2. Tìm phòng còn trống thuộc loại phòng này (trong khoảng ngày)
        LocalDate checkIn = request.getCheckInDate();
        LocalDate checkOut = request.getCheckOutDate();

        List<Long> occupiedIds = bookingRepository.findOccupiedRoomIds(checkIn, checkOut);

        Room availableRoom = roomRepository.findByRoomTypeId(roomType.getId()).stream()
                .filter(r -> !occupiedIds.contains(r.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rất tiếc, loại phòng này đã hết chỗ trong khoảng ngày bạn chọn"));

        // 3. Tính số đêm và tổng tiền
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) nights = 1;

        BigDecimal roomPrice = roomType.getBasePrice();
        BigDecimal totalAmount = roomPrice.multiply(new BigDecimal(nights));

        // 4. Tạo đơn hàng (Booking)
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(roomType.getHotel());
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setTotalAmount(totalAmount);
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setStatus("CONFIRMED");
        Booking savedBooking = bookingRepository.save(booking);

        // 5. Tạo chi tiết đơn hàng (BookingDetail)
        BookingDetail detail = new BookingDetail();
        detail.setBooking(savedBooking);
        detail.setRoom(availableRoom);
        detail.setPriceAtBooking(roomPrice);
        bookingDetailRepository.save(detail);

        // 6. Đánh dấu phòng là OCCUPIED
        availableRoom.setStatus("OCCUPIED");
        roomRepository.save(availableRoom);

        return Map.of("message", "Đặt phòng thành công! Quý khách vui lòng thanh toán tại khách sạn.");
    }
}