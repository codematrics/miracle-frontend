import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useDoctorAPI = () => {
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

  const fetchDoctors = useCallback(
    async (page = 1, limit = 10, filters = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...filters,
        });

        const response = await fetch(`${API_URL}/doctors?${params}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success) {
          return {
            data: result.data || [],
            pagination: result.pagination || {
              currentPage: 1,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
            total: result.total || 0,
          };
        } else {
          toast.error(result.message || 'Failed to fetch doctors');
          return {
            data: [],
            pagination: { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false },
            total: 0,
          };
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to fetch doctors');
        return {
          data: [],
          pagination: { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false },
          total: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const createDoctor = useCallback(
    async doctorData => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/doctors`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(doctorData),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(result.message || 'Doctor created successfully');
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || 'Failed to create doctor');
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error creating doctor:', error);
        toast.error('Failed to create doctor');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const updateDoctor = useCallback(
    async (doctorId, doctorData) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(doctorData),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(result.message || 'Doctor updated successfully');
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || 'Failed to update doctor');
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error updating doctor:', error);
        toast.error('Failed to update doctor');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const deleteDoctor = useCallback(
    async doctorId => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(result.message || 'Doctor deleted successfully');
          return { success: true };
        } else {
          toast.error(result.message || 'Failed to delete doctor');
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error('Failed to delete doctor');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const getDoctorById = useCallback(
    async doctorId => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success) {
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || 'Failed to fetch doctor details');
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        toast.error('Failed to fetch doctor details');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  const getDoctorsDropdown = useCallback(
    async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        if (filters.specialization) params.append('specialization', filters.specialization);
        if (filters.department) params.append('department', filters.department);
        if (filters.isConsultant !== undefined) params.append('isConsultant', filters.isConsultant.toString());

        const response = await fetch(`${API_URL}/doctors/dropdown?${params}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success) {
          return { success: true, data: result.data || [], total: result.total || 0 };
        } else {
          console.error('Failed to fetch doctors dropdown:', result.message);
          return { success: false, data: [], total: 0 };
        }
      } catch (error) {
        console.error('Error fetching doctors dropdown:', error);
        return { success: false, data: [], total: 0 };
      }
    },
    [getAuthHeaders]
  );

  return {
    loading,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    getDoctorsDropdown,
  };
};

export default useDoctorAPI;
