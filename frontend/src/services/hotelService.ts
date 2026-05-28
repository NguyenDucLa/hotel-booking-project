import api from './api';

export const hotelService = {
    // 1. Lấy tất cả khách sạn
    getAllHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },

    // 2. Lấy 4 khách sạn nổi bật (sao cao nhất)
    getFeaturedHotels: async () => {
        const response = await api.get('/hotels/featured');
        return response.data;
    },

    // 3. Đếm số lượng khách sạn theo từng thành phố (hiện ở trang chủ)
    getCountByCity: async () => {
        const response = await api.get('/hotels/count-by-city');
        return response.data;
    },

    // 4. Tìm kiếm khách sạn theo thành phố
    // Sửa lại hàm tìm kiếm trong hotelService.ts
    getHotelsByKeyword: async (keyword: string) => {
        const response = await api.get(`/hotels/search?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    },

    // 5. Lấy chi tiết khách sạn theo ID
    // Sửa trong hotelService.ts
    getHotelById: async (id: string | number, checkIn?: string, checkOut?: string) => {
        let url = `/hotels/${id}`;
        if (checkIn && checkOut) {
            url += `?checkIn=${checkIn}&checkOut=${checkOut}`;
        }
        const response = await api.get(url);
        return response.data;
    }
};