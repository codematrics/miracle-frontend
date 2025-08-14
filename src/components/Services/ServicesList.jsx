import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner,
} from 'react-bootstrap';

import {
  useDeleteServiceMutation,
  useGetServicesQuery,
  useToggleServiceStatusMutation,
} from '../../store/api/servicesApi';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

const ServicesList = ({ onEditService, onAddService }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limit] = useState(10);

  // RTK Query hooks
  const {
    data: servicesData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetServicesQuery({
    page: currentPage,
    limit,
    search: searchQuery,
    category: selectedCategory,
  });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleServiceStatusMutation();

  const services = servicesData?.data || [];
  const totalPages = Math.ceil((servicesData?.total || 0) / limit);

  const handleSearch = e => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryFilter = e => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteService = async serviceId => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId).unwrap();
        showSuccessToast('Service deleted successfully');
      } catch (error) {
        showErrorToast('Failed to delete service');
      }
    }
  };

  const handleToggleStatus = async (serviceId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await toggleStatus({ id: serviceId, status: newStatus }).unwrap();
      showSuccessToast(
        `Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      showErrorToast('Failed to update service status');
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      />
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
    );

    return <Pagination className="justify-content-center">{items}</Pagination>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Services</Alert.Heading>
        <p>{error.message || 'Failed to load services'}</p>
        <Button variant="outline-danger" onClick={refetch}>
          <i className="fas fa-retry me-2"></i>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            <i className="fas fa-concierge-bell me-2"></i>
            Services Management
          </h4>
          <p className="text-muted mb-0">
            {servicesData?.total || 0} services found
            {isFetching && <Spinner size="sm" animation="border" className="ms-2" />}
          </p>
        </div>
        <Button variant="primary" onClick={onAddService}>
          <i className="fas fa-plus me-2"></i>
          Add Service
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={selectedCategory} onChange={handleCategoryFilter}>
            <option value="">All Categories</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="treatment">Treatment</option>
            <option value="surgery">Surgery</option>
            <option value="therapy">Therapy</option>
            <option value="emergency">Emergency</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={refetch} className="w-100">
            <i className="fas fa-sync-alt"></i>
          </Button>
        </Col>
      </Row>

      {/* Services List */}
      {services.length === 0 ? (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No services found. Try adjusting your search criteria or add a new service.
        </Alert>
      ) : (
        <Row>
          {services.map(service => (
            <Col md={6} lg={4} key={service.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-1">{service.name}</h6>
                    <Badge
                      bg={service.status === 'active' ? 'success' : 'secondary'}
                      className="ms-2"
                    >
                      {service.status}
                    </Badge>
                  </div>

                  <p className="text-muted small mb-2">
                    <i className="fas fa-tag me-1"></i>
                    {service.category || 'Uncategorized'}
                  </p>

                  <p className="card-text small">
                    {service.description?.substring(0, 100)}
                    {service.description?.length > 100 ? '...' : ''}
                  </p>

                  <div className="mb-3">
                    <strong className="text-primary">${service.price || '0.00'}</strong>
                    <small className="text-muted ms-1">/ {service.unit || 'session'}</small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onEditService(service)}
                      disabled={isDeleting || isToggling}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>

                    <Button
                      size="sm"
                      variant={service.status === 'active' ? 'outline-warning' : 'outline-success'}
                      onClick={() => handleToggleStatus(service.id, service.status)}
                      disabled={isDeleting || isToggling}
                    >
                      <i
                        className={`fas ${service.status === 'active' ? 'fa-pause' : 'fa-play'}`}
                      ></i>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={isDeleting || isToggling}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ServicesList;
