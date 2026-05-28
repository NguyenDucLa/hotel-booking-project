package com.hotel.backend.repository;

import com.hotel.backend.entity.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelAmenityRepository extends JpaRepository<HotelAmenity, Long> {
    List<HotelAmenity> findByHotelId(Long hotelId);
    List<HotelAmenity> findByAmenityId(Long amenityId);
}
