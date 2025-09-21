import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/appointment` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const appointmentAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
appointmentAPI.interceptors.request.use(
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
export const appointmentAPIService = {
  // Get all beds with optional status filter
  getAll: async (page = 1, status = null, search = '') => {
    try {
      let url = '/';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (page) params.append('page', page);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await appointmentAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching beds:', error);
      throw error;
    }
  },

  create: async bedData => {
    try {
      const response = await appointmentAPI.post('/', bedData);
      return response.data;
    } catch (error) {
      console.error('Error creating bed:', error);
      throw error;
    }
  },

  update: async (bedId, bedData) => {
    try {
      const response = await appointmentAPI.put(`/${bedId}`, bedData);
      return response.data;
    } catch (error) {
      console.error('Error updating bed:', error);
      throw error;
    }
  },

  delete: async bedId => {
    try {
      const response = await appointmentAPI.delete(`/${bedId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bed:', error);
      throw error;
    }
  },
};

export default appointmentAPIService;
