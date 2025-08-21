import { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';

import axios from 'axios';
import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';

import { fetchServices, transformServicesForSelect } from '../../../../services/ServicesService';
import { useGetDoctorsDropdownQuery } from '../../../../store/api/doctorsApi';
import FormField from './components/FormField';
import { initialVisitValues, visitSchema } from './schemas/visitValidation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateVisitModal = ({ show, onHide, onVisitCreated }) => {
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesSearch, setServicesSearch] = useState('');

  // Fetch doctors dropdown data
  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetDoctorsDropdownQuery();

  // Form reference for reset
  const formikRef = useRef(null);

  // Transform doctors data for select options
  const getDoctorOptions = () => {
    if (!doctorsData?.data) return [{ value: '', label: 'Select Doctor' }];

    const options = doctorsData.data.map(doctor => ({
      value: doctor.value,
      label: doctor.nameWithSpecialization || doctor.label,
      name: doctor.name,
      employeeId: doctor.employeeId,
      specialization: doctor.specialization,
      department: doctor.department,
      consultationFee: doctor.consultationFee,
    }));

    return [{ value: '', label: 'Select Doctor' }, ...options];
  };

  // Get selected doctor data
  const getSelectedDoctor = doctorValue => {
    if (!doctorValue || !doctorsData?.data) return null;
    return doctorsData.data.find(doctor => doctor.value === doctorValue);
  };

  const getRefByOptions = () => {
    return [{ value: 'Self', label: 'Self' }];
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Validate patient selection
      if (!selectedPatient) {
        toast.error('Please select a patient');
        return;
      }

      // Validate services selection (minimum 1, maximum 20)
      if (selectedServices.length === 0) {
        toast.error('Please select at least one service');
        return;
      }
      if (selectedServices.length > 20) {
        toast.error('Maximum 20 services allowed per visit');
        return;
      }

      // Get selected doctor details and validate
      const selectedDoctor = getSelectedDoctor(values.visitingdoctor);
      if (!selectedDoctor?.employeeId) {
        toast.error('Please select a valid doctor');
        return;
      }

      // Prepare visit data according to backend API requirements
      const submitData = {
        // Required fields
        doctorId: selectedDoctor.employeeId, // Doctor's employeeId (1-20 chars)
        refby: values.refby, // Referral source (1-100 chars)
        visittype: values.visittype, // Visit type (1-50 chars)
        mediclaim_type: values.mediclaim_type, // Mediclaim type (1-50 chars)
        services: selectedServices.map(service => ({
          serviceId: service.id, // Valid MongoDB ObjectId
          serviceName: service.label, // 1-100 characters
          serviceCode: service.code, // 1-20 characters
          rate: Number(service.rate) || 0, // Number (0-999999, cannot be negative)
        })),

        // Optional fields
        ...(selectedPatient && { patientId: selectedPatient.id || selectedPatient.value }),
        ...(values.medicolegal && { medicolegal: values.medicolegal }),
        ...(values.visitdetail && { visitdetail: values.visitdetail }),
        ...(values.mediclaim_id && { mediclaim_id: values.mediclaim_id }),
      };

      console.log('Submitting visit data:', submitData); // Debug log

      const response = await axios.post(`${API_URL}/visits`, submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
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
        setSearchPatient('');
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

  const getPatientOptions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients/dropdown-data`);
      if (response.data.success) {
        setPatientOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient options:', error);
    }
  };

  const handleSearchPatient = selectedOption => {
    setSelectedPatient(selectedOption);
    setSearchPatient(selectedOption);
  };

  const handleAddService = aSelectedOption => {
    if (aSelectedOption && !selectedServices.some(service => service.id === aSelectedOption.id)) {
      setSelectedServices([...selectedServices, aSelectedOption]);
    }
    setSelectedOption(null); // Clear the selected option
  };

  const handleRemoveService = serviceToRemove => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceToRemove.id));
  };

  // Fetch services from API
  const loadServices = useCallback(async (searchQuery = '') => {
    setServicesLoading(true);
    try {
      const response = await fetchServices(searchQuery);
      if (response.success) {
        const transformedServices = transformServicesForSelect(response.data);
        setServicesOptions(transformedServices);
      } else {
        toast.error('Failed to load services', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Error loading services. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Handle services search with debouncing
  const handleServicesSearch = useCallback(
    inputValue => {
      setServicesSearch(inputValue);

      // Debounce search
      const timeoutId = setTimeout(() => {
        loadServices(inputValue);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [loadServices]
  );

  // Calculate total amount
  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + (service.rate || 0), 0);
  };

  useEffect(() => {
    getPatientOptions();
    loadServices(); // Load services when modal opens
  }, [loadServices]);

  // Reset form completely when modal closes
  const resetFormData = () => {
    setSelectedPatient(null);
    setSearchPatient('');
    setSelectedServices([]);
    setSelectedOption(null);
    setServicesOptions([]);
    setServicesSearch('');
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
        {({ isSubmitting }) => (
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
                    <Select
                      isClearable
                      className="plugins-select-feild"
                      isSearchable
                      name="searchPatient"
                      placeholder="Search and select a patient..."
                      value={searchPatient}
                      options={patientOptions}
                      onChange={handleSearchPatient}
                      noOptionsMessage={() => 'No patients found. Try adjusting your search.'}
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
                              <span className="text-truncate">
                                {selectedPatient.uhid || selectedPatient.value}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Name:</strong>
                              <span className="text-truncate" title={selectedPatient.label}>
                                {selectedPatient.label}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-2">
                            <div className="d-flex">
                              <strong className="me-1 text-nowrap">Mobile:</strong>
                              <span className="text-nowrap">{selectedPatient.mobileno}</span>
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

                <FormField
                  name="visitingdoctor"
                  label="Visiting Doctor"
                  type="select"
                  required
                  className="col-md-4"
                  options={getDoctorOptions()}
                  disabled={doctorsLoading}
                />

                <FormField
                  name="visittype"
                  label="Visit Type"
                  type="select"
                  required
                  className="col-md-4"
                  options={[
                    { value: '', label: 'Select Visit Type' },
                    { value: 'OPD', label: 'OPD' },
                    { value: 'IPD', label: 'IPD' },
                    { value: 'Emergency', label: 'Emergency' },
                    { value: 'Consultation', label: 'Consultation' },
                  ]}
                />

                <FormField
                  name="refby"
                  label="Referred By"
                  type="select"
                  required
                  className="col-md-4"
                  options={getRefByOptions()}
                  disabled={doctorsLoading}
                  hideEmptyOption={true}
                />

                <FormField
                  name="visitdetail"
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
                  name="medicolegal"
                  label="Medico Legal (MLC)"
                  type="radio"
                  required
                  className="col-md-4"
                  options={['No', 'Yes']}
                />

                <FormField
                  name="mediclaim_type"
                  label="Insurance Type"
                  type="select"
                  required
                  className="col-md-4"
                  options={[
                    { value: '', label: 'Select Insurance Type' },
                    { value: 'Self', label: 'Self Payment' },
                    { value: 'Ayushman', label: 'Ayushman Bharat' },
                    { value: 'Insurance', label: 'Private Insurance' },
                    { value: 'Corporate', label: 'Corporate Insurance' },
                  ]}
                />

                <FormField
                  name="mediclaim_id"
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
                    <Select
                      isClearable
                      className="plugins-select-feild"
                      isSearchable
                      isLoading={servicesLoading}
                      name="searchservices"
                      placeholder="Search and add services for this visit..."
                      options={servicesOptions}
                      value={selectedOption}
                      onChange={handleAddService}
                      onInputChange={handleServicesSearch}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `No services found for "${inputValue}"`
                          : 'Start typing to search services'
                      }
                      loadingMessage={() => 'Loading services...'}
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
                            <th className="text-center" width="80">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedServices.map((service, index) => (
                            <tr key={service.id || index}>
                              <td>
                                <div>
                                  <strong>{service.label}</strong>
                                  <br />
                                  <small className="text-muted">{service.code}</small>
                                </div>
                              </td>
                              <td className="text-end">
                                <strong className="text-success">
                                  ₹{service.rate?.toLocaleString() || '0'}
                                </strong>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveService(service)}
                                  className="btn btn-sm btn-outline-danger"
                                  title="Remove service"
                                >
                                  <i className="fa fa-times" />
                                </button>
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
