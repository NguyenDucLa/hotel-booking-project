package com.hotel.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String status = "AVAILABLE";

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    @JsonIgnore // CHỈ GIỮ LẠI 1 DÒNG NÀY, XÓA DÒNG DƯỚI ĐI
    private RoomType roomType;
}