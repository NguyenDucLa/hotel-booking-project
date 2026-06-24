package com.hotel.backend.service;

import com.hotel.backend.entity.BookingDetail;
import com.hotel.backend.entity.Hotel;
import com.hotel.backend.entity.Room;
import com.hotel.backend.entity.RoomType;
import com.hotel.backend.repository.BookingDetailRepository;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.RoomRepository;
import com.hotel.backend.repository.RoomTypeRepository;
import com.hotel.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null) return null;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getId();
    }

    private String getRoleFromAuth(Authentication authentication) {
        if (authentication == null) return null;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getRole().getName();
    }

    /**
     * Lấy danh sách loại phòng.
     * ADMIN: tất cả. HOTEL_OWNER: chỉ loại phòng thuộc KS của họ.
     */
    public List<RoomType> getAllRoomTypes(Authentication authentication) {
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            List<Hotel> ownedHotels = hotelRepository.findByOwnerId(ownerId);
            if (ownedHotels.isEmpty()) return List.of();
            // Lấy roomTypes từ tất cả KS của Owner
            return ownedHotels.stream()
                    .flatMap(hotel -> roomTypeRepository.findByHotelId(hotel.getId()).stream())
                    .toList();
        }
        // ADMIN: tất cả
        return roomTypeRepository.findAll();
    }

    /**
     * Thêm loại phòng mới.
     * HOTEL_OWNER: chỉ được thêm vào KS của mình.
     */
    public RoomType createRoomType(RoomType roomType, Authentication authentication) {
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            Hotel hotel = hotelRepository.findById(roomType.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn"));
            if (hotel.getOwner() == null || !hotel.getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền thêm loại phòng vào khách sạn này!");
            }
        }
        return roomTypeRepository.save(roomType);
    }

    /**
     * Cập nhật loại phòng.
     * HOTEL_OWNER: chỉ sửa được loại phòng thuộc KS của mình.
     */
    public RoomType updateRoomType(Long id, RoomType details, Authentication authentication) {
        RoomType existing = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng ID: " + id));

        // Kiểm tra quyền sở hữu
        checkOwnership(existing.getHotel(), authentication);

        existing.setName(details.getName());
        existing.setDescription(details.getDescription());
        existing.setBasePrice(details.getBasePrice());
        existing.setCapacity(details.getCapacity());
        existing.setBreakfastIncluded(details.getBreakfastIncluded());
        existing.setRefundPolicy(details.getRefundPolicy());
        existing.setTotalRooms(details.getTotalRooms());

        return roomTypeRepository.save(existing);
    }

    /**
     * Xóa loại phòng theo ID.
     * CascadeType.ALL + orphanRemoval=true trên entity sẽ tự động xóa các Room con.
     */
    @Transactional
    public void deleteRoomType(Long id) {
        roomTypeRepository.deleteById(id);
    }

    /**
     * Kiểm tra quyền: nếu là HOTEL_OWNER, hotel phải thuộc về họ.
     */
    private void checkOwnership(Hotel hotel, Authentication authentication) {
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            if (hotel == null || hotel.getOwner() == null || !hotel.getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền thao tác với loại phòng này!");
            }
        }
    }
}
