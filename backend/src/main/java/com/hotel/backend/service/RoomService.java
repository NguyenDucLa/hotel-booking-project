package com.hotel.backend.service;

import com.hotel.backend.entity.Hotel;
import com.hotel.backend.entity.Room;
import com.hotel.backend.entity.RoomType;
import com.hotel.backend.repository.HotelRepository;
import com.hotel.backend.repository.RoomRepository;
import com.hotel.backend.repository.RoomTypeRepository;
import com.hotel.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

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
     * Lấy danh sách phòng.
     * ADMIN: tất cả. HOTEL_OWNER: chỉ phòng thuộc KS của họ.
     */
    public List<Room> getAllRooms(Authentication authentication) {
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            List<Hotel> ownedHotels = hotelRepository.findByOwnerId(ownerId);
            if (ownedHotels.isEmpty()) return List.of();

            List<Room> result = new ArrayList<>();
            for (Hotel hotel : ownedHotels) {
                for (RoomType rt : hotel.getRoomTypes()) {
                    result.addAll(rt.getRooms());
                }
            }
            return result;
        }
        return roomRepository.findAll();
    }

    /**
     * Thêm phòng mới vào một RoomType cụ thể.
     * HOTEL_OWNER: chỉ thêm được vào RoomType thuộc KS của mình.
     */
    public Room createRoom(Room room, Authentication authentication) {
        // Kiểm tra RoomType tồn tại
        RoomType roomType = roomTypeRepository.findById(room.getRoomType().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng ID: " + room.getRoomType().getId()));

        // Kiểm tra quyền sở hữu
        checkOwnership(roomType.getHotel(), authentication);

        room.setStatus("AVAILABLE");
        return roomRepository.save(room);
    }

    /**
     * Cập nhật trạng thái phòng.
     * HOTEL_OWNER: chỉ sửa được phòng thuộc KS của mình.
     */
    public Room updateRoomStatus(Long id, String status, Authentication authentication) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ID: " + id));

        // Kiểm tra quyền sở hữu thông qua RoomType -> Hotel
        checkOwnership(room.getRoomType().getHotel(), authentication);

        room.setStatus(status);
        return roomRepository.save(room);
    }

    private void checkOwnership(Hotel hotel, Authentication authentication) {
        if (authentication != null && "HOTEL_OWNER".equals(getRoleFromAuth(authentication))) {
            Long ownerId = getUserIdFromAuth(authentication);
            if (hotel == null || hotel.getOwner() == null || !hotel.getOwner().getId().equals(ownerId)) {
                throw new RuntimeException("Bạn không có quyền thao tác với phòng này!");
            }
        }
    }
}
