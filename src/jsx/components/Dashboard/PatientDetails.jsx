import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PatientDetails = () => {
  const { id: patientId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const fetchPatientDetails = async () => {
    if (!patientId) {
      setError('Patient ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/patients/${patientId}/details`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setPatientData(response.data.data);
        // Set the recent visit as the selected visit by default
        setSelectedVisit(response.data.data.recentVisit);
      } else {
        throw new Error(response.data.message || 'Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      const errorMessage =
        error.response?.status === 404
          ? 'Patient not found'
          : error.response?.data?.message || error.message || 'Failed to fetch patient details';

      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const showVisitDetail = visitNo => {
    // For now, we'll show the recent visit details when clicked
    // In a full implementation, you might have separate API endpoints for each visit
    if (visitNo === patientData?.recentVisit?.visitNo) {
      setSelectedVisit(patientData.recentVisit);
    } else {
      // Handle other visits - for now we'll show the recent visit
      // This could be enhanced to fetch specific visit details
      setSelectedVisit(patientData.recentVisit);
      toast.info('Showing recent visit details', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatComplaint = complaint => {
    if (!complaint) return 'N/A';
    return complaint.split('\n').map((line, index) => <div key={index}>{line}</div>);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading patient details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Patient Details</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchPatientDetails}>
            <i className="fa fa-refresh me-2"></i>Try Again
          </button>
        </Alert>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="container-fluid">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>No Patient Data</Alert.Heading>
          <p>Patient data could not be loaded.</p>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">Patient Details</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item active">
              <Link to={'#'}>Patient</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={'#'}>{patientData?.uhid}</Link>
            </li>
          </ol>
        </div>
        {/* <div className="d-flex">
          <Dropdown className="dropdown me-3">
            <Dropdown.Toggle className="btn btn-primary i-false">
              In Treatment
              <i className="las la-angle-down ms-2 scale5"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end" align="end">
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Detail</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        {/* <Link to={"#"} className="btn btn-outline-primary">Update Profile</Link> */}
        {/* </div> */}
      </div>

      <div className="row">
        <div className="col-lg-12 mt-1">
          <div className="card card-profile">
            <div className="admin-user">
              <div className="user-details m-1">
                <div className="title text-black">
                  <div className="row">
                    <div className="col-md-3 col-sm-6">
                      <label>UHID</label>
                      <h5>{patientData?.uhid}</h5>
                    </div>
                    <div className="col-md-5 col-sm-12">
                      <label>Patient Name</label>
                      <h5>
                        {patientData?.patientName} {patientData?.relation} {patientData?.fathername}
                      </h5>
                    </div>
                    <div className="col-md-2 col-sm-6">
                      <label>Mobile No</label>
                      <h5>{patientData?.mobileNo}</h5>
                    </div>
                    <div className="col-md-2 col-sm-6">
                      <label>Age/Sex</label>
                      <h5>{patientData?.ageGender}</h5>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12 col-sm-12">
                      <label>Address</label>
                      <h5>{patientData?.address}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-xl-5">
          <div className="row">
            <div className="col-xl-12">
              <div className="card text-black p-2">
                <h4 className="card-title">Recent Visit Details</h4>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Visit No</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{selectedVisit?.visitNo}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Visit Date</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{formatDate(selectedVisit?.visitDate)}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Doctor Name</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{selectedVisit?.doctorName}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>License No</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{selectedVisit?.licenseNo}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Specialization</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{selectedVisit?.specialization}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Department</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h5>{selectedVisit?.department}</h5>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>C/O</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>{formatComplaint(selectedVisit?.chiefComplaint)}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Vitals</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <h6>Temp: {selectedVisit?.vitals?.temperature}</h6>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <h6>Spo2: {selectedVisit?.vitals?.spo2}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <h6>Height: {selectedVisit?.vitals?.height}</h6>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <h6>Weight: {selectedVisit?.vitals?.weight}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <h6>BP: {selectedVisit?.vitals?.bloodPressure}</h6>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <h6>R/R: {selectedVisit?.vitals?.respiratoryRate}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <h6>Pulse: {selectedVisit?.vitals?.pulse}</h6>
                      </div>
                      <div className="col-md-6 col-sm-12">{/* Empty column for alignment */}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-7">
          <div className="row">
            <div className="col-xl-12">
              <div className="card text-black p-2">
                <h4 className="card-title">Recent Visit Details</h4>

                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Diagnosis</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>Provisional: {selectedVisit?.diagnosis?.provisional || 'N/A'}</h6>
                    <h6>Final: {selectedVisit?.diagnosis?.final || 'N/A'}</h6>
                    <h6>Additional: {selectedVisit?.diagnosis?.additional || 'N/A'}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Past History</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>{selectedVisit?.pastHistory || 'N/A'}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Investigation</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>{selectedVisit?.investigation || 'N/A'}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Allergies</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>{selectedVisit?.allergies || 'N/A'}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Advice</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <h6>{selectedVisit?.advice || 'N/A'}</h6>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>Medications</label>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    {selectedVisit?.medications?.length > 0 ? (
                      selectedVisit.medications.map((med, index) => (
                        <span className="text-black fs-6" style={{ color: '#3d4465' }} key={index}>
                          {med.medicine} {med.dosage} {med.frequency} {med.duration} -{' '}
                          {med.instructions}
                          <br />
                        </span>
                      ))
                    ) : (
                      <h6>No medications prescribed</h6>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="row">
          <div className="col-xl-12">
            <div className="card text-black p-2">
              <h4>Previous Visit Details</h4>
              <table className="table table-bordered no-footer display text-black">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Visit No</th>
                    <th>Visit Date</th>
                    <th>Doctor Name</th>
                    <th>Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData?.previousVisits?.length > 0 ? (
                    patientData.previousVisits.map((visit, index) => (
                      <tr key={index}>
                        <td>{visit.serialNo || index + 1}</td>
                        <td>
                          <span
                            onClick={() => showVisitDetail(visit.visitNo)}
                            style={{
                              cursor: 'pointer',
                              color: '#007bff',
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            {visit.visitNo}
                          </span>
                        </td>
                        <td>{formatDate(visit.visitDate)}</td>
                        <td>{visit.doctorName}</td>
                        <td>{visit.advice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No previous visits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDetails;
