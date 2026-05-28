import api from './api';

export const userService = {
    getDashboard: async () => {
        const response = await api.get('/user/dashboard');
        return response.data;
    }
};