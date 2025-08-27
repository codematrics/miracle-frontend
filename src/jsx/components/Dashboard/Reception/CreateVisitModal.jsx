import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import axios from 'axios';
import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import { INSURANCE_TYPE, VISIT_TYPE } from '../../../../constants/enums';
import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import { loadPatientOptions } from '../../../../services/PatientsService';
import { loadServiceOptions } from '../../../../services/ServicesService';
import FormField from './components/FormField';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const visitSchema = Yup.object({
  patientId: Yup.string().required('Patient is required'),
  consultingDoctorId: Yup.string().required('Doctor is required'),
  visitType: Yup.string()
    .oneOf(Object.values(VISIT_TYPE), 'Invalid visit type')
    .required('Visit type is required'),
  referredBy: Yup.string().nullable(),
  visitNote: Yup.string().nullable(),
  medicoLegal: Yup.string().oneOf(['Yes', 'No']),
  insuranceType: Yup.string().nullable(),
  policyNumber: Yup.string().nullable(),
  services: Yup.array().of(Yup.string()).min(1, 'Select at least one service'),
});

export const initialVisitValues = {
  patientId: '',
  consultingDoctorId: '',
  visitType: '',
  referredBy: '',
  visitNote: '',
  medicoLegal: false,
  insuranceType: '',
  policyNumber: '',
  services: [],
};

