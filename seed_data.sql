/*
-- Seed data for Hotel Management System
-- Run this file manually in phpMyAdmin or MySQL CLI
-- BƯỚC 1: QUY HOẠCH LẠI DATABASE - PHONG CÁCH TRAVELOKA
-- Mỗi RoomType có total_rooms, rooms được sinh tự động

SET FOREIGN_KEY_CHECKS = 0;

-- Delete all existing data
DELETE FROM booking_details;
DELETE FROM bookings;
DELETE FROM reviews;
DELETE FROM images;
DELETE FROM rooms;
DELETE FROM room_types;
DELETE FROM hotel_amenities;
DELETE FROM hotels;
DELETE FROM promotions;
DELETE FROM amenities;
DELETE FROM users;
DELETE FROM roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. ROLES
-- ============================================================
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER'),
(3, 'HOTEL_OWNER');

-- ============================================================
-- 2. USERS (password: '123' - bcrypt hash)
-- ============================================================
INSERT INTO users (id, full_name, email, password, phone, role_id, is_active, created_at) VALUES
(1, 'Admin User', 'la@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234567', 1, 1, NOW()),
(2, 'Nguyễn Văn A', 'owner1@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234568', 3, 1, NOW()),
(3, 'Trần Thị B', 'owner2@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234569', 3, 1, NOW()),
(4, 'Lê Văn C', 'owner3@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234570', 3, 1, NOW()),
(5, 'Phạm Thị D', 'owner4@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234571', 3, 1, NOW()),
(6, 'Hoàng Văn E', 'owner5@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234572', 3, 1, NOW()),
(7, 'Đỗ Thị F', 'owner6@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234573', 3, 1, NOW()),
(8, 'Vũ Văn G', 'owner7@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234574', 3, 1, NOW());

-- ============================================================
-- 3. AMENITIES
-- ============================================================
INSERT INTO amenities (id, name, icon) VALUES
(1, 'WiFi', 'wifi'),
(2, 'Hồ bơi', 'pool'),
(3, 'Nhà hàng', 'restaurant'),
(4, 'Bãi đỗ xe', 'parking');

-- ============================================================
-- 4. HOTELS (25 hotels distributed across 4 cities)
-- ============================================================
INSERT INTO hotels (id, name, address, city, description, star_rating, owner_id) VALUES
-- TP. Hồ Chí Minh (7 hotels)
(1, 'Sheraton Saigon Hotel & Towers', '88 Đồng Khởi, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn 5 sao sang trọng nằm tại trung tâm Quận 1', 5, 2),
(2, 'Caravelle Saigon', '19-23 Lam Sơn, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn lịch sử với kiến trúc Pháp cổ điển', 5, 2),
(3, 'Rex Hotel', '141 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn nổi tiếng với rooftop bar đẹp nhất Sài Gòn', 5, 3),
(4, 'InterContinental Saigon', '39 Lê Duẩn, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn quốc tế cao cấp với dịch vụ hoàn hảo', 5, 3),
(5, 'Novotel Saigon Centre', '167 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn hiện đại thuận tiện cho công tác và du lịch', 4, 4),
(6, 'Majestic Saigon', '1 Đồng Khởi, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn cổ điển bên bờ sông Sài Gòn', 5, 4),
(7, 'Dong Khanh Hotel', '43-47 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Khách sạn giá cả hợp lý tại trung tâm thành phố', 3, 5),
-- Hà Nội (7 hotels)
(8, 'Sofitel Legend Metropole Hanoi', '15 Nghi Tàm, Quận Hoàn Kiếm, Hà Nội', 'Hà Nội', 'Khách sạn lịch sử 5 sao nổi tiếng nhất Hà Nội', 5, 5),
(9, 'InterContinental Hanoi Westlake', '1A Nghi Tàm, Quận Tây Hồ, Hà Nội', 'Hà Nội', 'Khách sạn sang trọng bên Hồ Tây', 5, 6),
(10, 'Hilton Hanoi Opera', '1 Lê Thánh Tông, Quận Hoàn Kiếm, Hà Nội', 'Hà Nội', 'Khách sạn cao cấp gần Nhà hát Lớn', 5, 6),
(11, 'Sheraton Hanoi Hotel', '11 K5 Nghi Tàm, Quận Tây Hồ, Hà Nội', 'Hà Nội', 'Khách sạn quốc tế với hồ bơi ngoài trời', 5, 7),
(12, 'JW Marriott Hotel Hanoi', '8 Đường Đỗ Đức Dục, Quận Nam Từ Liêm, Hà Nội', 'Hà Nội', 'Khách sạn 5 sao cao cấp gần sân bay', 5, 7),
(13, 'Lotte Hotel Hanoi', '54 Liễu Giai, Quận Ba Đình, Hà Nội', 'Hà Nội', 'Khách sạn Hàn Quốc với kiến trúc hiện đại', 5, 8),
(14, 'Pan Pacific Hanoi', '1 Thanh Niên, Quận Hoàn Kiếm, Hà Nội', 'Hà Nội', 'Khách sạn quốc tế với vị trí đắc địa', 5, 8),
-- Đà Nẵng (6 hotels)
(15, 'InterContinental Danang Sun Peninsula Resort', 'Bãi Bắc, Sơn Trà, Đà Nẵng', 'Đà Nẵng', 'Khu nghỉ dưỡng 6 sao trên bán đảo Sơn Trà', 6, 2),
(16, 'Hyatt Regency Danang Resort & Spa', 'Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', 'Khu nghỉ dưỡng ven biển cao cấp', 5, 3),
(17, 'Furama Resort Danang', 'Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', 'Khu nghỉ dưỡng nổi tiếng nhất Đà Nẵng', 5, 4),
(18, 'Vinpearl Luxury Da Nang', 'Hải Vân, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', 'Khu nghỉ dưỡng sang trọng của Vingroup', 5, 5),
(19, 'Pullman Danang Beach Resort', 'Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', 'Khách sạn ven biển hiện đại', 5, 6),
(20, 'Novotel Danang Premier Han River', '36 Bạch Đằng, Quận Hải Châu, Đà Nẵng', 'Đà Nẵng', 'Khách sạn cao cấp bên sông Hàn', 5, 7),
-- Đà Lạt (5 hotels)
(21, 'Ana Mandara Villas Dalat Resort & Spa', 'Đường Tùng Lâm, Đà Lạt', 'Đà Lạt', 'Khu nghỉ dưỡng biệt thự Pháp cổ điển', 5, 8),
(22, 'Sofitel Dalat Palace', '12 Trần Hưng Đạo, Đà Lạt', 'Đà Lạt', 'Khách sạn lịch sử với kiến trúc Pháp', 5, 2),
(23, 'Dalat Palace Heritage Hotel', '1 Lê Duẩn, Đà Lạt', 'Đà Lạt', 'Khách sạn di sản giữa trung tâm Đà Lạt', 4, 3),
(24, 'Mường Thanh Dalat', '7 Đường 3/4, Đà Lạt', 'Đà Lạt', 'Khách sạn giá cả hợp lý', 3, 4),
(25, 'La Sapinette Hotel', '10 Trần Phú, Đà Lạt', 'Đà Lạt', 'Khách sạn nhỏ xinh với kiến trúc Pháp', 3, 5);

-- ============================================================
-- 5. HOTEL AMENITIES (all hotels have all 4 amenities)
-- ============================================================
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 3), (3, 4),
(4, 1), (4, 2), (4, 3), (4, 4),
(5, 1), (5, 2), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 3), (6, 4),
(7, 1), (7, 2), (7, 3), (7, 4),
(8, 1), (8, 2), (8, 3), (8, 4),
(9, 1), (9, 2), (9, 3), (9, 4),
(10, 1), (10, 2), (10, 3), (10, 4),
(11, 1), (11, 2), (11, 3), (11, 4),
(12, 1), (12, 2), (12, 3), (12, 4),
(13, 1), (13, 2), (13, 3), (13, 4),
(14, 1), (14, 2), (14, 3), (14, 4),
(15, 1), (15, 2), (15, 3), (15, 4),
(16, 1), (16, 2), (16, 3), (16, 4),
(17, 1), (17, 2), (17, 3), (17, 4),
(18, 1), (18, 2), (18, 3), (18, 4),
(19, 1), (19, 2), (19, 3), (19, 4),
(20, 1), (20, 2), (20, 3), (20, 4),
(21, 1), (21, 2), (21, 3), (21, 4),
(22, 1), (22, 2), (22, 3), (22, 4),
(23, 1), (23, 2), (23, 3), (23, 4),
(24, 1), (24, 2), (24, 3), (24, 4),
(25, 1), (25, 2), (25, 3), (25, 4);

-- ============================================================
-- 6. ROOM TYPES (Mỗi khách sạn có 3 loại: Standard, Deluxe, Suite)
--    Với các cột mới: total_rooms, description, breakfast_included, refund_policy
-- ============================================================
INSERT INTO room_types (id, hotel_id, name, base_price, capacity, description, breakfast_included, refund_policy, total_rooms) VALUES
-- Hotel 1: Sheraton Saigon (5 sao)
(1, 1, 'Standard', 1500000, 2, 'Phòng tiêu chuẩn với đầy đủ tiện nghi, phù hợp cho khách đi công tác hoặc du lịch', TRUE, 'Hủy miễn phí trước 24h', 20),
(2, 1, 'Deluxe', 2500000, 3, 'Phòng cao cấp với view thành phố, nội thất sang trọng', TRUE, 'Hủy miễn phí trước 48h', 15),
(3, 1, 'Suite', 3500000, 4, 'Phòng Suite rộng rãi với phòng khách riêng, view toàn cảnh', TRUE, 'Hủy miễn phí trước 72h', 8),
-- Hotel 2: Caravelle Saigon
(4, 2, 'Standard', 1600000, 2, 'Phòng tiêu chuẩn với thiết kế tinh tế, phong cách Pháp', TRUE, 'Hủy miễn phí trước 24h', 20),
(5, 2, 'Deluxe', 2700000, 3, 'Phòng Deluxe sang trọng với ban công riêng', TRUE, 'Hủy miễn phí trước 48h', 15),
(6, 2, 'Suite', 3800000, 4, 'Suite hoàng gia với nội thất cổ điển cao cấp', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 3: Rex Hotel
(7, 3, 'Standard', 1400000, 2, 'Phòng tiêu chuẩn thoải mái, view nội khu', FALSE, 'Hủy miễn phí trước 12h', 25),
(8, 3, 'Deluxe', 2300000, 3, 'Phòng Deluxe với rooftop bar view Sài Gòn', TRUE, 'Hủy miễn phí trước 24h', 12),
(9, 3, 'Suite', 3200000, 4, 'Suite đẳng cấp với sân thượng riêng', TRUE, 'Hủy miễn phí trước 48h', 5),
-- Hotel 4: InterContinental Saigon
(10, 4, 'Standard', 1700000, 2, 'Phòng tiêu chuẩn quốc tế, tiện nghi hiện đại', TRUE, 'Hủy miễn phí trước 24h', 20),
(11, 4, 'Deluxe', 2900000, 3, 'Phòng Deluxe hướng ngoại, view trung tâm', TRUE, 'Hủy miễn phí trước 48h', 14),
(12, 4, 'Suite', 4000000, 4, 'Suite tổng thống với dịch vụ butler riêng', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 5: Novotel Saigon Centre
(13, 5, 'Standard', 1200000, 2, 'Phòng tiêu chuẩn hiện đại, giá cả phải chăng', FALSE, 'Hủy miễn phí trước 12h', 25),
(14, 5, 'Deluxe', 2000000, 3, 'Phòng Deluxe thoáng đãng, view thành phố', TRUE, 'Hủy miễn phí trước 24h', 15),
(15, 5, 'Suite', 2800000, 4, 'Suite gia đình rộng rãi, phù hợp cho 4 người', TRUE, 'Hủy miễn phí trước 48h', 8),
-- Hotel 6: Majestic Saigon
(16, 6, 'Standard', 1550000, 2, 'Phòng cổ điển với view sông Sài Gòn', TRUE, 'Hủy miễn phí trước 24h', 18),
(17, 6, 'Deluxe', 2600000, 3, 'Phòng Deluxe với ban công view sông', TRUE, 'Hủy miễn phí trước 48h', 12),
(18, 6, 'Suite', 3600000, 4, 'Suite cổ điển sang trọng, diện tích lớn', TRUE, 'Hủy miễn phí trước 72h', 5),
-- Hotel 7: Dong Khanh Hotel (3 sao)
(19, 7, 'Standard', 900000, 2, 'Phòng tiêu chuẩn giá rẻ, sạch sẽ, tiện nghi cơ bản', FALSE, 'Không hoàn hủy', 30),
(20, 7, 'Deluxe', 1400000, 3, 'Phòng Deluxe rộng hơn, có cửa sổ', FALSE, 'Hủy miễn phí trước 12h', 15),
-- Hotel 8: Sofitel Legend Metropole Hanoi
(21, 8, 'Standard', 1800000, 2, 'Phòng tiêu chuẩn với kiến trúc Pháp cổ điển', TRUE, 'Hủy miễn phí trước 24h', 18),
(22, 8, 'Deluxe', 3000000, 3, 'Phòng Deluxe hướng vườn, yên tĩnh', TRUE, 'Hủy miễn phí trước 48h', 12),
(23, 8, 'Suite', 4200000, 4, 'Suite huyền thoại với nội thất nguyên bản', TRUE, 'Hủy miễn phí trước 72h', 5),
-- Hotel 9: InterContinental Hanoi Westlake
(24, 9, 'Standard', 1900000, 2, 'Phòng tiêu chuẩn view hồ Tây', TRUE, 'Hủy miễn phí trước 24h', 20),
(25, 9, 'Deluxe', 3200000, 3, 'Phòng Deluxe ban công riêng view hồ', TRUE, 'Hủy miễn phí trước 48h', 14),
(26, 9, 'Suite', 4500000, 4, 'Suite cao cấp view toàn cảnh hồ Tây', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 10: Hilton Hanoi Opera
(27, 10, 'Standard', 1750000, 2, 'Phòng tiêu chuẩn gần Nhà hát Lớn', TRUE, 'Hủy miễn phí trước 24h', 20),
(28, 10, 'Deluxe', 2900000, 3, 'Phòng Deluxe hiện đại, view trung tâm', TRUE, 'Hủy miễn phí trước 48h', 13),
(29, 10, 'Suite', 4100000, 4, 'Suite Opera với nội thất nghệ thuật', TRUE, 'Hủy miễn phí trước 72h', 5),
-- Hotel 11: Sheraton Hanoi Hotel
(30, 11, 'Standard', 1650000, 2, 'Phòng tiêu chuẩn quốc tế', TRUE, 'Hủy miễn phí trước 24h', 22),
(31, 11, 'Deluxe', 2800000, 3, 'Phòng Deluxe với hồ bơi ngoài trời', TRUE, 'Hủy miễn phí trước 48h', 14),
(32, 11, 'Suite', 3900000, 4, 'Suite sang trọng với phòng khách riêng', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 12: JW Marriott Hotel Hanoi
(33, 12, 'Standard', 2000000, 2, 'Phòng tiêu chuẩn đẳng cấp quốc tế', TRUE, 'Hủy miễn phí trước 24h', 25),
(34, 12, 'Deluxe', 3500000, 3, 'Phòng Deluxe rộng rãi, nội thất cao cấp', TRUE, 'Hủy miễn phí trước 48h', 16),
(35, 12, 'Suite', 4800000, 4, 'Suite tổng thống đẳng cấp nhất', TRUE, 'Hủy miễn phí trước 72h', 8),
-- Hotel 13: Lotte Hotel Hanoi
(36, 13, 'Standard', 1850000, 2, 'Phòng tiêu chuẩn phong cách Hàn Quốc', TRUE, 'Hủy miễn phí trước 24h', 20),
(37, 13, 'Deluxe', 3100000, 3, 'Phòng Deluxe hiện đại, view thành phố', TRUE, 'Hủy miễn phí trước 48h', 14),
(38, 13, 'Suite', 4300000, 4, 'Suite Lotte với tầm nhìn panorama', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 14: Pan Pacific Hanoi
(39, 14, 'Standard', 1700000, 2, 'Phòng tiêu chuẩn view hồ Tây', TRUE, 'Hủy miễn phí trước 24h', 20),
(40, 14, 'Deluxe', 2900000, 3, 'Phòng Deluxe với ban công', TRUE, 'Hủy miễn phí trước 48h', 14),
(41, 14, 'Suite', 4000000, 4, 'Suite Pan Pacific đẳng cấp', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 15: InterContinental Danang (6 sao)
(42, 15, 'Standard', 2200000, 2, 'Phòng tiêu chuẩn resort 6 sao', TRUE, 'Hủy miễn phí trước 48h', 20),
(43, 15, 'Deluxe', 3800000, 3, 'Phòng Deluxe view biển tuyệt đẹp', TRUE, 'Hủy miễn phí trước 72h', 12),
(44, 15, 'Suite', 5500000, 4, 'Suite hướng biển với hồ bơi riêng', TRUE, 'Hủy miễn phí trước 7 ngày', 5),
-- Hotel 16: Hyatt Regency Danang
(45, 16, 'Standard', 2000000, 2, 'Phòng tiêu chuẩn resort ven biển', TRUE, 'Hủy miễn phí trước 24h', 22),
(46, 16, 'Deluxe', 3400000, 3, 'Phòng Deluxe view biển trực tiếp', TRUE, 'Hủy miễn phí trước 48h', 14),
(47, 16, 'Suite', 5000000, 4, 'Suite hướng biển rộng rãi', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 17: Furama Resort Danang
(48, 17, 'Standard', 1900000, 2, 'Phòng resort truyền thống', TRUE, 'Hủy miễn phí trước 24h', 22),
(49, 17, 'Deluxe', 3200000, 3, 'Phòng Deluxe hướng vườn nhiệt đới', TRUE, 'Hủy miễn phí trước 48h', 14),
(50, 17, 'Suite', 4800000, 4, 'Suite Furama huyền thoại', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 18: Vinpearl Luxury Da Nang
(51, 18, 'Standard', 2100000, 2, 'Phòng tiêu chuẩn Vinpearl', TRUE, 'Hủy miễn phí trước 24h', 20),
(52, 18, 'Deluxe', 3600000, 3, 'Phòng Deluxe view biển', TRUE, 'Hủy miễn phí trước 48h', 12),
(53, 18, 'Suite', 5200000, 4, 'Suite Vinpearl đẳng cấp', TRUE, 'Hủy miễn phí trước 72h', 5),
-- Hotel 19: Pullman Danang Beach Resort
(54, 19, 'Standard', 1950000, 2, 'Phòng tiêu chuẩn resort hiện đại', TRUE, 'Hủy miễn phí trước 24h', 20),
(55, 19, 'Deluxe', 3300000, 3, 'Phòng Deluxe view biển', TRUE, 'Hủy miễn phí trước 48h', 14),
(56, 19, 'Suite', 4900000, 4, 'Suite Pullman cao cấp', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 20: Novotel Danang Premier
(57, 20, 'Standard', 1800000, 2, 'Phòng tiêu chuẩn view sông Hàn', TRUE, 'Hủy miễn phí trước 24h', 22),
(58, 20, 'Deluxe', 3000000, 3, 'Phòng Deluxe view sông', TRUE, 'Hủy miễn phí trước 48h', 14),
(59, 20, 'Suite', 4500000, 4, 'Suite cao cấp view sông Hàn', TRUE, 'Hủy miễn phí trước 72h', 6),
-- Hotel 21: Ana Mandara Dalat
(60, 21, 'Standard', 1600000, 2, 'Phòng biệt thự Pháp tiêu chuẩn', TRUE, 'Hủy miễn phí trước 24h', 18),
(61, 21, 'Deluxe', 2600000, 3, 'Phòng Deluxe với lò sưởi', TRUE, 'Hủy miễn phí trước 48h', 10),
(62, 21, 'Suite', 3800000, 4, 'Suite biệt thự nguyên căn', TRUE, 'Hủy miễn phí trước 72h', 4),
-- Hotel 22: Sofitel Dalat Palace
(63, 22, 'Standard', 1500000, 2, 'Phòng cổ điển Pháp tiêu chuẩn', TRUE, 'Hủy miễn phí trước 24h', 18),
(64, 22, 'Deluxe', 2500000, 3, 'Phòng Deluxe cổ điển sang trọng', TRUE, 'Hủy miễn phí trước 48h', 10),
(65, 22, 'Suite', 3600000, 4, 'Suite Palace lịch sử', TRUE, 'Hủy miễn phí trước 72h', 4),
-- Hotel 23: Dalat Palace Heritage
(66, 23, 'Standard', 1200000, 2, 'Phòng tiêu chuẩn di sản', FALSE, 'Hủy miễn phí trước 12h', 20),
(67, 23, 'Deluxe', 2000000, 3, 'Phòng Deluxe di sản', TRUE, 'Hủy miễn phí trước 24h', 12),
(68, 23, 'Suite', 2800000, 4, 'Suite di sản rộng rãi', TRUE, 'Hủy miễn phí trước 48h', 5),
-- Hotel 24: Mường Thanh Dalat (3 sao)
(69, 24, 'Standard', 800000, 2, 'Phòng tiêu chuẩn giá rẻ', FALSE, 'Không hoàn hủy', 30),
(70, 24, 'Deluxe', 1200000, 3, 'Phòng Deluxe thoải mái', FALSE, 'Hủy miễn phí trước 12h', 15),
-- Hotel 25: La Sapinette Hotel (3 sao)
(71, 25, 'Standard', 700000, 2, 'Phòng nhỏ xinh kiểu Pháp', FALSE, 'Không hoàn hủy', 25),
(72, 25, 'Deluxe', 1100000, 3, 'Phòng Deluxe ấm cúng', FALSE, 'Hủy miễn phí trước 12h', 12);

-- ============================================================
-- 7. ROOMS (Tự động sinh từ total_rooms của mỗi RoomType)
--    Sử dụng Stored Procedure để tạo số phòng tương ứng
-- ============================================================
DROP PROCEDURE IF EXISTS generate_rooms;
DELIMITER $$
CREATE PROCEDURE generate_rooms()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE rt_id INT;
    DECLARE rt_total INT;
    DECLARE rt_hotel_id INT;
    DECLARE cur CURSOR FOR SELECT id, total_rooms, hotel_id FROM room_types ORDER BY id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    SET @room_global_id = 0;
    
    read_loop: LOOP
        FETCH cur INTO rt_id, rt_total, rt_hotel_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET @counter = 1;
        WHILE @counter <= rt_total DO
            SET @room_global_id = @room_global_id + 1;
            
            -- Tạo số phòng: tầng = (số thứ tự - 1) DIV 10 + 1, số phòng 01-10
            SET @floor_num = (@counter - 1) DIV 10 + 1;
            SET @room_num = LPAD(((@counter - 1) % 10 + 1), 2, '0');
            SET @room_number = CONCAT(@floor_num, @room_num);
            
            INSERT INTO rooms (id, room_type_id, room_number, status) 
            VALUES (@room_global_id, rt_id, @room_number, 'AVAILABLE');
            
            SET @counter = @counter + 1;
        END WHILE;
    END LOOP;
    
    CLOSE cur;
END$$
DELIMITER ;

CALL generate_rooms();
DROP PROCEDURE IF EXISTS generate_rooms;
