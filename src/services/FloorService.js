import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/floors` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const floorAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
floorAPI.interceptors.request.use(
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

// floor API
export const floorAPIService = {
  // Get all floors with optional status filter
  getAll: async (status = null, search = '') => {
    try {
      let url = '/';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (search) params.append('search', search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await floorAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching floors:', error);
      throw error;
    }
  },

  create: async floorData => {
    try {
      const response = await floorAPI.post('/', floorData);
      return response.data;
    } catch (error) {
      console.error('Error creating floor:', error);
      throw error;
    }
  },
  update: async (floorId, floorData) => {
    try {
      const response = await floorAPI.put(`/${floorId}`, floorData);
      return response.data;
    } catch (error) {
      console.error('Error updating floor:', error);
      throw error;
    }
  },

  delete: async floorId => {
    try {
      const response = await floorAPI.delete(`/${floorId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting floor:', error);
      throw error;
    }
  },

  loadFloorOptions: async (search = '', page = 1, limit = 20) => {
    const response = await floorAPI.get(`/dropdown-list`, {
      params: { search, page, limit, status: 'active' },
    });

    if (response.data?.status && response.data?.data) {
      return response.data;
    }

    return {
      options: response.data?.data,
      hasMore: response?.data?.hasMore,
    };
  },
};

export default floorAPIService;
