import axios from 'axios';

const API_URL =
  `${import.meta.env.VITE_API_URL}/collections` || 'http://localhost:3001/api/collections';

/* ---------------- AXIOS INSTANCE ---------------- */
const collectionAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------------- AUTH INTERCEPTOR ---------------- */
collectionAPI.interceptors.request.use(
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
  error => Promise.reject(error)
);

/* ---------------- COLLECTION SERVICE ---------------- */
export const collectionAPIService = {
  /**
   * Doctor-wise OPD + IPD + VISIT collections
   * GET /reports/doctor-collections
   */
  getDoctorCollections: async (fromDate = null, toDate = null) => {
    try {
      const params = new URLSearchParams();

      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const url = `/doctors-collection${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await collectionAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor collections:', error);
      throw error;
    }
  },

  /**
   * All collections summary (OPD + IPD + VISIT)
   * GET /reports/collections/summary
   */
  getAllCollectionsSummary: async (fromDate = null, toDate = null) => {
    try {
      const params = new URLSearchParams();

      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const url = `/all-types${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await collectionAPI.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching collections summary:', error);
      throw error;
    }
  },
};

export default collectionAPIService;
