package com.hotel.backend.controller;

import com.hotel.backend.entity.Room;
import com.hotel.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * GET /api/admin/rooms
     * Lấy danh sách phòng.
     * ADMIN: tất cả. HOTEL_OWNER: chỉ phòng thuộc KS của họ.
     */
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms(Authentication authentication) {
        return ResponseEntity.ok(roomService.getAllRooms(authentication));
    }

    /**
     * POST /api/admin/rooms
     * Thêm phòng mới vào một RoomType cụ thể.
     * Body: { "roomNumber": "101", "roomType": { "id": 1 } }
     */
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room, Authentication authentication) {
        return ResponseEntity.ok(roomService.createRoom(room, authentication));
    }

    /**
     * PATCH /api/admin/rooms/{id}/status
     * Cập nhật trạng thái phòng.
     * Query param: ?status=AVAILABLE | MAINTENANCE | CLEANING
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Long id, @RequestParam String status, Authentication authentication) {
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status, authentication));
    }
}
