import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Dropdown, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import RadiologyTemplateEditor from './modals/RadiologyTemplateEditor';

const RadiologyWorkflow = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    from: '',
    to: '',
    mobileNo: '',
    uhid: '',
    patientName: '',
  });

  // Load radiology lab tests
  const loadLabTests = useCallback(
    async (page = 1, resetData = false) => {
      setLoading(true);
      try {
        const params = {
          headType: 'Radiology',
          page,
          limit: pagination.itemsPerPage,
          ...filters,
        };

        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/lab-test-orders?${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.status) {
          const labTestsData = data.data?.labTests || [];
          const totalItems = data.data?.total || 0;
          const currentPage = data.data?.page || 1;
          const limit = data.data?.limit || pagination.itemsPerPage;

          setLabTests(prev =>
            resetData || page === 1 ? labTestsData : [...prev, ...labTestsData]
          );

          setPagination({
            currentPage,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
          });
        } else {
          throw new Error(data.message || 'Failed to load radiology tests');
        }
      } catch (error) {
        console.error('Error loading radiology tests:', error);
        toast.error('Failed to load radiology tests. Please try again.', {
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

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      from: '',
      to: '',
      mobileNo: '',
      uhid: '',
      patientName: '',
    });
  };

  const handleAccessionClick = (labTest) => {
    setSelectedLabTest(labTest);
    setShowTemplateEditor(true);
  };

  const handleTemplateEditorClose = () => {
    setShowTemplateEditor(false);
    setSelectedLabTest(null);
    // Reload data to reflect any status changes
    loadLabTests(1, true);
  };

  const handlePrintReport = async (labTest) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/print-radiology?labTestOrderId=${labTest._id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
          },
        }
      );

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `radiology-report-${labTest._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Report downloaded successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const getStatusVariant = status => {
    const variants = {
      pending: 'warning',
      collected: 'info',
      saved: 'primary',
      authorized: 'success',
    };
    return variants[status?.toLowerCase()] || 'secondary';
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadLabTests(1, true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, loadLabTests]);

  return (
    <div className="">
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center p-0">
              <div>
                <h4 className="card-title mb-0">Radiology Workflow</h4>
                <small className="text-muted">Manage radiology test orders and reports</small>
              </div>
            </Card.Header>

            <Card.Body className="px-0">
              {/* Filters */}
              <Row className="mb-4">
                <Col md={3}>
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

                <Col md={2}>
                  <Form.Select
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="collected">Collected</option>
                    <option value="saved">Saved</option>
                    <option value="authorized">Authorized</option>
                  </Form.Select>
                </Col>

                <Col md={2}>
                  <Form.Control
                    type="text"
                    placeholder="Patient Name"
                    value={filters.patientName}
                    onChange={e => handleFilterChange('patientName', e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Control
                    type="text"
                    placeholder="UHID"
                    value={filters.uhid}
                    onChange={e => handleFilterChange('uhid', e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Control
                    type="text"
                    placeholder="Mobile No"
                    value={filters.mobileNo}
                    onChange={e => handleFilterChange('mobileNo', e.target.value)}
                  />
                </Col>

                <Col md={1}>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={handleClearFilters}
                    title="Clear Filters"
                  >
                    <i className="las la-redo-alt"></i>
                  </Button>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={3}>
                  <Form.Control
                    type="date"
                    placeholder="From Date"
                    value={filters.from}
                    onChange={e => handleFilterChange('from', e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    placeholder="To Date"
                    value={filters.to}
                    onChange={e => handleFilterChange('to', e.target.value)}
                  />
                </Col>
              </Row>

              {/* Lab Tests Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Accession</th>
                      <th>Patient Details</th>
                      <th>Service</th>
                      <th>Doctor</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && labTests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading radiology tests...
                          </div>
                        </td>
                      </tr>
                    ) : labTests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-x-ray fa-3x mb-3 d-block opacity-50"></i>
                            <h6>No radiology tests found</h6>
                            <p className="mb-0">
                              {Object.values(filters).some(f => f)
                                ? 'Try adjusting your filters'
                                : 'No radiology test orders available'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      labTests.map((labTest, index) => (
                        <tr key={labTest._id || index}>
                          <td>
                            <Button
                              variant="link"
                              className="p-0 text-primary fw-bold text-decoration-underline"
                              onClick={() => handleAccessionClick(labTest)}
                            >
                              {labTest._id?.slice(-8).toUpperCase() || 'N/A'}
                            </Button>
                          </td>
                          <td>
                            <div>
                              <strong>{labTest.patient?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">
                                UHID: {labTest.patient?.uhidNo || 'N/A'}
                              </small>
                              <br />
                              <small className="text-muted">
                                {labTest.patient?.contactNumber || 'N/A'} | {labTest.patient?.age || 'N/A'} | {labTest.patient?.gender || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{labTest.service?.serviceName || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">
                                Code: {labTest.service?.code || 'N/A'}
                              </small>
                              <br />
                              <Badge bg="info" className="text-capitalize">
                                {labTest.service?.headType || 'N/A'}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{labTest.doctor?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">
                                {labTest.doctor?.qualification || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(labTest.status)} className="text-capitalize">
                              {labTest.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td>
                            <small>
                              {new Date(labTest.createdAt).toLocaleDateString()}
                              <br />
                              {new Date(labTest.createdAt).toLocaleTimeString()}
                            </small>
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
                                  onClick={() => handleAccessionClick(labTest)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="fas fa-file-medical me-2 text-primary"></i>
                                  {labTest.status === 'pending' ? 'Edit Template' : 'View Template'}
                                </Dropdown.Item>
                                {labTest.status === 'authorized' && (
                                  <Dropdown.Item
                                    onClick={() => handlePrintReport(labTest)}
                                    className="d-flex align-items-center"
                                  >
                                    <i className="fas fa-print me-2 text-success"></i>
                                    Print Report
                                  </Dropdown.Item>
                                )}
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
                    onClick={() => loadLabTests(pagination.currentPage + 1)}
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
                        Load More Tests
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <RadiologyTemplateEditor
        show={showTemplateEditor}
        onHide={handleTemplateEditorClose}
        labTest={selectedLabTest}
      />
    </div>
  );
};

export default RadiologyWorkflow;