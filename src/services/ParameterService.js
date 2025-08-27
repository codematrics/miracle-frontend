import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all services from the API
 * @param {string} search - Optional search query
 * @returns {Promise} API response
 */
export const fetchServices = async (search = '') => {
  try {
    const params = {
      all: true,
    };

    // Add search parameter if provided
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const response = await axios.get(`${API_URL}/services`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Transform services data for react-select component
 * @param {Array} services - Services array from API
 * @returns {Array} Transformed services for react-select
 */
export const transformServicesForSelect = services => {
  return services.map(service => ({
    id: service.id || service._id,
    value: service.id || service._id,
    label: service.name || service.serviceName || service.label,
    code: service.code || service.serviceCode,
    rate: service.rate || service.price || 0,
    description: service.description || '',
    category: service.category || '',
  }));
};

/**
 * Search services with debounced API call
 * @param {string} search - Search query
 * @returns {Promise} API response with filtered services
 */
export const searchServices = async search => {
  try {
    if (!search || search.trim().length < 2) {
      // Return all services if search is too short
      return await fetchServices();
    }

    return await fetchServices(search);
  } catch (error) {
    console.error('Error searching services:', error);
    throw error;
  }
};

/**
 * Get service by ID
 * @param {string} serviceId - Service ID
 * @returns {Promise} API response
 */
export const getServiceById = async serviceId => {
  try {
    const response = await axios.get(`${API_URL}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
};

/**
 * Create a new parameter
 * @param {Object} parameterData - Parameter data to create
 * @returns {Promise} API response
 */
export const createLabParameter = async parameterData => {
  try {
    const response = await axios.post(`${API_URL}/lab-parameters`, parameterData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating parameter:', error);
    throw error;
  }
};

/**
 * Update an existing parameter
 * @param {string} parameterId - Parameter ID to update
 * @param {Object} parameterData - Updated parameter data
 * @returns {Promise} API response
 */
export const updateLabParameter = async (parameterId, parameterData) => {
  try {
    const response = await axios.put(`${API_URL}/lab-parameters/${parameterId}`, parameterData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating parameter:', error);
    throw error;
  }
};

/**
 * Delete a parameter
 * @param {string} parameterId - Parameter ID to delete
 * @returns {Promise} API response
 */
export const deleteParameter = async parameterId => {
  try {
    const response = await axios.delete(`${API_URL}/parameters/${parameterId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting parameter:', error);
    throw error;
  }
};

/**
 * Fetch parameters with pagination
 * @param {Object} params - Query parameters (page, limit, search, category)
 * @returns {Promise} API response with pagination
 */
export const fetchParametersWithPagination = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/lab-parameters`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching parameters with pagination:', error);
    throw error;
  }
};
