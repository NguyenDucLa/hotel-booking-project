import api from './api';

export const bookingService = {
  createBooking: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // lịch sử đặt phòng
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  }
};
