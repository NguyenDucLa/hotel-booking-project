/*
-- Seed data for Hotel Management System
-- Run this file manually in phpMyAdmin

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

-- Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER'),
(3, 'HOTEL_OWNER');

-- Insert Users
-- Admin user (password: '123' - bcrypt hash)
INSERT INTO users (id, full_name, email, password, phone, role_id, is_active, created_at) VALUES
(1, 'Admin User', 'la@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234567', 1, 1, NOW()),
-- Hotel Owners (for the hotels)
(2, 'Nguyễn Văn A', 'owner1@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234568', 3, 1, NOW()),
(3, 'Trần Thị B', 'owner2@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234569', 3, 1, NOW()),
(4, 'Lê Văn C', 'owner3@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234570', 3, 1, NOW()),
(5, 'Phạm Thị D', 'owner4@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234571', 3, 1, NOW()),
(6, 'Hoàng Văn E', 'owner5@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234572', 3, 1, NOW()),
(7, 'Đỗ Thị F', 'owner6@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234573', 3, 1, NOW()),
(8, 'Vũ Văn G', 'owner7@gmail.com', '$2a$10$E2UPv7arXmp3q6LzVzS19eH.mNlWv9Gba6Tj.w9GZ6BEnLpWcZ7S.', '0901234574', 3, 1, NOW());

-- Insert Amenities
INSERT INTO amenities (id, name, icon) VALUES
(1, 'WiFi', 'wifi'),
(2, 'Hồ bơi', 'pool'),
(3, 'Nhà hàng', 'restaurant'),
(4, 'Bãi đỗ xe', 'parking');

-- Insert Hotels (25 hotels distributed across 4 cities)
-- TP. Hồ Chí Minh (7 hotels)
INSERT INTO hotels (id, name, address, city, description, star_rating, owner_id) VALUES
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

-- Insert Hotel Amenities (all hotels have all 4 amenities)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES
-- Hotel 1-7 (TP. Hồ Chí Minh)
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 3), (3, 4),
(4, 1), (4, 2), (4, 3), (4, 4),
(5, 1), (5, 2), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 3), (6, 4),
(7, 1), (7, 2), (7, 3), (7, 4),
-- Hotel 8-14 (Hà Nội)
(8, 1), (8, 2), (8, 3), (8, 4),
(9, 1), (9, 2), (9, 3), (9, 4),
(10, 1), (10, 2), (10, 3), (10, 4),
(11, 1), (11, 2), (11, 3), (11, 4),
(12, 1), (12, 2), (12, 3), (12, 4),
(13, 1), (13, 2), (13, 3), (13, 4),
(14, 1), (14, 2), (14, 3), (14, 4),
-- Hotel 15-20 (Đà Nẵng)
(15, 1), (15, 2), (15, 3), (15, 4),
(16, 1), (16, 2), (16, 3), (16, 4),
(17, 1), (17, 2), (17, 3), (17, 4),
(18, 1), (18, 2), (18, 3), (18, 4),
(19, 1), (19, 2), (19, 3), (19, 4),
(20, 1), (20, 2), (20, 3), (20, 4),
-- Hotel 21-25 (Đà Lạt)
(21, 1), (21, 2), (21, 3), (21, 4),
(22, 1), (22, 2), (22, 3), (22, 4),
(23, 1), (23, 2), (23, 3), (23, 4),
(24, 1), (24, 2), (24, 3), (24, 4),
(25, 1), (25, 2), (25, 3), (25, 4);

-- Insert Room Types (2 types per hotel: Standard Room and Suite Room)
-- Hotel 1-7 (TP. Hồ Chí Minh)
INSERT INTO room_types (id, hotel_id, name, base_price, capacity, bed_type, area_sqm) VALUES
(1, 1, 'Standard Room', 1500000.00, 2, 'Double', 30),
(2, 1, 'Suite Room', 3500000.00, 4, 'King', 60),
(3, 2, 'Standard Room', 1600000.00, 2, 'Double', 32),
(4, 2, 'Suite Room', 3800000.00, 4, 'King', 65),
(5, 3, 'Standard Room', 1400000.00, 2, 'Double', 28),
(6, 3, 'Suite Room', 3200000.00, 4, 'King', 55),
(7, 4, 'Standard Room', 1700000.00, 2, 'Double', 35),
(8, 4, 'Suite Room', 4000000.00, 4, 'King', 70),
(9, 5, 'Standard Room', 1200000.00, 2, 'Double', 25),
(10, 5, 'Suite Room', 2800000.00, 4, 'King', 50),
(11, 6, 'Standard Room', 1550000.00, 2, 'Double', 30),
(12, 6, 'Suite Room', 3600000.00, 4, 'King', 60),
(13, 7, 'Standard Room', 900000.00, 2, 'Double', 22),
(14, 7, 'Suite Room', 1800000.00, 4, 'King', 45),
-- Hotel 8-14 (Hà Nội)
(15, 8, 'Standard Room', 1800000.00, 2, 'Double', 32),
(16, 8, 'Suite Room', 4200000.00, 4, 'King', 68),
(17, 9, 'Standard Room', 1900000.00, 2, 'Double', 35),
(18, 9, 'Suite Room', 4500000.00, 4, 'King', 72),
(19, 10, 'Standard Room', 1750000.00, 2, 'Double', 30),
(20, 10, 'Suite Room', 4100000.00, 4, 'King', 65),
(21, 11, 'Standard Room', 1650000.00, 2, 'Double', 28),
(22, 11, 'Suite Room', 3900000.00, 4, 'King', 62),
(23, 12, 'Standard Room', 2000000.00, 2, 'Double', 38),
(24, 12, 'Suite Room', 4800000.00, 4, 'King', 75),
(25, 13, 'Standard Room', 1850000.00, 2, 'Double', 33),
(26, 13, 'Suite Room', 4300000.00, 4, 'King', 70),
(27, 14, 'Standard Room', 1700000.00, 2, 'Double', 30),
(28, 14, 'Suite Room', 4000000.00, 4, 'King', 65),
-- Hotel 15-20 (Đà Nẵng)
(29, 15, 'Standard Room', 2200000.00, 2, 'Double', 35),
(30, 15, 'Suite Room', 5500000.00, 4, 'King', 75),
(31, 16, 'Standard Room', 2000000.00, 2, 'Double', 32),
(32, 16, 'Suite Room', 5000000.00, 4, 'King', 70),
(33, 17, 'Standard Room', 1900000.00, 2, 'Double', 30),
(34, 17, 'Suite Room', 4800000.00, 4, 'King', 68),
(35, 18, 'Standard Room', 2100000.00, 2, 'Double', 33),
(36, 18, 'Suite Room', 5200000.00, 4, 'King', 72),
(37, 19, 'Standard Room', 1950000.00, 2, 'Double', 31),
(38, 19, 'Suite Room', 4900000.00, 4, 'King', 69),
(39, 20, 'Standard Room', 1800000.00, 2, 'Double', 30),
(40, 20, 'Suite Room', 4500000.00, 4, 'King', 65),
-- Hotel 21-25 (Đà Lạt)
(41, 21, 'Standard Room', 1600000.00, 2, 'Double', 28),
(42, 21, 'Suite Room', 3800000.00, 4, 'King', 58),
(43, 22, 'Standard Room', 1500000.00, 2, 'Double', 26),
(44, 22, 'Suite Room', 3600000.00, 4, 'King', 55),
(45, 23, 'Standard Room', 1200000.00, 2, 'Double', 24),
(46, 23, 'Suite Room', 2800000.00, 4, 'King', 48),
(47, 24, 'Standard Room', 800000.00, 2, 'Double', 20),
(48, 24, 'Suite Room', 1500000.00, 4, 'King', 40),
(49, 25, 'Standard Room', 700000.00, 2, 'Double', 18),
(50, 25, 'Suite Room', 1300000.00, 4, 'King', 35);

-- Insert Rooms (3 rooms per room type: 101, 102, 103)
-- Hotel 1-7 (TP. Hồ Chí Minh)
INSERT INTO rooms (id, room_type_id, room_number, floor, status) VALUES
(1, 1, '101', '1', 'AVAILABLE'),
(2, 1, '102', '1', 'AVAILABLE'),
(3, 1, '103', '1', 'AVAILABLE'),
(4, 2, '201', '2', 'AVAILABLE'),
(5, 2, '202', '2', 'AVAILABLE'),
(6, 2, '203', '2', 'AVAILABLE'),
(7, 3, '101', '1', 'AVAILABLE'),
(8, 3, '102', '1', 'AVAILABLE'),
(9, 3, '103', '1', 'AVAILABLE'),
(10, 4, '201', '2', 'AVAILABLE'),
(11, 4, '202', '2', 'AVAILABLE'),
(12, 4, '203', '2', 'AVAILABLE'),
(13, 5, '101', '1', 'AVAILABLE'),
(14, 5, '102', '1', 'AVAILABLE'),
(15, 5, '103', '1', 'AVAILABLE'),
(16, 6, '201', '2', 'AVAILABLE'),
(17, 6, '202', '2', 'AVAILABLE'),
(18, 6, '203', '2', 'AVAILABLE'),
(19, 7, '101', '1', 'AVAILABLE'),
(20, 7, '102', '1', 'AVAILABLE'),
(21, 7, '103', '1', 'AVAILABLE'),
(22, 8, '201', '2', 'AVAILABLE'),
(23, 8, '202', '2', 'AVAILABLE'),
(24, 8, '203', '2', 'AVAILABLE'),
(25, 9, '101', '1', 'AVAILABLE'),
(26, 9, '102', '1', 'AVAILABLE'),
(27, 9, '103', '1', 'AVAILABLE'),
(28, 10, '201', '2', 'AVAILABLE'),
(29, 10, '202', '2', 'AVAILABLE'),
(30, 10, '203', '2', 'AVAILABLE'),
(31, 11, '101', '1', 'AVAILABLE'),
(32, 11, '102', '1', 'AVAILABLE'),
(33, 11, '103', '1', 'AVAILABLE'),
(34, 12, '201', '2', 'AVAILABLE'),
(35, 12, '202', '2', 'AVAILABLE'),
(36, 12, '203', '2', 'AVAILABLE'),
(37, 13, '101', '1', 'AVAILABLE'),
(38, 13, '102', '1', 'AVAILABLE'),
(39, 13, '103', '1', 'AVAILABLE'),
(40, 14, '201', '2', 'AVAILABLE'),
(41, 14, '202', '2', 'AVAILABLE'),
(42, 14, '203', '2', 'AVAILABLE'),
-- Hotel 8-14 (Hà Nội)
(43, 15, '101', '1', 'AVAILABLE'),
(44, 15, '102', '1', 'AVAILABLE'),
(45, 15, '103', '1', 'AVAILABLE'),
(46, 16, '201', '2', 'AVAILABLE'),
(47, 16, '202', '2', 'AVAILABLE'),
(48, 16, '203', '2', 'AVAILABLE'),
(49, 17, '101', '1', 'AVAILABLE'),
(50, 17, '102', '1', 'AVAILABLE'),
(51, 17, '103', '1', 'AVAILABLE'),
(52, 18, '201', '2', 'AVAILABLE'),
(53, 18, '202', '2', 'AVAILABLE'),
(54, 18, '203', '2', 'AVAILABLE'),
(55, 19, '101', '1', 'AVAILABLE'),
(56, 19, '102', '1', 'AVAILABLE'),
(57, 19, '103', '1', 'AVAILABLE'),
(58, 20, '201', '2', 'AVAILABLE'),
(59, 20, '202', '2', 'AVAILABLE'),
(60, 20, '203', '2', 'AVAILABLE'),
(61, 21, '101', '1', 'AVAILABLE'),
(62, 21, '102', '1', 'AVAILABLE'),
(63, 21, '103', '1', 'AVAILABLE'),
(64, 22, '201', '2', 'AVAILABLE'),
(65, 22, '202', '2', 'AVAILABLE'),
(66, 22, '203', '2', 'AVAILABLE'),
(67, 23, '101', '1', 'AVAILABLE'),
(68, 23, '102', '1', 'AVAILABLE'),
(69, 23, '103', '1', 'AVAILABLE'),
(70, 24, '201', '2', 'AVAILABLE'),
(71, 24, '202', '2', 'AVAILABLE'),
(72, 24, '203', '2', 'AVAILABLE'),
(73, 25, '101', '1', 'AVAILABLE'),
(74, 25, '102', '1', 'AVAILABLE'),
(75, 25, '103', '1', 'AVAILABLE'),
(76, 26, '201', '2', 'AVAILABLE'),
(77, 26, '202', '2', 'AVAILABLE'),
(78, 26, '203', '2', 'AVAILABLE'),
(79, 27, '101', '1', 'AVAILABLE'),
(80, 27, '102', '1', 'AVAILABLE'),
(81, 27, '103', '1', 'AVAILABLE'),
(82, 28, '201', '2', 'AVAILABLE'),
(83, 28, '202', '2', 'AVAILABLE'),
(84, 28, '203', '2', 'AVAILABLE'),
-- Hotel 15-20 (Đà Nẵng)
(85, 29, '101', '1', 'AVAILABLE'),
(86, 29, '102', '1', 'AVAILABLE'),
(87, 29, '103', '1', 'AVAILABLE'),
(88, 30, '201', '2', 'AVAILABLE'),
(89, 30, '202', '2', 'AVAILABLE'),
(90, 30, '203', '2', 'AVAILABLE'),
(91, 31, '101', '1', 'AVAILABLE'),
(92, 31, '102', '1', 'AVAILABLE'),
(93, 31, '103', '1', 'AVAILABLE'),
(94, 32, '201', '2', 'AVAILABLE'),
(95, 32, '202', '2', 'AVAILABLE'),
(96, 32, '203', '2', 'AVAILABLE'),
(97, 33, '101', '1', 'AVAILABLE'),
(98, 33, '102', '1', 'AVAILABLE'),
(99, 33, '103', '1', 'AVAILABLE'),
(100, 34, '201', '2', 'AVAILABLE'),
(101, 34, '202', '2', 'AVAILABLE'),
(102, 34, '203', '2', 'AVAILABLE'),
(103, 35, '101', '1', 'AVAILABLE'),
(104, 35, '102', '1', 'AVAILABLE'),
(105, 35, '103', '1', 'AVAILABLE'),
(106, 36, '201', '2', 'AVAILABLE'),
(107, 36, '202', '2', 'AVAILABLE'),
(108, 36, '203', '2', 'AVAILABLE'),
(109, 37, '101', '1', 'AVAILABLE'),
(110, 37, '102', '1', 'AVAILABLE'),
(111, 37, '103', '1', 'AVAILABLE'),
(112, 38, '201', '2', 'AVAILABLE'),
(113, 38, '202', '2', 'AVAILABLE'),
(114, 38, '203', '2', 'AVAILABLE'),
(115, 39, '101', '1', 'AVAILABLE'),
(116, 39, '102', '1', 'AVAILABLE'),
(117, 39, '103', '1', 'AVAILABLE'),
(118, 40, '201', '2', 'AVAILABLE'),
(119, 40, '202', '2', 'AVAILABLE'),
(120, 40, '203', '2', 'AVAILABLE'),
-- Hotel 21-25 (Đà Lạt)
(121, 41, '101', '1', 'AVAILABLE'),
(122, 41, '102', '1', 'AVAILABLE'),
(123, 41, '103', '1', 'AVAILABLE'),
(124, 42, '201', '2', 'AVAILABLE'),
(125, 42, '202', '2', 'AVAILABLE'),
(126, 42, '203', '2', 'AVAILABLE'),
(127, 43, '101', '1', 'AVAILABLE'),
(128, 43, '102', '1', 'AVAILABLE'),
(129, 43, '103', '1', 'AVAILABLE'),
(130, 44, '201', '2', 'AVAILABLE'),
(131, 44, '202', '2', 'AVAILABLE'),
(132, 44, '203', '2', 'AVAILABLE'),
(133, 45, '101', '1', 'AVAILABLE'),
(134, 45, '102', '1', 'AVAILABLE'),
(135, 45, '103', '1', 'AVAILABLE'),
(136, 46, '201', '2', 'AVAILABLE'),
(137, 46, '202', '2', 'AVAILABLE'),
(138, 46, '203', '2', 'AVAILABLE'),
(139, 47, '101', '1', 'AVAILABLE'),
(140, 47, '102', '1', 'AVAILABLE'),
(141, 47, '103', '1', 'AVAILABLE'),
(142, 48, '201', '2', 'AVAILABLE'),
(143, 48, '202', '2', 'AVAILABLE'),
(144, 48, '203', '2', 'AVAILABLE'),
(145, 49, '101', '1', 'AVAILABLE'),
(146, 49, '102', '1', 'AVAILABLE'),
(147, 49, '103', '1', 'AVAILABLE'),
(148, 50, '201', '2', 'AVAILABLE'),
(149, 50, '202', '2', 'AVAILABLE'),
(150, 50, '203', '2', 'AVAILABLE');
