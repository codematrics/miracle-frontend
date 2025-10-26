import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/opd-billing` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const OPDApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
OPDApi.interceptors.request.use(
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
export const OPDApiService = {
  // Get all beds with optional status filter
  getAll: async (page = 1, status = null, search = '') => {
    try {
      let url = '/';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (page) params.append('page', page);
      if (search) params.append('search', search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await OPDApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching beds:', error);
      throw error;
    }
  },

  create: async opdData => {
    try {
      const response = await OPDApi.post('/', opdData);
      return response.data;
    } catch (error) {
      console.error('Error creating bed:', error);
      throw error;
    }
  },

  update: async (opdId, OPDData) => {
    try {
      const response = await OPDApi.put(`/${opdId}`, OPDData);
      return response.data;
    } catch (error) {
      console.error('Error updating bed:', error);
      throw error;
    }
  },
  getOne: async opdId => {
    try {
      const response = await OPDApi.get(`/${opdId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating bed:', error);
      throw error;
    }
  },
};

export default OPDApiService;
