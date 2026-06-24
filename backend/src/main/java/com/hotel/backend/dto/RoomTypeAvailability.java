package com.hotel.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeAvailability {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer capacity;
    private Boolean breakfastIncluded;
    private String refundPolicy;
    private Integer totalRooms;
    private Long availableRooms; // Số phòng còn trống (tính động dựa trên ngày)
}
