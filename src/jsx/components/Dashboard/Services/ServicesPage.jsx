import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  deleteService,
  fetchServicesWithPagination,
} from "../../../../services/ServicesService";
import ServiceModal from "./ServiceModal";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });

  // Load services with pagination and filters
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
        Object.keys(params).forEach((key) => {
          if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const response = await fetchServicesWithPagination(params);

        if (response.success) {
          if (resetData) {
            setServices(response.data);
          } else {
            setServices((prev) =>
              page === 1 ? response.data : [...prev, ...response.data]
            );
          }

          setPagination({
            currentPage: response.pagination?.currentPage || page,
            totalPages: response.pagination?.totalPages || 1,
            totalItems:
              response.pagination?.total ||
              response.total ||
              response.data.length,
            itemsPerPage: response.pagination?.limit || pagination.itemsPerPage,
          });
        } else {
          throw new Error(response.message || "Failed to load services");
        }
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Failed to load services. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.itemsPerPage]
  );

  // Handle search with debouncing
  const handleSearch = useCallback((searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Handle service creation/editing
  const handleServiceSaved = () => {
    loadServices(1, true);
    setSelectedService(null);
  };

  // Handle service deletion
  const handleDeleteService = async (service) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the service "${
        service.name || service.serviceName
      }"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteService(service.id || service._id);

        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.message || "Service has been deleted successfully.",
            showConfirmButton: false,
            timer: 1500,
          });

          // Reload services
          loadServices(1, true);
        } else {
          throw new Error(response.message || "Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete service. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMessage,
        });
      }
    }
  };

  // Handle edit service
  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Handle add new service
  const handleAddService = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "warning";
    }
  };

  // Get category badge variant
  const getCategoryVariant = (category) => {
    const variants = {
      consultation: "primary",
      diagnostic: "info",
      laboratory: "warning",
      radiology: "danger",
      procedure: "success",
      surgery: "dark",
      pharmacy: "secondary",
      emergency: "danger",
      other: "light",
    };
    return variants[category?.toLowerCase()] || "light";
  };

  // Load services on component mount and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadServices(1, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="">
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center p-0">
              <div>
                <h4 className="card-title mb-0">Services Management</h4>
                <small className="text-muted">
                  Manage hospital services and their pricing
                </small>
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
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>

                <Col md={3}>
                  <Form.Select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="consultation">Consultation</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="radiology">Radiology</option>
                    <option value="procedure">Procedure</option>
                    <option value="surgery">Surgery</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Col>

                <Col md={2}>
                  <div className="d-flex align-items-center text-muted">
                    <small>
                      Total: <strong>{pagination.totalItems}</strong>
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Services Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Service Code</th>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Rate (₹)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && services.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Loading services...
                          </div>
                        </td>
                      </tr>
                    ) : services.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-inbox fa-3x mb-3 d-block opacity-50"></i>
                            <h6>No services found</h6>
                            <p className="mb-0">
                              {filters.search ||
                              filters.category ||
                              filters.status
                                ? "Try adjusting your filters"
                                : "Get started by adding your first service"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      services.map((service, index) => (
                        <tr key={service.id || service._id || index}>
                          <td>
                            <code className="text-primary fw-bold">
                              {service.code || service.serviceCode}
                            </code>
                          </td>
                          <td>
                            <div>
                              <strong>
                                {service.name || service.serviceName}
                              </strong>
                              {service.description && (
                                <small className="text-muted d-block">
                                  {service.description.length > 50
                                    ? `${service.description.substring(
                                        0,
                                        50
                                      )}...`
                                    : service.description}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge
                              bg={getCategoryVariant(service.category)}
                              className="text-capitalize"
                            >
                              {service.category || "Other"}
                            </Badge>
                          </td>
                          <td>
                            <strong className="text-success">
                              ₹
                              {(
                                service.rate ||
                                service.price ||
                                0
                              ).toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(service.status)}>
                              {service.status || "Active"}
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

      {/* Service Modal */}
      <ServiceModal
        show={showModal}
        onHide={() => setShowModal(false)}
        service={selectedService}
        onServiceSaved={handleServiceSaved}
      />
    </div>
  );
};

export default ServicesPage;
