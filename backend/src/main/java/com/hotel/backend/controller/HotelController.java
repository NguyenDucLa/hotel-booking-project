package com.hotel.backend.controller;

import com.hotel.backend.dto.HotelDetailResponse;
import com.hotel.backend.entity.Hotel;
import com.hotel.backend.entity.User;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.BookingRepository;
import com.hotel.backend.repository.UserRepository;
import com.hotel.backend.security.CustomUserDetails;
import com.hotel.backend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

    @Autowired
    private HotelService hotelService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy userId từ Authentication object
     */
    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null) return null;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getId();
    }

    /**
     * Lấy role từ Authentication object
     */
    private String getRoleFromAuth(Authentication authentication) {
        if (authentication == null) return null;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getRole().getName();
    }

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

    /**
     * GET /api/hotels - Lấy danh sách khách sạn
     * ADMIN: tất cả, HOTEL_OWNER: chỉ của họ, Khách vãng lai: tất cả
     */
    @GetMapping
    public List<Hotel> getAllHotels(Authentication authentication) {
        if (authentication != null) {
            String role = getRoleFromAuth(authentication);
            if ("HOTEL_OWNER".equals(role)) {
                Long ownerId = getUserIdFromAuth(authentication);
                return hotelRepository.findByOwnerId(ownerId);
            }
        }
        // ADMIN hoặc khách vãng lai: xem tất cả
        return hotelRepository.findAll();
    }

    @GetMapping("/{id}")
    public HotelDetailResponse getHotelById(
        @PathVariable Long id,
        @RequestParam(required = false) String checkIn,
        @RequestParam(required = false) String checkOut
    ) {
        LocalDate start = null;
        LocalDate end = null;

        if (checkIn != null && checkOut != null && !checkIn.isEmpty() && !checkOut.isEmpty()) {
            start = LocalDate.parse(checkIn);
            end = LocalDate.parse(checkOut);
        }

        // Sử dụng HotelService để tính available_rooms cho từng loại phòng
        return hotelService.getHotelDetail(id, start, end);
    }

    @GetMapping("/search")
    public List<Hotel> searchHotels(@RequestParam String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return hotelRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(keyword, keyword);
        }
        return hotelRepository.findAll();
    }

    /**
     * POST /api/hotels - Thêm khách sạn mới
     * HOTEL_OWNER: tự động gán owner_id từ tài khoản đăng nhập
     * ADMIN: có thể gán owner_id tùy ý
     */
    @PostMapping
    public Hotel createHotel(@RequestBody Hotel hotel, Authentication authentication) {
        if (authentication != null) {
            String role = getRoleFromAuth(authentication);
            if ("HOTEL_OWNER".equals(role)) {
                // Tự động gán owner_id = ID người đang đăng nhập
                Long ownerId = getUserIdFromAuth(authentication);
                User owner = userRepository.findById(ownerId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
                hotel.setOwner(owner);
            }
            // ADMIN: giữ nguyên owner_id từ request (nếu có)
        }
        return hotelRepository.save(hotel);
    }

    /**
     * PUT /api/hotels/{id} - Cập nhật thông tin khách sạn
     * HOTEL_OWNER: chỉ sửa được KS của mình
     * ADMIN: sửa được tất cả
     */
    @PutMapping("/{id}")
    public Hotel updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails, Authentication authentication) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn ID: " + id));

        // Kiểm tra quyền: Owner chỉ sửa KS của mình
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            if (hotel.getOwner() == null || !hotel.getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền sửa khách sạn này!");
            }
        }
        
        hotel.setName(hotelDetails.getName());
        hotel.setAddress(hotelDetails.getAddress());
        hotel.setCity(hotelDetails.getCity());
        hotel.setDescription(hotelDetails.getDescription());
        hotel.setStarRating(hotelDetails.getStarRating());
        
        return hotelRepository.save(hotel);
    }

    /**
     * DELETE /api/hotels/{id} - Xóa khách sạn
     * HOTEL_OWNER: chỉ xóa KS của mình
     * ADMIN: xóa được tất cả
     */
    @DeleteMapping("/{id}")
    public void deleteHotel(@PathVariable Long id, Authentication authentication) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn ID: " + id));

        // Kiểm tra quyền: Owner chỉ xóa KS của mình
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            if (hotel.getOwner() == null || !hotel.getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền xóa khách sạn này!");
            }
        }

        hotelRepository.deleteById(id);
    }
}
