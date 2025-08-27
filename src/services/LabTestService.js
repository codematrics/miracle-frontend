import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all labTests from the API
 * @param {string} search - Optional search query
 * @returns {Promise} API response
 */
export const fetchLabTests = async (search = '') => {
  try {
    const params = {
      all: true,
    };

    // Add search parameter if provided
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const response = await axios.get(`${API_URL}/lab-tests`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching labTests:', error);
    throw error;
  }
};

export const getServicesWithLabTest = async testId => {
  try {
    const response = await axios.get(`${API_URL}/lab-tests/linking/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching labTests:', error);
    throw error;
  }
};

/**
 * Transform labTests data for react-select component
 * @param {Array} labTests - labTests array from API
 * @returns {Array} Transformed labTests for react-select
 */
export const transformLabTestsForSelect = labTests => {
  return labTests.map(service => ({
    id: service.id || service._id,
    serviceId: service.id || service._id,
    value: service.id || service._id,
    label: service.name || service.serviceName || service.label,
    code: service.code || service.serviceCode,
    rate: service.rate || service.price || 0,
    description: service.description || '',
    category: service.category || '',
  }));
};

/**
 * Search labTests with debounced API call
 * @param {string} search - Search query
 * @returns {Promise} API response with filtered labTests
 */
export const searchLabTests = async search => {
  try {
    if (!search || search.trim().length < 2) {
      // Return all labTests if search is too short
      return await fetchLabTests();
    }

    return await fetchLabTests(search);
  } catch (error) {
    console.error('Error searching labTests:', error);
    throw error;
  }
};

/**
 * Get service by ID
 * @param {string} serviceId - Service ID
 * @returns {Promise} API response
 */
export const getLabTestById = async serviceId => {
  try {
    const response = await axios.get(`${API_URL}/lab-tests/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
};

/**
 * Create a new service
 * @param {Object} serviceData - Service data to create
 * @returns {Promise} API response
 */
export const createLabTest = async serviceData => {
  try {
    const response = await axios.post(`${API_URL}/lab-tests`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const linkServicesToLabTest = async (testId, serviceIds) => {
  try {
    const response = await axios.put(
      `${API_URL}/lab-tests/linking/${testId}`,
      { serviceIds },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update an existing service
 * @param {string} serviceId - Service ID to update
 * @param {Object} serviceData - Updated service data
 * @returns {Promise} API response
 */
export const updateLabTest = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/lab-tests/${serviceId}`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Delete a service
 * @param {string} serviceId - Service ID to delete
 * @returns {Promise} API response
 */
export const deleteLabTest = async serviceId => {
  try {
    const response = await axios.delete(`${API_URL}/lab-tests/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

/**
 * Fetch labTests with pagination
 * @param {Object} params - Query parameters (page, limit, search, category)
 * @returns {Promise} API response with pagination
 */
export const fetchLabTestsWithPagination = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/lab-tests`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching labTests with pagination:', error);
    throw error;
  }
};
