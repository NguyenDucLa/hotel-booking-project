package com.hotel.backend.controller;

import com.hotel.backend.entity.RoomType;
import com.hotel.backend.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/room-types")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    /**
     * GET /api/admin/room-types
     * ADMIN: tất cả loại phòng. HOTEL_OWNER: chỉ loại phòng thuộc KS của họ.
     */
    @GetMapping
    public ResponseEntity<List<RoomType>> getAllRoomTypes(Authentication authentication) {
        return ResponseEntity.ok(roomTypeService.getAllRoomTypes(authentication));
    }

    /**
     * POST /api/admin/room-types
     * Thêm loại phòng mới. Owner chỉ được thêm vào KS của mình.
     */
    @PostMapping
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType, Authentication authentication) {
        return ResponseEntity.ok(roomTypeService.createRoomType(roomType, authentication));
    }

    /**
     * PUT /api/admin/room-types/{id}
     * Sửa thông tin loại phòng.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RoomType> updateRoomType(@PathVariable Long id, @RequestBody RoomType details, Authentication authentication) {
        return ResponseEntity.ok(roomTypeService.updateRoomType(id, details, authentication));
    }

    /**
     * DELETE /api/admin/room-types/{id}
     * Xóa loại phòng.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }
}
