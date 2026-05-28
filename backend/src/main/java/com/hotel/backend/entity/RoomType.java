package com.hotel.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String name; // Phòng Đơn, Phòng Đôi, Phòng Gia Đình
    private BigDecimal basePrice;
    private Integer capacity;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Room> rooms; // Danh sách 101, 201...
}