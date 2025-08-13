import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../casesheet.css";
import CreatePatientModal from "./CreatePatientModal.jsx";
import CreateVisitModal from "./CreateVisitModal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Status badge generator
const getStatusComponent = (status) => {
  const statusMap = {
    completed: {
      text: "Completed",
      color: "primary",
      style: "badge-outline-primary",
    },
    cancelled: { text: "Hold", color: "danger", style: "badge-outline-danger" },
    in_progress: {
      text: "Consulting",
      color: "info",
      style: "badge-info light",
    },
    scheduled: {
      text: "Pending",
      color: "warning",
      style: "badge-warning light",
    },
  };
  const { text, color, style } =
    statusMap[status?.toLowerCase()] || statusMap.scheduled;
  return (
    <span className={`badge ${style}`}>
      <i className={`fa fa-circle text-${color} me-1`} />
      {text}
    </span>
  );
};

// Date formatting
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const Patient = () => {
  const [openAddPatientModel, setOpenAddPatientModal] = useState(false);
  const [visitModal, setVisitModal] = useState(false);
  const [dateFilterModal, setDateFilterModal] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(false);

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
  const activePag = useRef(0);
  const navigate = useNavigate();

  const fetchVisits = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/visits`, {
        params: { page, limit: pagination.limit },
      });

      if (data.success) {
        setVisitsData(data.data);
        setPagination({
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.total || 0,
          limit: data.pagination?.limit || 10,
        });
      } else {
        toast.error("Failed to load visits");
      }
    } catch {
      toast.error("Error loading visits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickPage = (i) => {
    activePag.current = i;
    if (
      i + 1 > Math.ceil(visitsData.length / sort) &&
      pagination.currentPage < pagination.totalPages
    ) {
      fetchVisits(pagination.currentPage + 1);
    }
  };

  const handlePatientCreated = () =>
    toast.success("Patient created successfully!");
  const handleVisitCreated = () => {
    fetchVisits();
    toast.success("Visit created successfully!");
  };

  const fetchPrescriptionData = async (patientId) => {
    try {
      // API call placeholder
      setCaseSheetData(null);
      setPrescriptionModal(true);
    } catch {
      setError("Failed to fetch prescription data");
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
                <Dropdown.Item onClick={() => setVisitModal(true)}>
                  Add Visit
                </Dropdown.Item>
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
      <div className="table-responsive card-table">
        <table className="table table-striped no-footer display table-responsive-xl dataTable text-black">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Patient ID</th>
              <th>Date Check In</th>
              <th>Patient Name</th>
              <th>Doctor Assigned</th>
              <th>Cabin No</th>
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
                      onClick={() =>
                        navigate(`/patient-details/${visit.patient.id}`)
                      }
                      style={{ cursor: "pointer", color: "#007bff" }}
                      role="button"
                    >
                      {visit.patient.uhid}
                    </span>
                  </td>
                  <td>{formatDate(visit.visitDate)}</td>
                  <td>{visit.patient.name}</td>
                  <td>{visit.visitingdoctor}</td>
                  <td>-</td>
                  <td>{getStatusComponent(visit.status)}</td>
                  <td>
                    <Dropdown className="ms-auto text-end">
                      <Dropdown.Toggle className="btn-link i-false" as="div">
                        <i className="fa fa-ellipsis-v"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item>Accept Patient</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            fetchPrescriptionData(visit.patient.id)
                          }
                        >
                          Prescription
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            window.open(`/casesheet/${visit.id}`, "_blank")
                          }
                        >
                          Case Sheet
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            navigate(`/patient-details/${visit.patient.id}`)
                          }
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

        {/* Pagination */}
        <div className="d-sm-flex text-center justify-content-between align-items-center">
          <div>
            Showing {activePag.current * sort + 1} to{" "}
            {visitsData.length > (activePag.current + 1) * sort
              ? (activePag.current + 1) * sort
              : visitsData.length}{" "}
            of {pagination.total} entries
          </div>
          <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-center align-items-center pb-3">
            <Link
              to="#"
              onClick={() =>
                activePag.current > 0 && onClickPage(activePag.current - 1)
              }
            >
              Previous
            </Link>
            {paggination.map((num, i) => (
              <Link
                key={i}
                to="#"
                className={activePag.current === i ? "current ms-1" : "ms-1"}
                onClick={() => onClickPage(i)}
              >
                {num}
              </Link>
            ))}
            <Link
              to="#"
              onClick={() =>
                activePag.current + 1 < paggination.length &&
                onClickPage(activePag.current + 1)
              }
            >
              Next
            </Link>
          </div>
        </div>
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
      {/* Date Filter Modal omitted for brevity, same as before */}
      {/* Prescription Modal omitted for brevity, same as before */}
    </>
  );
};

export default Patient;
