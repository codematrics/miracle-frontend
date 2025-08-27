// services/PatientsService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchPatients = async (search = '', page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/patients/`, {
      params: { search, page, limit },
    });

    if (response.data?.status && response.data?.data) {
      return {
        success: true,
        data: response.data.data, // array of patients
        total: response.data.data.total,
        page: response.data.data.page,
        limit: response.data.data.limit,
      };
    }

    return { success: false, data: [] };
  } catch (err) {
    console.error('Error fetching patients:', err);
    return { success: false, data: [] };
  }
};

export const loadPatientOptions = async (search = '', page = 1, limit = 20) => {
  const response = await axios.get(`${API_URL}/patients/dropdown-list`, {
    params: { search, page, limit },
  });

  if (response.data?.status && response.data?.data) {
    return response.data;
  }

  return {
    options: response.data?.data,
    hasMore: response?.data?.hasMore,
  };
};
