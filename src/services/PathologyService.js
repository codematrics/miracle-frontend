import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/lab` || 'http://localhost:3001/api/lab';

// Create axios instance with default config
const pathologyApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
pathologyApi.interceptors.request.use(
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

// Lab Orders API
export const labOrdersAPI = {
  // Get all lab orders with optional status filter
  getAll: async (status = null, filters = {}) => {
    try {
      let url = '/lab-orders';
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (filters.fromDate) params.append('from_date', filters.fromDate);
      if (filters.toDate) params.append('to_date', filters.toDate);
      if (filters.patientId) params.append('patient_id', filters.patientId);
      if (filters.accessionNo) params.append('accession_no', filters.accessionNo);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await pathologyApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      throw error;
    }
  },

  // Get single lab order by ID
  getById: async orderId => {
    try {
      const response = await pathologyApi.get(`/lab-orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab order:', error);
      throw error;
    }
  },

  // Mark tests as collected
  collectTests: async (orderId, testIds) => {
    try {
      const response = await pathologyApi.post(`/lab-orders/${orderId}/collect`, {
        test_ids: testIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error collecting tests:', error);
      throw error;
    }
  },

  // Authorize lab order
  authorize: async (orderId, remarks = '') => {
    try {
      const response = await pathologyApi.post(`/lab-orders/${orderId}/authorize`, {
        remarks,
      });
      return response.data;
    } catch (error) {
      console.error('Error authorizing order:', error);
      throw error;
    }
  },

  // Reject lab order
  reject: async (orderId, reason) => {
    try {
      const response = await pathologyApi.post(`/lab-orders/${orderId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting order:', error);
      throw error;
    }
  },
};

// Lab Order Tests API
export const labOrderTestsAPI = {
  // Get tests for a specific order
  getByOrderId: async orderId => {
    try {
      const response = await pathologyApi.get(`/lab-order-tests/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order tests:', error);
      throw error;
    }
  },

  // Update test status
  updateStatus: async (testId, status, remarks = '') => {
    try {
      const response = await pathologyApi.put(`/lab-order-tests/${testId}/status`, {
        status,
        remarks,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating test status:', error);
      throw error;
    }
  },
};

// Test Parameters API
export const testParametersAPI = {
  // Get parameters for a specific test
  getByTestId: async testId => {
    try {
      const response = await pathologyApi.get(`/test-parameters/test/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test parameters:', error);
      throw error;
    }
  },

  // Get parameters master list
  getMaster: async (testType = null) => {
    try {
      let url = '/parameters-master';
      if (testType) {
        url += `?test_type=${testType}`;
      }
      const response = await pathologyApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching parameters master:', error);
      throw error;
    }
  },
};

// Lab Results API
export const labResultsAPI = {
  // Save test results
  save: async resultsData => {
    try {
      const response = await pathologyApi.post('/lab-results', resultsData);
      return response.data;
    } catch (error) {
      console.error('Error saving lab results:', error);
      throw error;
    }
  },

  // Get results for an order
  getByOrderId: async orderId => {
    try {
      const response = await pathologyApi.get(`/lab-results/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }
  },

  // Get results for a specific test
  getByTestId: async testId => {
    try {
      const response = await pathologyApi.get(`/lab-results/test/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  },

  // Update result value
  update: async (resultId, value, remarks = '') => {
    try {
      const response = await pathologyApi.put(`/lab-results/${resultId}`, {
        value,
        remarks,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating lab result:', error);
      throw error;
    }
  },

  // Verify results
  verify: async (orderId, verifiedBy) => {
    try {
      const response = await pathologyApi.post(`/lab-results/verify/${orderId}`, {
        verified_by: verifiedBy,
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying results:', error);
      throw error;
    }
  },
};

// Reports API
export const reportsAPI = {
  // Generate lab report
  generateReport: async (orderId, format = 'pdf') => {
    try {
      const response = await pathologyApi.get(`/reports/lab-order/${orderId}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Get report templates
  getTemplates: async (reportType = null) => {
    try {
      let url = '/reports/templates';
      if (reportType) {
        url += `?type=${reportType}`;
      }
      const response = await pathologyApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  },
};

// Workflow Status Constants
export const WORKFLOW_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
  AUTHORIZED: 'authorized',
  REJECTED: 'rejected',
};

// Test Status Constants
export const TEST_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  SAVED: 'saved',
  AUTHORIZED: 'authorized',
};

// Helper function to get status badge config
export const getStatusConfig = status => {
  const statusConfigs = {
    [WORKFLOW_STATUS.PENDING]: { variant: 'warning', text: 'Pending', color: '#ffc107' },
    [WORKFLOW_STATUS.COLLECTED]: { variant: 'info', text: 'Collected', color: '#17a2b8' },
    [WORKFLOW_STATUS.IN_PROGRESS]: { variant: 'primary', text: 'In Progress', color: '#007bff' },
    [WORKFLOW_STATUS.COMPLETED]: { variant: 'success', text: 'Completed', color: '#28a745' },
    [WORKFLOW_STATUS.VERIFIED]: { variant: 'success', text: 'Verified', color: '#20c997' },
    [WORKFLOW_STATUS.AUTHORIZED]: { variant: 'success', text: 'Authorized', color: '#28a745' },
    [WORKFLOW_STATUS.REJECTED]: { variant: 'danger', text: 'Rejected', color: '#dc3545' },
  };

  return statusConfigs[status] || { variant: 'secondary', text: status, color: '#6c757d' };
};

// Export default service object
const PathologyService = {
  labOrders: labOrdersAPI,
  labOrderTests: labOrderTestsAPI,
  testParameters: testParametersAPI,
  labResults: labResultsAPI,
  reports: reportsAPI,
  constants: {
    WORKFLOW_STATUS,
    TEST_STATUS,
  },
  utils: {
    getStatusConfig,
  },
};

export default PathologyService;
