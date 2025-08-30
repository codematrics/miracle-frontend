import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const usePathologyAPI = () => {
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const userDetails = localStorage.getItem('userDetails');
    const headers = { 'Content-Type': 'application/json' };

    if (userDetails) {
      const { token } = JSON.parse(userDetails);
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, []);

  /** 🔹 Fetch list of lab orders */
  const fetchLabOrders = useCallback(
    async (stage, page = 1, filters = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          headType: 'Pathology',
          page: page.toString(),
          limit: '10',
        });

        Object.keys(filters).forEach(key => {
          if (filters[key]) params.append(key, filters[key]);
        });

        let endpoint = `${API_URL}/lab/orders?${params}`;
        if (stage === 'collection') endpoint = `${API_URL}/lab-test-orders?${params}`;
        if (stage === 'result') endpoint = `${API_URL}/lab-test-orders/collected?${params}`;
        if (stage === 'authorization') endpoint = `${API_URL}/lab-test-orders/saved?${params}`;

        const response = await fetch(endpoint, { headers: getAuthHeaders() });
        const result = await response.json();

        if (result.status) {
          return {
            data: result.data.labTests || [],
            pagination: {
              page: result.data.page || 1,
              limit: result.data.limit || 10,
              total: result.data.total || 0,
              pages: Math.ceil((result.data.total || 0) / (result.data.limit || 10)),
            },
          };
        } else {
          toast.error(result.message || 'Failed to fetch lab orders');
          return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
        }
      } catch (error) {
        console.error('Error fetching lab orders:', error);
        toast.error('Failed to fetch lab orders');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  /** 🔹 Fetch tests inside a specific lab order */
  const fetchOrderTests = useCallback(
    async (orderId, stage) => {
      try {
        const endpoint =
          stage === 'result'
            ? `${API_URL}/lab-test-orders/parameters?labTestOrderId=${orderId}`
            : `${API_URL}/lab-test-orders/parameters-result?labTestOrderId=${orderId}`;
        const response = await fetch(endpoint, { headers: getAuthHeaders() });
        const result = await response.json();

        if (result.status) {
          return result.data;
        } else {
          toast.error(result.message || 'Failed to fetch order details');
          return {};
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details');
        return {};
      }
    },
    [getAuthHeaders]
  );

  const fetchSampleCollection = useCallback(
    async orderId => {
      try {
        const endpoint = `${API_URL}/lab-test-orders/${orderId}/grouped-by-sample`;
        const response = await fetch(endpoint, { headers: getAuthHeaders() });
        const result = await response.json();

        if (result.status) {
          return result.data || { samples: [] };
        } else {
          toast.error(result.message || 'Failed to fetch order details');
          return { samples: [] };
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details');
        return { samples: [] };
      }
    },
    [getAuthHeaders]
  );

  /** 🔹 Collect samples */
  const collectTests = useCallback(
    async (sampleTypes, labOrderID) => {
      try {
        const response = await fetch(`${API_URL}/lab-test-orders/collect`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ sampleTypes: sampleTypes, labTestOrderId: labOrderID }),
        });

        const result = await response.json();
        if (result.status) {
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
    },
    [getAuthHeaders]
  );

  /** 🔹 Save test results */
  const saveResults = useCallback(
    async (orderId, testId, parameters) => {
      try {
        const response = await fetch(`${API_URL}/lab/entry/save`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            orderId,
            labOrderTestId: testId,
            results: parameters.filter(param => param?.value),
          }),
        });

        const result = await response.json();
        if (result.status) {
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
    },
    [getAuthHeaders]
  );

  /** 🔹 Authorize final order */
  const authorizeOrder = useCallback(
    async (orderId, testId, parameters) => {
      try {
        const response = await fetch(`${API_URL}/lab/authorization/update-and-authorize`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            orderId,
            labOrderTestId: testId,
            results: parameters.filter(param => param?.value),
          }),
        });

        const result = await response.json();
        if (result.status) {
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
    },
    [getAuthHeaders]
  );

  return {
    loading,
    fetchLabOrders,
    fetchOrderTests,
    collectTests,
    saveResults,
    authorizeOrder,
    fetchSampleCollection,
  };
};

export default usePathologyAPI;
