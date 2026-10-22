import api from './client';

export const authApi = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout');
    } catch {
      // Stateless logout fallback
      return { success: true };
    }
  },

  getProfile: async (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    return api.get(`/auth/profile${query}`);
  },

  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  }
};

export default authApi;
