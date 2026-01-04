import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/service-types` || 'http://localhost:3001/api/lab';

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
export const serviceTypeAPIService = {
  // Get all floors with optional status filter
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

      const response = await floorAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching floors:', error);
      throw error;
    }
  },
  loadServiceTypeOptions: async (search = '', prevOptions, { page, serviceHead }) => {
    const response = await axios.get(`${API_URL}/dropdown-list`, {
      params: { search, page, limit: 20, serviceHead },
    });

    if (response.data?.status && response.data?.data) {
      return {
        ...response.data,
        additional: {
          page: search ? 1 : page + 1,
        },
      };
    }

    return {
      options: response.data?.data,
      hasMore: response?.data?.hasMore,
      additional: {
        page: search ? 1 : page + 1,
      },
    };
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

  loadFloorOptions: async (search = '', prevOptions, { page }) => {
    const response = await floorAPI.get(`/dropdown-list`, {
      params: { search, page, limit: 10, status: 'active' },
    });

    if (response.data?.status && response.data?.data) {
      return {
        ...response.data,
        additional: {
          page: search ? 1 : page + 1,
        },
      };
    }

    return {
      options: response.data?.data,
      hasMore: response?.data?.hasMore,
      additional: {
        page: search ? 1 : page + 1,
      },
    };
  },
};

export default serviceTypeAPIService;
