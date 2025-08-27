import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all services from the API
 * @param {string} search - Optional search query
 * @returns {Promise} API response
 */

export const fetchServices = async (search = '', serviceApplicableOn = '') => {
  try {
    const params = {
      all: true,
    };

    // Add search parameter if provided
    if (search && search.trim()) {
      params.search = search.trim();
    }

    if (serviceApplicableOn && serviceApplicableOn.trim()) {
      params.serviceApplicableOn = serviceApplicableOn.trim();
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

export const loadServiceOptions = async (
  search = '',
  page = 1,
  limit = 20,
  serviceApplicableOn = ''
) => {
  const response = await axios.get(`${API_URL}/services/dropdown-list`, {
    params: { search, page, limit, serviceApplicableOn },
  });

  if (response.data?.status && response.data?.data) {
    return response.data;
  }

  return {
    options: response.data?.data,
    hasMore: response?.data?.hasMore,
  };
};

export const loadOPDServiceOptions = async (search = '', page = 1, limit = 20) => {
  const response = await axios.get(`${API_URL}/services/dropdown-list`, {
    params: { search, page, limit, serviceApplicableOn: 'OPD' },
  });

  if (response.data?.status && response.data?.data) {
    return response.data;
  }

  return {
    options: response.data?.data,
    hasMore: response?.data?.hasMore,
  };
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
 * Create a new service
 * @param {Object} serviceData - Service data to create
 * @returns {Promise} API response
 */
export const createService = async serviceData => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData, {
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

/**
 * Update an existing service
 * @param {string} serviceId - Service ID to update
 * @param {Object} serviceData - Updated service data
 * @returns {Promise} API response
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/services/${serviceId}`, serviceData, {
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
export const deleteService = async serviceId => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const getParameterByReportType = async (serviceId, reportType) => {
  try {
    const response = await axios.get(
      `${API_URL}/services/linking/${serviceId}?reportType=${reportType}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching labTests:', error);
    throw error;
  }
};

export const linkParameterToService = async (serviceId, values) => {
  try {
    const response = await axios.put(`${API_URL}/services/linking/${serviceId}`, values, {
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

/**
 * Fetch services with pagination
 * @param {Object} params - Query parameters (page, limit, search, category)
 * @returns {Promise} API response with pagination
 */
export const fetchServicesWithPagination = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/services`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services with pagination:', error);
    throw error;
  }
};
