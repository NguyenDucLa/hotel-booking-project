package com.hotel.backend.controller;

import com.hotel.backend.entity.Hotel;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList; 
import java.time.LocalDate;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/featured")
    public ResponseEntity<List<Hotel>> getFeaturedHotels() {
        List<Hotel> hotels = hotelRepository.findTop4ByOrderByStarRatingDesc();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/count-by-city")
    public List<Object[]> getCountByCity() {
        List<Object[]> counts = hotelRepository.countHotelsByCity();
        return counts != null ? counts : new ArrayList<>();
}

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Hotel>> getHotelsByCity(@PathVariable String city) {
        List<Hotel> hotels = hotelRepository.findByCity(city);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @GetMapping("/{id}")
    public Hotel getHotelById(
        @PathVariable Long id,
        @RequestParam(required = false) String checkIn,
        @RequestParam(required = false) String checkOut
    ) {
        Hotel hotel = hotelRepository.findById(id).orElse(null);
        if (hotel == null) return null;

        // Nếu khách có chọn ngày, ta mới tính toán Xanh/Đỏ
        if (checkIn != null && checkOut != null && !checkIn.isEmpty()) {
            LocalDate start = LocalDate.parse(checkIn);
            LocalDate end = LocalDate.parse(checkOut);

            // Lấy danh sách ID các phòng đã có người đặt trong khoảng ngày này
            List<Long> occupiedIds = bookingRepository.findOccupiedRoomIds(start, end);

            // Duyệt qua từng phòng của khách sạn để gán trạng thái động
            hotel.getRoomTypes().forEach(type -> {
                type.getRooms().forEach(room -> {
                    if (occupiedIds.contains(room.getId())) {
                        room.setStatus("OCCUPIED"); // Đỏ
                    } else {
                        room.setStatus("AVAILABLE"); // Xanh
                    }
                });
            });
        } else {
            // Nếu KHÔNG chọn ngày, ép tất cả về AVAILABLE để khách xem chơi
            hotel.getRoomTypes().forEach(type -> {
                type.getRooms().forEach(room -> room.setStatus("AVAILABLE"));
            });
        }

        return hotel;
    }

    @GetMapping("/search")
    public List<Hotel> searchHotels(@RequestParam String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Truyền keyword vào cả 2 tham số name và city
            return hotelRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(keyword, keyword);
        }
        return hotelRepository.findAll();
    }
}
