import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import RadiologyTemplateForm from './modals/RadiologyTemplateForm';

const RadiologyTemplateMaster = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, template: null });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
  });

  // Fetch templates
  const fetchTemplates = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success || data.status) {
        setTemplates(data.data?.templates || []);
        setPagination(prev => ({
          ...prev,
          page: data.data?.page || 1,
          total: data.data?.total || 0,
          totalPages: data.data?.totalPages || 1,
        }));
      } else {
        toast.error(data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const handleDelete = async () => {
    if (!deleteModal.template) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template/${deleteModal.template._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: JSON.parse(localStorage.getItem('userDetails'))?.id,
          }),
        }
      );

      const data = await response.json();
      if (data.success || data.status) {
        toast.success('Template deleted successfully');
        setDeleteModal({ show: false, template: null });
        fetchTemplates(pagination.page);
      } else {
        toast.error(data.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTemplate(null);
    fetchTemplates(pagination.page);
  };

  // Handle search
  const handleSearch = searchValue => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchTemplates(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ search: '', isActive: '' });
    fetchTemplates(1);
  };

  // Initialize
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Auto-apply search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== '') {
        fetchTemplates(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-white text-white">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    <i className="fas fa-file-medical me-2"></i>
                    Radiology Template Master
                  </h5>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="me-2"
                  >
                    <i className="fas fa-plus me-1"></i>
                    New Template
                  </Button>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-end">
                <Col md={4}>
                  <label className="form-label">Search Templates</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by template name..."
                    value={filters.search}
                    onChange={e => handleSearch(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={filters.isActive}
                    onChange={e => handleFilterChange('isActive', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </Col>
                <Col md={5}>
                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={applyFilters} disabled={loading}>
                      <i className="fas fa-search me-1"></i>
                      Apply Filters
                    </Button>
                    <Button variant="outline-secondary" onClick={clearFilters}>
                      <i className="fas fa-times me-1"></i>
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Templates Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0">Templates ({pagination.total})</h6>
                </Col>
                <Col xs="auto">
                  <small className="text-muted">
                    Page {pagination.page} of {pagination.totalPages}
                  </small>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
                  <p>Loading templates...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-file-medical fa-3x mb-3"></i>
                  <h6>No Templates Found</h6>
                  <p>Create your first radiology template to get started</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '25%' }}>Template Name</th>
                        <th style={{ width: '30%' }}>Description</th>
                        <th style={{ width: '10%' }}>Status</th>
                        <th style={{ width: '15%' }}>Created By</th>
                        <th style={{ width: '10%' }}>Created Date</th>
                        <th style={{ width: '15%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template, index) => (
                        <tr key={template._id}>
                          <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                          <td>
                            <strong>{template.templateName}</strong>
                          </td>
                          <td>
                            <div>{template.description || 'No description provided'}</div>
                          </td>
                          <td>
                            <Badge bg={template.isActive ? 'success' : 'danger'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <small>
                              {template.createdBy?.name || template.updatedBy?.name || 'Unknown'}
                            </small>
                          </td>
                          <td>
                            <small>{new Date(template.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setEditingTemplate(template);
                                  setShowForm(true);
                                }}
                                title="Edit Template"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setDeleteModal({ show: true, template })}
                                title="Delete Template"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>

            {/* Pagination */}
            {!loading && templates.length > 0 && pagination.totalPages > 1 && (
              <Card.Footer>
                <Row className="align-items-center">
                  <Col>
                    <small className="text-muted">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} entries
                    </small>
                  </Col>
                  <Col xs="auto">
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => fetchTemplates(pagination.page - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => fetchTemplates(pagination.page + 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Template Form Modal */}
      <RadiologyTemplateForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, template: null })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h6>Are you sure you want to delete this template?</h6>
            <p className="text-muted mb-0">
              <strong>{deleteModal.template?.templateName}</strong>
            </p>
            <small className="text-muted">This action cannot be undone.</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ show: false, template: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Template
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RadiologyTemplateMaster;
