import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const usersAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
usersAPI.interceptors.request.use(
  config => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const { token } = JSON.parse(userDetails);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Bed API
export const usersAPIService = {
  // Get all beds with optional status filter
  getAll: async (page = 1, role = '', status = null, search = '') => {
    try {
      let url = '/';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (role) params.append('role', role);
      if (search) params.append('search', search);
      if (page) params.append('page', page);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await usersAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching beds:', error);
      throw error;
    }
  },

  create: async userData => {
    try {
      const response = await usersAPI.post('/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating bed:', error);
      throw error;
    }
  },

  update: async (userId, userData) => {
    try {
      const response = await usersAPI.put(`/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating bed:', error);
      throw error;
    }
  },

  delete: async userId => {
    try {
      const response = await usersAPI.delete(`/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bed:', error);
      throw error;
    }
  },
};

export default usersAPIService;
