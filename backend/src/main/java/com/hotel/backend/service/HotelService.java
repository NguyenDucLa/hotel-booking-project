package com.hotel.backend.service;

import com.hotel.backend.dto.HotelDetailResponse;
import com.hotel.backend.dto.RoomTypeAvailability;
import com.hotel.backend.entity.Hotel;
import com.hotel.backend.entity.RoomType;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Lấy chi tiết khách sạn kèm thông tin available_rooms cho từng loại phòng.
     * Công thức: available_rooms = total_rooms - số phòng đã đặt trong khoảng ngày
     */
    public HotelDetailResponse getHotelDetail(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel == null) return null;

        // Map<roomTypeId, bookedCount>
        Map<Long, Long> bookedMap = new HashMap<>();

        if (checkIn != null && checkOut != null) {
            List<Object[]> bookedData = bookingRepository.countBookedRoomsByType(checkIn, checkOut);
            for (Object[] row : bookedData) {
                Long typeId = ((Number) row[0]).longValue();
                Long count = ((Number) row[1]).longValue();
                bookedMap.put(typeId, count);
            }
        }

        // Xây dựng danh sách RoomTypeAvailability
        List<RoomTypeAvailability> roomTypeList = hotel.getRoomTypes().stream()
            .map(rt -> {
                long booked = bookedMap.getOrDefault(rt.getId(), 0L);
                long available = rt.getTotalRooms() != null ? rt.getTotalRooms() - booked : 0L;
                if (available < 0) available = 0;

                return RoomTypeAvailability.builder()
                    .id(rt.getId())
                    .name(rt.getName())
                    .description(rt.getDescription())
                    .basePrice(rt.getBasePrice())
                    .capacity(rt.getCapacity())
                    .breakfastIncluded(rt.getBreakfastIncluded())
                    .refundPolicy(rt.getRefundPolicy())
                    .totalRooms(rt.getTotalRooms())
                    .availableRooms(available)
                    .build();
            })
            .collect(Collectors.toList());

        return HotelDetailResponse.builder()
            .hotel(hotel)
            .roomTypes(roomTypeList)
            .build();
    }
}
