import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    // Inside your authStore...
login: async (email, password) => {
  set({ loading: true, error: null });
  try {
    // COMMENT OUT OR REMOVE THE ACTUAL API CALL FOR NOW:
    // const response = await axios.post('...', { email, password });
    
    // BYPASS MODE: Create a fake successful login response immediately
    const mockUser = { id: 1, name: "Demo Admin", email: "admin@test.com", role: "ADMIN" };
    const mockToken = "fake-jwt-token-for-demo-purposes";
    
    // Save to localStorage just like your real code does
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Update your store state
    set({ user: mockUser, token: mockToken, isAuthenticated: true, loading: false });
    return true;
  } catch (error) {
    set({ error: "Login failed", loading: false });
    return false;
  }
}
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));

export default useAuthStore;