const CreateVisitModal = ({ show, onHide, onVisitCreated }) => {
  const { loadDoctorOptions } = useDoctorAPI();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Form reference for reset
  const formikRef = useRef(null);

  // Transform doctors data for select options

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `${API_URL}/visits`,
        { ...values, medicoLegal: values.medicoLegal === 'Yes' ? true : false },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Visit created successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form and close modal
        resetForm();
        setSelectedPatient(null);
        setSelectedServices([]);
        onHide();

        // Callback to parent component
        if (onVisitCreated) {
          onVisitCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating visit:', error);

      // Handle specific backend validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;

        // Handle validation errors array
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0];
          toast.error(firstError.message || firstError.msg || 'Validation error');
        }
        // Handle single error message
        else if (errorData.message) {
          toast.error(errorData.message);
        }
        // Handle field-specific errors
        else if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error('Please check your input and try again');
        }
      }
      // Handle other HTTP errors
      else if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Error ${error.response.status}: ${error.response.statusText}`
        );
      }
      // Handle network errors
      else {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total amount
  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  };

  // Reset form completely when modal closes
  const resetFormData = () => {
    setSelectedPatient(null);
    setSelectedServices([]);
    // Reset Formik form
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  // Handle modal close with form reset
  const handleModalClose = () => {
    resetFormData();
    onHide();
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      resetFormData();
    }
  }, [show]);

  return (
    <Modal
      className="fade"
      show={show}
      onHide={handleModalClose}
      centered={true}
      size="xl"
      backdropClassName={'role'}
      backdrop={'static'}
    >
      <Modal.Header>
        <Modal.Title>Add New Visit</Modal.Title>
        <Button variant="" className="btn-close" onClick={handleModalClose}></Button>
      </Modal.Header>
      <Formik
        ref={formikRef}
        initialValues={initialVisitValues}
        validationSchema={visitSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors, values }) => (
          <Form>
            <Modal.Body>
              {/* Patient Selection */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-black font-w500 mb-2">
                      <i className="fa fa-user me-2"></i>Select Patient{' '}
                      <span className="text-danger">*</span>
                    </label>
                    <PaginatedSelect
                      name="patientId"
                      loadOptions={loadPatientOptions}
                      selectCallback={option => setSelectedPatient(option)}
                      placeholder="Search patient..."
                      className="mb-2"
                    />
                  </div>
                </div>
              </div>

              {/* Patient Information Display */}
              {selectedPatient && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card bg-light">
                      <div className="card-body py-3">
                        <h6 className="card-title mb-2">
                          <i className="fa fa-info-circle me-2 text-info"></i>Patient Information
                        </h6>
                        <div className="row text-nowrap" style={{ fontSize: '14px' }}>
                          <div className="col-lg-3 col-md-6 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">UHID:</strong>
                              <span className="text-truncate">{selectedPatient.uhidNo}</span>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Name:</strong>
                              <span className="text-truncate" title={selectedPatient.name}>
                                {selectedPatient.name}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Mobile:</strong>
                              <span className="text-nowrap">{selectedPatient.mobileNumber}</span>
                            </div>
                          </div>
                          <div className="col-lg-1 col-md-3 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Age:</strong>
                              <span>{selectedPatient.age}</span>
                            </div>
                          </div>
                          <div className="col-lg-2 col-md-3 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Gender:</strong>
                              <span>{selectedPatient.gender}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visit Details */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3">
                    <i className="fa fa-clipboard me-2 text-primary"></i>Visit Details
                  </h6>
                </div>
                <PaginatedSelect
                  name="consultingDoctorId"
                  label="Visiting Doctor"
                  loadOptions={loadDoctorOptions}
                  placeholder="Search doctor..."
                  className="col-md-4"
                />

                <FormField
                  name="visitType"
                  label="Visit Type"
                  type="select"
                  required
                  className="col-md-4"
                  options={Object.values(VISIT_TYPE).map(value => ({ value, label: value }))}
                />
                <FormField
                  name="referredBy"
                  label="Referred By"
                  type="select"
                  required
                  className="col-md-4"
                  options={[{ value: 'Self', label: 'Self' }]}
                  hideEmptyOption={true}
                />
                <FormField
                  name="visitNote"
                  label="Visit Notes (Optional)"
                  className="col-12"
                  placeholder="Enter any additional notes about this visit..."
                />
              </div>

              {/* Medical & Insurance Details */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3">
                    <i className="fa fa-shield-alt me-2 text-success"></i>Medical & Insurance
                  </h6>
                </div>

                <FormField
                  name="medicoLegal"
                  label="Medico Legal (MLC)"
                  type="radio"
                  required
                  className="col-md-4"
                  options={['No', 'Yes']}
                />

                <FormField
                  name="insuranceType"
                  label="Insurance Type"
                  type="select"
                  required
                  className="col-md-4"
                  options={Object.values(INSURANCE_TYPE).map(value => ({ value, label: value }))}
                />

                <FormField
                  name="policyNumber"
                  label="Policy/Card Number"
                  className="col-md-4"
                  placeholder="Enter policy or card number"
                />
              </div>

              {/* Services Selection */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3">
                    <i className="fa fa-medical-bag me-2 text-warning"></i>Services{' '}
                    <span className="text-danger">*</span>
                  </h6>
                  <div className="form-group">
                    <PaginatedSelect
                      name="services"
                      loadOptions={loadServiceOptions}
                      placeholder="Search services..."
                      selectCallback={option => {
                        setSelectedServices(option);
                      }}
                      className="mb-2"
                      isMulti
                    />
                    <small className="text-muted mt-1">
                      <i className="fa fa-info-circle me-1"></i>
                      Search and select services to add to this visit
                    </small>
                  </div>
                </div>
              </div>

              {/* Selected Services */}
              <div className="selected-services">
                {selectedServices.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    <i className="fa fa-info-circle me-2"></i>
                    <strong>No services selected yet.</strong> Please search and add services from
                    above.
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <i className="fa fa-list me-2"></i>Selected Services (
                        {selectedServices.length})
                      </h6>
                      <div className="text-success">
                        <strong>Total: ₹{getTotalAmount().toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <Table responsive className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Service</th>
                            <th className="text-end">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedServices.map((service, index) => (
                            <tr key={service.id || index}>
                              <td>
                                <div>
                                  <strong>{service.name}</strong>
                                  <br />
                                  <small className="text-muted">{service.code}</small>
                                </div>
                              </td>
                              <td className="text-end">
                                <strong className="text-success">
                                  ₹{service.price?.toLocaleString() || '0'}
                                </strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-danger btn-sm light"
                onClick={handleModalClose}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button type="submit" className="btn btn-sm btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Visit'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateVisitModal;
