import { useCallback, useEffect, useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { VISIT_STATUS } from '../../../../constants/enums.js';
import {
  acceptThePatient,
  fetchVisitsWithPagination,
  getPrescriptionPdf,
} from '../../../../services/VisitService.js';
import '../../../casesheet.css';
import CreatePatientModal from './CreatePatientModal.jsx';
import CreateVisitModal from './CreateVisitModal.jsx';
import CreatePrescriptionModal from './PrescriptionModal.jsx';

// Status badge generator
const getStatusComponent = status => {
  const statusMap = {
    [VISIT_STATUS.ACCEPTED]: {
      text: 'Consulting',
      color: 'primary',
      style: 'badge-outline-primary',
    },
    [VISIT_STATUS.CLOSED]: {
      text: 'Completed',
      color: 'info',
      style: 'badge-info light',
    },
    [VISIT_STATUS.PENDING]: {
      text: 'Pending',
      color: 'warning',
      style: 'badge-warning light',
    },
  };
  const { text, color, style } = statusMap[status] || statusMap.scheduled;
  return (
    <span className={`badge ${style}`}>
      <i className={`fa fa-circle text-${color} me-1`} />
      {text}
    </span>
  );
};

// Date formatting
const formatDate = dateString =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const Patient = () => {
  const [openAddPatientModel, setOpenAddPatientModal] = useState(false);
  const [visitModal, setVisitModal] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [dateFilterModal, setDateFilterModal] = useState(false);

  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [caseSheetData, setCaseSheetData] = useState(null);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const sort = 10;
  const navigate = useNavigate();

  const loadVisits = useCallback(
    async (page = 1, resetData = false) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.itemsPerPage,
          // ...filters,
        };

        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const response = await fetchVisitsWithPagination(params);

        if (response.status) {
          const visitData = response.data?.visits || [];
          const totalItems = response.data?.total || 0;
          const currentPage = response.data?.page || 1;
          const limit = response.data?.limit || pagination.itemsPerPage;

          setVisitsData(prev => (resetData || page === 1 ? visitData : [...prev, ...visitData]));

          setPagination({
            currentPage,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
          });
        } else {
          throw new Error(response.message || 'Failed to load visits');
        }
      } catch (error) {
        console.error('Error loading visits:', error);
        toast.error('Failed to load visits. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [pagination.itemsPerPage]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadVisits(1, true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadVisits]);

  const handlePatientCreated = () => toast.success('Patient created successfully!');
  const handleVisitCreated = () => {
    loadVisits(pagination.currentPage);
    toast.success('Visit created successfully!');
  };
  const handlePrescriptionCreated = () => {
    loadVisits(pagination.currentPage);
  };

  const acceptPatient = async visitId => {
    try {
      await acceptThePatient(visitId);
      loadVisits(paggination.currentPage);
    } catch {
      setError('Failed to change prescription data');
    }
  };

  const fetchPrescriptionData = async prescriptionId => {
    try {
      const response = await getPrescriptionPdf(prescriptionId);

      // Create a blob link and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to fetch prescription PDF:', error);
      toast.error('Failed to fetch prescription PDF');
    }
  };

  const paggination = Array(Math.ceil(visitsData.length / sort))
    .fill()
    .map((_, i) => i + 1);

  return (
    <>
      {/* Header */}
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">Visits</h2>
        </div>
        <div>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="me-2" variant="primary" size="sm">
                <i className="fa fa-plus color-info" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setOpenAddPatientModal(true)}>
                  New Patient
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setVisitModal(true)}>Add Visit</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <Button
            className="me-2"
            variant="primary btn-sm"
            onClick={() => setDateFilterModal(true)}
          >
            <i className="las la-calendar-plus scale5 me-2" /> Filter Date
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-table dataTables_wrapper no-footer">
        <div id="workflow_list" className="table-responsive">
          <table className="table table-striped no-footer display table-responsive-xl dataTable text-black">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Patient ID</th>
                <th>Date Check In</th>
                <th>Patient Name</th>
                <th>Doctor Assigned</th>
                <th>Visit Type</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <div className="mt-2">Loading visits...</div>
                  </td>
                </tr>
              ) : visitsData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <i className="fa fa-calendar-times fa-2x mb-2 d-block"></i>
                    No visits found
                  </td>
                </tr>
              ) : (
                visitsData.map((visit, ind) => (
                  <tr key={visit.id || ind}>
                    <td>{ind + 1}</td>
                    <td>
                      <span
                        onClick={() => navigate(`/patient-details/${visit.patient.uhid}`)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                        role="button"
                      >
                        {visit.patientId.uhidNo}
                      </span>
                    </td>
                    <td>{formatDate(visit.visitDate)}</td>
                    <td>{visit.patientId.name}</td>
                    <td>{visit?.consultingDoctorId?.name || 'N/A'}</td>
                    <td>{visit.visitType}</td>
                    <td>{getStatusComponent(visit.status)}</td>
                    <td>
                      <Dropdown className="ms-auto text-end">
                        <Dropdown.Toggle className="btn-link i-false" as="div">
                          <i className="fa fa-ellipsis-v"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item onClick={() => acceptPatient(visit._id)}>
                            Accept Patient
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              setPrescriptionModal({
                                visitId: visit._id,
                                patientId: visit.patientId._id,
                              })
                            }
                          >
                            Add Prescription
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => fetchPrescriptionData(visit.prescription)}>
                            View Prescription
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={() => window.open(`/casesheet/${visit.id}`, '_blank')}
                          >
                            Case Sheet
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => navigate(`/patient-details/${visit.patient.uhid}`)}
                          >
                            View Details
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                  <i className="fas fa-chevron-down me-2"></i>
                  Load More Services
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePatientModal
        show={openAddPatientModel}
        onHide={() => setOpenAddPatientModal(false)}
        onPatientCreated={handlePatientCreated}
      />
      <CreateVisitModal
        show={visitModal}
        onHide={() => setVisitModal(false)}
        onVisitCreated={handleVisitCreated}
      />
      {console.log(prescriptionModal)}
      <CreatePrescriptionModal
        show={Boolean(prescriptionModal)}
        onHide={() => setPrescriptionModal(null)}
        visitId={prescriptionModal?.visitId}
        patientId={prescriptionModal?.patientId}
        onPrescriptionCreated={handlePrescriptionCreated}
      />
      {/* Date Filter Modal omitted for brevity, same as before */}
      {/* Prescription Modal omitted for brevity, same as before */}
    </>
  );
};

export default Patient;
