import { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import DoctorForm from './components/DoctorForm';
import DoctorTable from './components/DoctorTable';

const DoctorMaster = () => {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    specialization: '',
    isActive: '',
  });

  const { loading, fetchDoctors, createDoctor, updateDoctor, deleteDoctor } = useDoctorAPI();

  const loadDoctors = async (page = currentPage) => {
    const filterParams = {};
    if (filters.search) filterParams.search = filters.search;
    if (filters.department) filterParams.department = filters.department;
    if (filters.specialization) filterParams.specialization = filters.specialization;
    if (filters.isActive !== '') filterParams.isActive = filters.isActive;

    const result = await fetchDoctors(page, 10, filterParams);
    setDoctors(result.data);
    setPagination(result.pagination);
    setTotal(result.total);
    setCurrentPage(page);
  };

  useEffect(() => {
    loadDoctors(1);
  }, [filters]);

  const handlePageChange = page => {
    loadDoctors(page);
  };

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
      result = await updateDoctor(editingDoctor.id, formData);
    } else {
      result = await createDoctor(formData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingDoctor(null);
      await loadDoctors(currentPage);
    }
  };

  const handleDeleteDoctor = async doctorId => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      const result = await deleteDoctor(doctorId);
      if (result.success) {
        await loadDoctors(currentPage);
      }
    }
  };

  const handleStatusChange = async (doctorId, newStatus) => {
    const result = await updateDoctor(doctorId, { isActive: newStatus });
    if (result.success) {
      await loadDoctors(currentPage);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      specialization: '',
      isActive: '',
    });
  };

  const departments = [
    'Medicine',
    'Surgery',
    'Pediatrics',
    'Gynecology',
    'Orthopedics',
    'Cardiology',
    'Neurology',
    'Radiology',
    'Pathology',
    'Emergency',
  ];

  const specializations = [
    'General Medicine',
    'General Surgery',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Gynecology',
    'Pediatrics',
    'Radiology',
    'Pathology',
    'Emergency Medicine',
    'Anesthesiology',
    'Dermatology',
  ];

  return (
    <>
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">Doctor Master</h2>
          <p className="mb-0">Manage hospital doctors and their information</p>
        </div>
        <div>
          <Button className="me-2" variant="primary" onClick={handleAddDoctor}>
            <i className="las la-plus scale5 me-2"></i>
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card mb-0">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black font-w500">Search</label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, email, or mobile"
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                      />
                      <InputGroup.Text>
                        <i className="las la-search"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black font-w500">Department</label>
                    <Form.Select
                      value={filters.department}
                      onChange={e => handleFilterChange('department', e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black font-w500">Specialization</label>
                    <Form.Select
                      value={filters.specialization}
                      onChange={e => handleFilterChange('specialization', e.target.value)}
                    >
                      <option value="">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black font-w500">Status</label>
                    <Form.Select
                      value={filters.isActive}
                      onChange={e => handleFilterChange('isActive', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-group w-100">
                    <Button
                      variant="outline-secondary"
                      onClick={handleClearFilters}
                      className="w-100"
                    >
                      <i className="las la-redo-alt me-2"></i>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {/* <div className="row mb-4">
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="widget-stat card bg-primary">
            <div className="card-body p-4">
              <div className="media">
                <span className="me-3">
                  <i className="las la-user-md"></i>
                </span>
                <div className="media-body text-white">
                  <p className="mb-1">Total Doctors</p>
                  <h3 className="text-white">{total}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="widget-stat card bg-success">
            <div className="card-body p-4">
              <div className="media">
                <span className="me-3">
                  <i className="las la-check-circle"></i>
                </span>
                <div className="media-body text-white">
                  <p className="mb-1">Active Doctors</p>
                  <h3 className="text-white">{doctors.filter(d => d.isActive).length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="widget-stat card bg-info">
            <div className="card-body p-4">
              <div className="media">
                <span className="me-3">
                  <i className="las la-stethoscope"></i>
                </span>
                <div className="media-body text-white">
                  <p className="mb-1">Consultants</p>
                  <h3 className="text-white">{doctors.filter(d => d.isConsultant).length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="widget-stat card bg-warning">
            <div className="card-body p-4">
              <div className="media">
                <span className="me-3">
                  <i className="las la-building"></i>
                </span>
                <div className="media-body text-white">
                  <p className="mb-1">Departments</p>
                  <h3 className="text-white">{new Set(doctors.map(d => d.department)).size}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Doctors Table */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <DoctorTable
                doctors={doctors}
                loading={loading}
                pagination={pagination}
                currentPage={currentPage}
                onEdit={handleEditDoctor}
                onDelete={handleDeleteDoctor}
                onStatusChange={handleStatusChange}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

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
