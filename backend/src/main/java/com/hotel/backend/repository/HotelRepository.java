package com.hotel.backend.repository;

import com.hotel.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCity(String city);
    List<Hotel> findByOwnerId(Long ownerId);

    @Query("SELECT h FROM Hotel h ORDER BY h.starRating DESC")
    List<Hotel> findTop4ByOrderByStarRatingDesc();

    @Query("SELECT h.city, COUNT(h) as count FROM Hotel h GROUP BY h.city")
    List<Object[]> countHotelsByCity();

    // Tìm kiếm không phân biệt hoa thường theo Tên hoặc Thành phố
    List<Hotel> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(String name, String city);
}
