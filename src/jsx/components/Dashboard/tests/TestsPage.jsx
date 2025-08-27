import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Dropdown, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Swal from 'sweetalert2';

import { deleteLabTest, fetchLabTestsWithPagination } from '../../../../services/LabTestService';
import LinkServicesModal from './TestServiceLinkingModal';
import TestsModal from './TestsModal';

const TestsPage = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false); // ✅ state for linking modal
  const [selectedTest, setSelectedTest] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    reportType: '',
    status: '',
  });

  const loadLabTests = useCallback(
    async (page = 1, resetData = false) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          ...filters,
        };
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const response = await fetchLabTestsWithPagination(params);

        if (response.status) {
          const laTestsData = response.data?.labTests || [];
          const totalItems = response.data?.total || 0;
          const currentPage = response.data?.page || 1;
          const limit = response.data?.limit || pagination.itemsPerPage;

          setLabTests(prev => (resetData || page === 1 ? laTestsData : [...prev, ...laTestsData]));
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

  const handleLabTestSaved = () => {
    loadLabTests(1, true);
    setSelectedTest(null);
  };

  const handleDeleteTest = async test => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the test "${test.testName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteLabTest(test._id);

        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: response.message || 'Lab Test has been deleted successfully.',
            showConfirmButton: false,
            timer: 1500,
          });

          loadLabTests(1, true);
        } else {
          throw new Error(response.message || 'Failed to delete lab test');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text:
            error.response?.data?.message ||
            error.message ||
            'Failed to delete lab test. Please try again.',
        });
      }
    }
  };

  const handleEditTest = test => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const handleLinkTest = test => {
    setSelectedTest(test);
    setShowLinkModal(true); // ✅ open linking modal
  };

  const handleAddTest = () => {
    setSelectedTest(null);
    setShowModal(true);
  };

  const getStatusVariant = isActive => (isActive ? 'success' : 'secondary');

  const handleClearFilters = () => {
    setFilters({ search: '', serviceHead: '', status: '' });
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
                <h4 className="card-title mb-0">Tests Management And Linking</h4>
                <small className="text-muted">Manage hospital tests and their services</small>
              </div>
              <Button
                variant="primary"
                onClick={handleAddTest}
                className="d-flex align-items-center"
              >
                <i className="fas fa-plus me-2"></i>
                Add Test
              </Button>
            </Card.Header>

            <Card.Body className="px-0">
              {/* Filters */}
              {/* ... filters code unchanged ... */}

              {/* Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Test Name</th>
                      <th>Report Type</th>
                      <th>Sample Type</th>
                      <th>Format Type</th>
                      <th>Status</th>
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
                            Loading services...
                          </div>
                        </td>
                      </tr>
                    ) : labTests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="text-muted">
                            <i className="fas fa-inbox fa-3x mb-3 d-block opacity-50"></i>
                            <h6>No labTests found</h6>
                            <p className="mb-0">
                              {filters.search || filters.category || filters.status
                                ? 'Try adjusting your filters'
                                : 'Get started by adding your first service'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      labTests.map((test, index) => (
                        <tr key={test._id || index}>
                          <td>
                            <strong>{test.testName}</strong>
                          </td>
                          <td>{test.reportType || 'Other'}</td>
                          <td>{test.sampleType || 'Other'}</td>
                          <td>{test.formatType || 'Other'}</td>
                          <td>
                            <Badge bg={getStatusVariant(test.isActive)}>
                              {test.isActive ? 'Active' : 'Inactive'}
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
                                  onClick={() => handleEditTest(test)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="fas fa-edit me-2 text-warning"></i>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleLinkTest(test)} // ✅ linking option
                                  className="d-flex align-items-center"
                                >
                                  <i className="fas fa-link me-2 text-primary"></i>
                                  Link Services
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() => handleDeleteTest(test)}
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
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <TestsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        test={selectedTest}
        onTestSaved={handleLabTestSaved}
      />

      <LinkServicesModal
        show={showLinkModal}
        onHide={() => setShowLinkModal(false)}
        testId={selectedTest?._id}
        onLinked={handleLabTestSaved}
      />
    </div>
  );
};

export default TestsPage;
