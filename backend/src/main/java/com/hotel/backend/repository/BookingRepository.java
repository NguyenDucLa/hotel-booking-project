package com.hotel.backend.repository;

import com.hotel.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Tìm các đơn đặt của 1 User
    List<Booking> findByUserId(Long userId);

    // Tìm các đơn đặt của 1 Khách sạn
    List<Booking> findByHotelId(Long hotelId);

    /**
     * Logic Tìm phòng đã bị đặt:
     * Một phòng được coi là 'Bận' nếu có bất kỳ đơn đặt nào (không phải bị Hủy)
     * mà khoảng thời gian của nó giao thoa với khoảng thời gian khách đang chọn.
     * Công thức giao thoa: (Ngày bắt đầu cũ < Ngày kết thúc mới) VÀ (Ngày kết thúc cũ > Ngày bắt đầu mới)
     */
    @Query("SELECT bd.room.id FROM BookingDetail bd " +
           "WHERE bd.booking.status <> 'CANCELLED' " +
           "AND bd.booking.checkInDate < :checkOut " +
           "AND bd.booking.checkOutDate > :checkIn")
    List<Long> findOccupiedRoomIds(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}