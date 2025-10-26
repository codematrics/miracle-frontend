import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/wards` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const wardAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
wardAPI.interceptors.request.use(
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

// ward API
export const wardAPIService = {
  // Get all wards with optional status filter
  getAll: async (status = null, search = '') => {
    try {
      let url = '/';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (search) params.append('search', search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await wardAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  },

  create: async wardData => {
    try {
      const response = await wardAPI.post('/', wardData);
      return response.data;
    } catch (error) {
      console.error('Error creating ward:', error);
      throw error;
    }
  },
  update: async (wardId, wardData) => {
    try {
      const response = await wardAPI.put(`/${wardId}`, wardData);
      return response.data;
    } catch (error) {
      console.error('Error updating ward:', error);
      throw error;
    }
  },

  delete: async wardId => {
    try {
      const response = await wardAPI.delete(`/${wardId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ward:', error);
      throw error;
    }
  },

  loadWardOptions: async (search = '', prevOptions, additional = {}) => {
    const page = additional?.page || 1;
    const limit = additional?.limit || 20;
    const floorId = additional?.floor; // 👈 dependent key from PaginatedSelect

    const params = {
      search,
      page,
      limit,
      status: 'active',
      ...(floorId ? { floorId } : {}), // include floorId if provided
    };

    const response = await wardAPI.get(`/dropdown-list`, { params });

    if (response.data?.data) {
      return {
        options: response.data?.data,
        hasMore: response.data.hasMore || false,
      };
    }

    return {
      options: [],
      hasMore: false,
    };
  },
};

export default wardAPIService;
