import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const usePathologyAPI = () => {
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const userDetails = localStorage.getItem('userDetails');
    const headers = { 'Content-Type': 'application/json' };
    
    if (userDetails) {
      const { token } = JSON.parse(userDetails);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }, []);

  const fetchLabOrders = useCallback(async (stage, page = 1, filters = {}) => {
    setLoading(true);
    try {
      let endpoint = '';
      const params = new URLSearchParams({
        category: 'pathology',
        page: page.toString(),
        limit: '10',
      });

      // Add filter parameters to the URL
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].toString().trim()) {
          params.append(key, filters[key].toString().trim());
        }
      });

      switch (stage) {
        case 'collection':
          endpoint = `${API_URL}/lab/orders?${params}`;
          break;
        case 'result':
          endpoint = `${API_URL}/lab/entry-orders?${params}`;
          break;
        case 'authorization':
          endpoint = `${API_URL}/lab/authorization?${params}`;
          break;
        default:
          endpoint = `${API_URL}/lab/orders?${params}`;
      }

      const response = await fetch(endpoint, { headers: getAuthHeaders() });
      const result = await response.json();

      if (result.success) {
        return {
          data: result.data || [],
          pagination: result.pagination || { page: 1, limit: 10, total: 0, pages: 1 }
        };
      } else {
        toast.error('Failed to fetch lab orders');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      }
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      toast.error('Failed to fetch lab orders');
      return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchOrderTests = useCallback(async (orderId, stage) => {
    try {
      const params = `?category=pathology`;
      const endpoint = `${API_URL}/lab/orders/${orderId}/details${params}`;

      const response = await fetch(endpoint, { headers: getAuthHeaders() });
      const result = await response.json();

      if (result.success) {
        // Return the data in the expected format - it should have tests array
        return result.data || { tests: [] };
      } else {
        toast.error('Failed to fetch order details');
        return { tests: [] };
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
      return { tests: [] };
    }
  }, [getAuthHeaders]);

  const collectTests = useCallback(async (testIds) => {
    try {
      const response = await fetch(`${API_URL}/lab/reports/bulk-update-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          reportIds: testIds,
          status: 'collected',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Tests collected successfully');
        return true;
      } else {
        toast.error(result.message || 'Failed to collect tests');
        return false;
      }
    } catch (error) {
      console.error('Error collecting tests:', error);
      toast.error('Failed to collect tests');
      return false;
    }
  }, [getAuthHeaders]);

  const saveResults = useCallback(async (orderId, testId, parameters) => {
    try {
      const resultsData = {
        orderId,
        labOrderTestId: testId,
        results: parameters.filter(param => param?.value),
      };

      const response = await fetch(`${API_URL}/lab/entry/save`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resultsData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Results saved successfully');
        return true;
      } else {
        toast.error(result.message || 'Failed to save results');
        return false;
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
      return false;
    }
  }, [getAuthHeaders]);

  const authorizeOrder = useCallback(async (orderId, testId, parameters) => {
    try {
      const resultsData = {
        orderId,
        labOrderTestId: testId,
        results: parameters.filter(param => param?.value),
      };

      const response = await fetch(`${API_URL}/lab/authorization/update-and-authorize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resultsData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order authorized successfully');
        return true;
      } else {
        toast.error(result.message || 'Failed to authorize order');
        return false;
      }
    } catch (error) {
      console.error('Error authorizing order:', error);
      toast.error('Failed to authorize order');
      return false;
    }
  }, [getAuthHeaders]);

  return {
    loading,
    fetchLabOrders,
    fetchOrderTests,
    collectTests,
    saveResults,
    authorizeOrder,
  };
};

export default usePathologyAPI;