import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Dropdown, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Swal from 'sweetalert2';

import { FORMAT_TYPE, REPORT_TYPE, SAMPLE_TYPE } from '../../../../constants/enums';
import {
  deleteParameter,
  fetchParametersWithPagination,
} from '../../../../services/ParameterService';
import ParameterModal from './ParameterModal';

const ParametersPage = () => {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    reportType: '',
    formatType: '',
    sampleType: '',
  });

  // ✅ Fetch parameters with pagination & filters
  const loadParameters = useCallback(
    async (page = 1, resetData = false) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...filters,
        };

        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const response = await fetchParametersWithPagination(params);

        if (response.status) {
          const parametersData = response.data?.parameters || [];
          const totalItems = response.data?.total || 0;
          const currentPage = response.data?.page || 1;
          const limit = response.data?.limit || pagination.itemsPerPage;

          setParameters(prev =>
            resetData || page === 1 ? parametersData : [...prev, ...parametersData]
          );

          setPagination({
            currentPage,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
          });
        } else {
          throw new Error(response.message || 'Failed to load services');
        }
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.itemsPerPage]
  );

  // ✅ Handle filters
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleParameterSaved = () => {
    loadParameters(1, true);
    setSelectedParameter(null);
  };

  const handleDeleteParameter = async param => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete parameter "${param.parameterName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteParameter(param._id);
        if (response.success) {
          Swal.fire('Deleted!', response.message || 'Parameter deleted successfully.', 'success');
          loadParameters(1, true);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire('Error', error.message || 'Failed to delete parameter.', 'error');
      }
    }
  };
  const getStatusVariant = isActive => (isActive ? 'success' : 'secondary');

  const handleEditParameter = param => {
    setSelectedParameter(param);
    setShowModal(true);
  };

  const handleAddParameter = () => {
    setSelectedParameter(null);
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      reportType: '',
      formatType: '',
      sampleType: '',
    });
  };

  // ✅ Auto reload on filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadParameters(1, true);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center p-0">
          <div>
            <h4 className="card-title mb-0">Parameters Management</h4>
            <small className="text-muted">Manage pathology/lab parameters</small>
          </div>
          <Button variant="primary" onClick={handleAddParameter}>
            <i className="fas fa-plus me-2"></i> Add Parameter
          </Button>
        </Card.Header>

        <Card.Body className="px-0">
          {/* ✅ Filters */}
          <Row className="mb-4 px-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search parameters..."
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={2}>
              <Button variant="outline-secondary" className="w-100" onClick={handleClearFilters}>
                <i className="las la-redo-alt me-2"></i> Clear Filters
              </Button>
            </Col>
          </Row>
          <Row className="mb-4 px-3">
            <Col md={3}>
              <Form.Select
                value={filters.reportType}
                onChange={e => handleFilterChange('reportType', e.target.value)}
              >
                <option value="">All report Type</option>
                {Object.keys(REPORT_TYPE).map(key => (
                  <option key={REPORT_TYPE[key]} value={REPORT_TYPE[key]}>
                    {REPORT_TYPE[key]}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.sampleType}
                onChange={e => handleFilterChange('sampleType', e.target.value)}
              >
                <option value="">All Sample Type</option>
                {Object.keys(SAMPLE_TYPE).map(key => (
                  <option key={SAMPLE_TYPE[key]} value={SAMPLE_TYPE[key]}>
                    {SAMPLE_TYPE[key]}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.formatType}
                onChange={e => handleFilterChange('formatType', e.target.value)}
              >
                <option value="">All Format Type</option>
                {Object.keys(FORMAT_TYPE).map(key => (
                  <option key={FORMAT_TYPE[key]} value={FORMAT_TYPE[key]}>
                    {FORMAT_TYPE[key]}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>

          {/* ✅ Parameters Table */}
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Report Type</th>
                  <th>Sample Type</th>
                  <th>Format Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && parameters.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : parameters.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <h6>No parameters found</h6>
                    </td>
                  </tr>
                ) : (
                  parameters.map((param, index) => (
                    <tr key={param._id}>
                      {/* ✅ Fix index calculation */}
                      <td>
                        #{(pagination.currentPage - 1) * pagination.itemsPerPage + (index + 1)}
                      </td>
                      <td>
                        <strong>{param.parameterName}</strong>
                      </td>
                      <td>
                        <code>{param.reportType || '-'}</code>
                      </td>
                      <td>{param.sampleType || '-'}</td>
                      <td>{param.formatType || '-'}</td>
                      <td>
                        <Badge bg={getStatusVariant(param.isActive)}>
                          {param.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="fas fa-ellipsis-v"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleEditParameter(param)}>
                              <i className="fas fa-edit me-2 text-warning"></i>Edit
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleDeleteParameter(param)}
                              className="text-danger"
                            >
                              <i className="fas fa-trash me-2"></i>Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* ✅ Pagination */}
          {pagination.currentPage < pagination.totalPages && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => loadParameters(pagination.currentPage + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal */}
      <ParameterModal
        show={showModal}
        onHide={() => setShowModal(false)}
        parameter={selectedParameter}
        onParameterSaved={handleParameterSaved}
      />
    </div>
  );
};

export default ParametersPage;
