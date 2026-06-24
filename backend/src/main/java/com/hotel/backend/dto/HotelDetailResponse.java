package com.hotel.backend.dto;

import com.hotel.backend.entity.Hotel;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelDetailResponse {
    private Hotel hotel;
    private List<RoomTypeAvailability> roomTypes;
}
