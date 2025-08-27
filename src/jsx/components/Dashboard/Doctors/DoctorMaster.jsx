import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

import debounce from 'lodash.debounce';

import { DOCTOR_DEPARTMENTS, DOCTOR_SPECIALIZATION } from '../../../../constants/enums';
import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import DoctorForm from './components/DoctorForm';
import DoctorTable from './components/DoctorTable';

const DoctorMaster = () => {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    specialization: '',
    isActive: '',
  });

  const { loading, fetchDoctors, createDoctor, updateDoctor, deleteDoctor } = useDoctorAPI();

  const loadDoctors = useCallback(
    async (page = 1) => {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null) params[key] = filters[key];
      });

      const result = await fetchDoctors(page, pagination.limit, params);
      if (result) {
        setDoctors(result.doctors || []);
        setPagination({
          currentPage: result.page || 1,
          totalPages: Math.ceil((result.total || 0) / (result.limit || 10)),
          totalItems: result.total || 0,
          limit: result.limit || 10,
        });
      }
    },
    [filters, fetchDoctors, pagination.limit]
  );

  const debouncedLoadDoctors = useMemo(() => debounce(loadDoctors, 500), [loadDoctors]);

  useEffect(() => {
    debouncedLoadDoctors(1);
    return () => debouncedLoadDoctors.cancel();
  }, [filters, debouncedLoadDoctors]);

  const handlePageChange = page => loadDoctors(page);

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEditDoctor = doctor => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleFormSubmit = async formData => {
    let result;
    if (editingDoctor) {
      result = await updateDoctor(editingDoctor._id, formData);
    } else {
      result = await createDoctor(formData);
    }

    if (result?.success) {
      setShowForm(false);
      setEditingDoctor(null);
      await loadDoctors(pagination.currentPage);
    }
  };

  const handleDeleteDoctor = async doctorId => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      const result = await deleteDoctor(doctorId);
      if (result?.success) await loadDoctors(pagination.currentPage);
    }
  };

  const handleStatusChange = async (doctorId, newStatus) => {
    const result = await updateDoctor(doctorId, { isActive: newStatus });
    if (result?.success) await loadDoctors(pagination.currentPage);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', department: '', specialization: '', isActive: '' });
  };

  return (
    <>
      {/* Header */}
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">Doctor Master</h2>
          <p className="mb-0">Manage hospital doctors and their information</p>
        </div>
        <Button variant="primary" onClick={handleAddDoctor}>
          <i className="las la-plus scale5 me-2"></i> Add New Doctor
        </Button>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by name, email, or mobile"
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
              />
              <InputGroup.Text>
                <i className="las la-search" />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={filters.department}
              onChange={e => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {DOCTOR_DEPARTMENTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <Form.Label>Specialization</Form.Label>
            <Form.Select
              value={filters.specialization}
              onChange={e => handleFilterChange('specialization', e.target.value)}
            >
              <option value="">All Specializations</option>
              {DOCTOR_SPECIALIZATION.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.isActive}
              onChange={e => handleFilterChange('isActive', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <Button variant="outline-secondary" className="w-100" onClick={handleClearFilters}>
            <i className="las la-redo-alt me-2"></i> Clear Filters
          </Button>
        </div>
      </div>

      {/* Doctors Table */}
      <DoctorTable
        doctors={doctors}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
      />

      {/* Doctor Form Modal */}
      <DoctorForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingDoctor(null);
        }}
        onSubmit={handleFormSubmit}
        loading={loading}
        initialData={editingDoctor}
      />
    </>
  );
};

export default DoctorMaster;
