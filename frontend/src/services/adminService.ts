import api from './api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    //api quản lý khách sạn

    getAllHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },
    addHotel: async (data: any) => {
        const response = await api.post('/hotels', data);
        return response.data;
    },
    updateHotel: async (id: number, data: any) => {
        const response = await api.put(`/hotels/${id}`, data);
        return response.data;
    },
    deleteHotel: async (id: number) => {
        await api.delete(`/hotels/${id}`);
    },

    //quản lý đơn đặt phòng admin
    //api quản lý đơn đặt phòng
    getAllBookings: async () => {
        const response = await api.get('/admin/bookings');
        return response.data;
    },

    //api cập nhật trạng thái đơn đặt phòng
    updateBookingStatus: async (id: number, status: string) => {
        const response = await api.patch(`/admin/bookings/${id}/status?status=${status}`);
        return response.data;
    },

    updateBooking: async (id: number, data: any) => {
        const response = await api.put(`/admin/bookings/${id}`, data);
        return response.data;
    },

    //Quản lý người dùng (chỉ ADMIN)
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    updateUserRole: async (id: number, roleName: string) => {
        const response = await api.put(`/admin/users/${id}/role?roleName=${roleName}`);
        return response.data;
    },

    // Quản lý loại phòng (RoomType)
    getAllRoomTypes: async () => {
        const response = await api.get('/admin/room-types');
        return response.data;
    },

    createRoomType: async (data: any) => {
        const response = await api.post('/admin/room-types', data);
        return response.data;
    },

    updateRoomType: async (id: number, data: any) => {
        const response = await api.put(`/admin/room-types/${id}`, data);
        return response.data;
    },

    deleteRoomType: async (id: number) => {
        await api.delete(`/admin/room-types/${id}`);
    },

    // Quản lý phòng (Room)
    getAllRooms: async () => {
        const response = await api.get('/admin/rooms');
        return response.data;
    },

    createRoom: async (data: any) => {
        const response = await api.post('/admin/rooms', data);
        return response.data;
    },

    updateRoomStatus: async (id: number, status: string) => {
        const response = await api.patch(`/admin/rooms/${id}/status?status=${status}`);
        return response.data;
    }
};

