import axios from 'axios';

import { VISIT_STATUS } from '../constants/enums';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchVisitsWithPagination = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/visits`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services with pagination:', error);
    throw error;
  }
};

export const acceptThePatient = async visitId => {
  try {
    const response = await axios.put(`${API_URL}/visits/${visitId}/status`, {
      status: VISIT_STATUS.ACCEPTED,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services with pagination:', error);
    throw error;
  }
};

export const getPrescriptionPdf = async prescriptionId => {
  const response = await axios.get(`${API_URL}/prescriptions/${prescriptionId}/print`, {
    responseType: 'blob', // PDF file
  });
  return response;
};
