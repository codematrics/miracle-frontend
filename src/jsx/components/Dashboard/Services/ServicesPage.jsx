import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Dropdown, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Swal from 'sweetalert2';

import { SERVICE_HEADS } from '../../../../constants/enums';
import { deleteService, fetchServicesWithPagination } from '../../../../services/ServicesService';
import LinkParametersModal from './ParameterServiceLinkingModal';
import RadiologyTemplateLinkModal from './modals/RadiologyTemplateLinkModal';
import ServiceModal from './ServiceModal';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false); // ✅ state for parameter linking modal
  const [showTemplateLinkModal, setShowTemplateLinkModal] = useState(false); // ✅ state for template linking modal
  const [selectedService, setSelectedService] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    serviceHead: '',
    status: '',
  });

  // ✅ Corrected API data handling
  const loadServices = useCallback(
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

        const response = await fetchServicesWithPagination(params);

        if (response.status) {
          const servicesData = response.data?.services || [];
          const totalItems = response.data?.total || 0;
          const currentPage = response.data?.page || 1;
          const limit = response.data?.limit || pagination.itemsPerPage;

          setServices(prev =>
            resetData || page === 1 ? servicesData : [...prev, ...servicesData]
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

  const handleSearch = useCallback(value => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleServiceSaved = () => {
    loadServices(1, true);
    setSelectedService(null);
  };

  const handleDeleteService = async service => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the service "${service.serviceName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteService(service._id);

        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: response.message || 'Service has been deleted successfully.',
            showConfirmButton: false,
            timer: 1500,
          });

          loadServices(1, true);
        } else {
          throw new Error(response.message || 'Failed to delete service');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text:
            error.response?.data?.message ||
            error.message ||
            'Failed to delete service. Please try again.',
        });
      }
    }
  };

  const handleEditService = service => {
    console.log(service);
    setSelectedService(service);
    setShowModal(true);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  const getStatusVariant = isActive => (isActive ? 'success' : 'secondary');

  const getCategoryVariant = category => {
    const variants = {
      consultation: 'primary',
      diagnostic: 'info',
      laboratory: 'warning',
      radiology: 'danger',
      procedure: 'success',
      pathology: 'dark',
      surgery: 'dark',
      pharmacy: 'secondary',
      emergency: 'danger',
      other: 'light',
    };
    return variants[category?.toLowerCase()] || 'light';
  };

  const handleLinkParameter = service => {
    setSelectedService(service);
    setShowLinkModal(true); // ✅ open parameter linking modal
  };

  const handleLinkTemplate = service => {
    // Check if service is radiology type
    if (service.headType && service.headType.toLowerCase() === 'radiology') {
      setSelectedService(service);
      setShowTemplateLinkModal(true); // ✅ open template linking modal
    } else {
      toast.warning('Template linking is only available for Radiology services', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleTemplateLinkSuccess = () => {
    setShowTemplateLinkModal(false);
    setSelectedService(null);
    // Optionally reload services if needed
    // loadServices(1, true);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', serviceHead: '', status: '' });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadServices(1, true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, loadServices]);

  return (
    <div className="">
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center p-0">
              <div>
                <h4 className="card-title mb-0">Services Management</h4>
                <small className="text-muted">Manage hospital services and their pricing</small>
              </div>
              <Button
                variant="primary"
                onClick={handleAddService}
                className="d-flex align-items-center"
              >
                <i className="fas fa-plus me-2"></i>
                Add Service
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              {/* Filters */}
              <Row className="mb-4">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search services..."
                      value={filters.search}
                      onChange={e => handleSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>

                <Col md={3}>
                  <Form.Select
                    value={filters.category}
                    onChange={e => handleFilterChange('serviceHead', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {Object.keys(SERVICE_HEADS).map(key => (
                      <option key={SERVICE_HEADS[key]} value={SERVICE_HEADS[key]}>
                        {SERVICE_HEADS[key]}
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
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Col>

                <Col md={2}>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={handleClearFilters}
                  >
                    <i className="las la-redo-alt me-2"></i> Clear Filters
                  </Button>
                </Col>
              </Row>

              {/* Services Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Service Code</th>
                      <th>Service Name</th>
                      <th>Service Head</th>
                      <th>Head Type</th>
                      <th>Rate (₹)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && services.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading services...
                          </div>
                        </td>
                      </tr>
                    ) : services.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-inbox fa-3x mb-3 d-block opacity-50"></i>
                            <h6>No services found</h6>
                            <p className="mb-0">
                              {filters.search || filters.category || filters.status
                                ? 'Try adjusting your filters'
                                : 'Get started by adding your first service'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      services.map((service, index) => (
                        <tr key={service._id || index}>
                          <td>
                            <code className="text-primary fw-bold">{service.code}</code>
                          </td>
                          <td>
                            <strong>{service.serviceName}</strong>
                          </td>
                          <td>
                            <Badge
                              bg={getCategoryVariant(service.serviceHead)}
                              className="text-capitalize"
                            >
                              {service.serviceHead || 'Other'}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              bg={getCategoryVariant(service.headType)}
                              className="text-capitalize"
                            >
                              {service.headType || 'Other'}
                            </Badge>
                          </td>
                          <td>
                            <strong className="text-success">
                              ₹{(service.price || 0).toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(service.isActive)}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                className="btn-sm"
                              >
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleEditService(service)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="fas fa-edit me-2 text-warning"></i>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleLinkParameter(service)} // ✅ parameter linking option
                                  className="d-flex align-items-center"
                                >
                                  <i className="fas fa-link me-2 text-primary"></i>
                                  Link Parameters
                                </Dropdown.Item>
                                {service.headType && service.headType.toLowerCase() === 'radiology' && (
                                  <Dropdown.Item
                                    onClick={() => handleLinkTemplate(service)} // ✅ template linking option for radiology
                                    className="d-flex align-items-center"
                                  >
                                    <i className="fas fa-file-medical me-2 text-success"></i>
                                    Link Template
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() => handleDeleteService(service)}
                                  className="d-flex align-items-center text-danger"
                                >
                                  <i className="fas fa-trash me-2"></i>
                                  Delete
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

              {/* Load More Button */}
              {pagination.currentPage < pagination.totalPages && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => loadServices(pagination.currentPage + 1)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down me-2"></i>
                        Load More Services
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <ServiceModal
        show={showModal}
        onHide={() => setShowModal(false)}
        service={selectedService}
        onServiceSaved={handleServiceSaved}
      />

      <LinkParametersModal
        show={showLinkModal}
        onHide={() => setShowLinkModal(false)}
        serviceId={selectedService?._id}
        onLinked={handleServiceSaved}
      />

      <RadiologyTemplateLinkModal
        show={showTemplateLinkModal}
        onHide={() => setShowTemplateLinkModal(false)}
        service={selectedService}
        onSuccess={handleTemplateLinkSuccess}
      />
    </div>
  );
};

export default ServicesPage;
