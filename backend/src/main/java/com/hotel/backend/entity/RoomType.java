package com.hotel.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "room_types")
@Data @NoArgsConstructor @AllArgsConstructor
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @JsonIgnoreProperties({"roomTypes", "owner", "amenities", "images", "description", "address", "starRating", "city"})
    private Hotel hotel;

    private String name; // Standard, Deluxe, Suite

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal basePrice;
    private Integer capacity;

    @Column(name = "breakfast_included")
    private Boolean breakfastIncluded = false;

    @Column(name = "refund_policy", columnDefinition = "TEXT")
    private String refundPolicy;

    @Column(name = "total_rooms")
    private Integer totalRooms;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Room> rooms; // Danh sách 101, 201...
}