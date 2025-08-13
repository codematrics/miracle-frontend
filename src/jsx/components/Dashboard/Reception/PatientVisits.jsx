import { useCallback, useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Card, Dropdown, Form, InputGroup, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CreatePatientModal from "./CreatePatientModal";
import CreateVisitModal from "./CreateVisitModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Status Badge Components
const StatusBadge = ({ status }) => {
  const statusConfig = {
    scheduled: { bg: "warning", icon: "fa-clock", text: "Scheduled" },
    in_progress: { bg: "info", icon: "fa-stethoscope", text: "Consulting" },
    completed: { bg: "success", icon: "fa-check-circle", text: "Completed" },
    cancelled: { bg: "danger", icon: "fa-times-circle", text: "Cancelled" },
    no_show: { bg: "secondary", icon: "fa-user-times", text: "No Show" }
  };

  const config = statusConfig[status] || statusConfig.scheduled;
  
  return (
    <Badge bg={config.bg} className="d-flex align-items-center">
      <i className={`fa ${config.icon} me-1`}></i>
      {config.text}
    </Badge>
  );
};

const PatientVisits = () => {
  const navigate = useNavigate();
  
  // State Management
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  
  // Modal States
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    from: "",
    to: "",
    doctorId: ""
  });

  // Load visits from API
  const loadVisits = useCallback(async (page = 1, resetData = false) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_URL}/visits`, { params });

      if (response.data.success) {
        if (resetData) {
          setVisits(response.data.data);
        } else {
          setVisits(prev => page === 1 ? response.data.data : [...prev, ...response.data.data]);
        }
        
        setPagination({
          currentPage: response.data.pagination?.currentPage || page,
          totalPages: response.data.pagination?.totalPages || 1,
          total: response.data.pagination?.total || response.data.total || response.data.data.length,
          limit: response.data.pagination?.limit || pagination.limit,
        });
      } else {
        throw new Error(response.data.message || "Failed to load visits");
      }
    } catch (error) {
      console.error("Error loading visits:", error);
      toast.error("Failed to load visits. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Handle search with debouncing
  const handleSearch = useCallback((searchValue) => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle visit creation success
  const handleVisitCreated = (newVisit) => {
    console.log("New visit created:", newVisit);
    loadVisits(1, true); // Refresh visits list
    toast.success("Visit created successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handle patient creation success
  const handlePatientCreated = (newPatient) => {
    console.log("New patient created:", newPatient);
    toast.success("Patient created successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Navigate to patient details
  const showPatientDetail = (patientId) => {
    navigate(`/patient-details/${patientId}`);
  };

  // Open case sheet in new tab
  const openCaseSheet = (visitId) => {
    window.open(`/casesheet/${visitId}`, "_blank");
  };

  // Load visits on component mount and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadVisits(1, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="card-title mb-0">Patient Visits</h4>
                <small className="text-muted">
                  Manage patient visits and appointments
                </small>
              </div>
              <ButtonGroup>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" size="sm">
                    <i className="fa fa-plus me-2"></i>Add
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowPatientModal(true)}>
                      <i className="fa fa-user-plus me-2"></i>New Patient
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowVisitModal(true)}>
                      <i className="fa fa-calendar-plus me-2"></i>Add Visit
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ButtonGroup>
            </Card.Header>

            <Card.Body>
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="fa fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search visits..."
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                
                <div className="col-md-2">
                  <Form.Select
                    size="sm"
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </div>

                <div className="col-md-2">
                  <Form.Control
                    type="date"
                    size="sm"
                    value={filters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                    placeholder="From Date"
                  />
                </div>

                <div className="col-md-2">
                  <Form.Control
                    type="date"
                    size="sm"
                    value={filters.to}
                    onChange={(e) => handleFilterChange("to", e.target.value)}
                    placeholder="To Date"
                  />
                </div>

                <div className="col-md-3">
                  <div className="d-flex align-items-center text-muted">
                    <small>
                      Total Visits: <strong>{pagination.total}</strong>
                    </small>
                  </div>
                </div>
              </div>

              {/* Visits Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Visit ID</th>
                      <th>Date & Time</th>
                      <th>Patient Info</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && visits.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading visits...
                          </div>
                        </td>
                      </tr>
                    ) : visits.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fa fa-calendar-times fa-3x mb-3 d-block opacity-50"></i>
                            <h6>No visits found</h6>
                            <p className="mb-0">
                              {Object.values(filters).some(filter => filter)
                                ? "Try adjusting your filters"
                                : "Get started by adding your first visit"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      visits.map((visit, index) => (
                        <tr key={visit.id || visit._id || index}>
                          <td>
                            <code className="text-primary fw-bold">
                              {visit.visitId}
                            </code>
                          </td>
                          <td>
                            <div>
                              <strong>{formatDate(visit.visitDate)}</strong>
                              {visit.createdAt !== visit.visitDate && (
                                <small className="text-muted d-block">
                                  Created: {formatDate(visit.createdAt)}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong 
                                className="text-primary cursor-pointer"
                                onClick={() => showPatientDetail(visit.patient.id)}
                                style={{ cursor: "pointer" }}
                              >
                                {visit.patient.name}
                              </strong>
                              <small className="text-muted d-block">
                                UHID: {visit.patient.uhid}
                              </small>
                              <small className="text-muted d-block">
                                Mobile: {visit.patient.mobileNo}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{visit.visitingdoctor}</strong>
                              {visit.refby && (
                                <small className="text-muted d-block">
                                  Ref: {visit.refby}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge bg="outline-info">
                              {visit.visittype}
                            </Badge>
                            {visit.medicolegal === "Yes" && (
                              <Badge bg="warning" className="ms-1">
                                MLC
                              </Badge>
                            )}
                          </td>
                          <td>
                            <strong className="text-success">
                              ₹{visit.totalAmount?.toLocaleString() || '0'}
                            </strong>
                            {visit.services && visit.services.length > 0 && (
                              <small className="text-muted d-block">
                                {visit.services.length} service(s)
                              </small>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={visit.status || 'scheduled'} />
                          </td>
                          <td className="text-center">
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                className="btn-sm"
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => showPatientDetail(visit.patient.id)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="fa fa-user me-2 text-info"></i>
                                  View Patient
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => openCaseSheet(visit.id)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="fa fa-file-medical me-2 text-success"></i>
                                  Case Sheet
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  className="d-flex align-items-center text-warning"
                                >
                                  <i className="fa fa-edit me-2"></i>
                                  Edit Visit
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
                    onClick={() => loadVisits(pagination.currentPage + 1)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-down me-2"></i>
                        Load More Visits ({pagination.total - visits.length} remaining)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CreatePatientModal
        show={showPatientModal}
        onHide={() => setShowPatientModal(false)}
        onPatientCreated={handlePatientCreated}
      />
      
      <CreateVisitModal
        show={showVisitModal}
        onHide={() => setShowVisitModal(false)}
        onVisitCreated={handleVisitCreated}
      />
    </div>
  );
};

export default PatientVisits;