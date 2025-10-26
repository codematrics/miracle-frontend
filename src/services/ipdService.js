import { toast } from 'react-toastify';

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/ipd-billing` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const IPDApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
IPDApi.interceptors.request.use(
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
export const IPDApiService = {
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

      const response = await IPDApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching beds:', error);
      throw error;
    }
  },

  create: async bedData => {
    try {
      const response = await IPDApi.post('/', bedData);
      return response.data;
    } catch (error) {
      console.error('Error creating bed:', error);
      throw error;
    }
  },

  update: async (ipdId, IPDData) => {
    try {
      const response = await IPDApi.put(`/${ipdId}`, IPDData);
      return response.data;
    } catch (error) {
      console.error('Error updating bed:', error);
      throw error;
    }
  },

  print: async ipdId => {
    try {
      const response = await IPDApi.get(`/export/${ipdId}`, {
        responseType: 'blob', // <-- important
      });

      // response.data is already a Blob
      const blob = response.data;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${ipdId}-bill.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`IPD bill downloaded successfully`);
    } catch (error) {
      console.error('Error printing IPD bill:', error);
      toast.error('Failed to download IPD bill');
      throw error;
    }
  },
};

export default IPDApiService;
