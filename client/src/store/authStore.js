import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            // Save to local storage so the user stays logged in after a refresh
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({ user, token, isAuthenticated: true, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials'
            };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));

export default useAuthStore;