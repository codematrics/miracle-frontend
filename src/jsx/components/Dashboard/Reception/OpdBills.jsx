import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';

import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';

import { PATIENT_TYPES, PAYMENT_MODES, PRIORITY } from '../../../../constants/enums';
import { fetchServices, transformServicesForSelect } from '../../../../services/ServicesService';
import { useGetDoctorsDropdownQuery } from '../../../../store/api/doctorsApi';
import FormField from './components/FormField';
import { initialOpdBillValues, opdBillSchema } from './schemas/opdBillValidation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OpdBills = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchPatientValue, setSearchPatientValue] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0.0);
  const [discountValue, setDiscountValue] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [patientOptions, setPatientOptions] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesSearch, setServicesSearch] = useState('');
  // Fetch doctors dropdown data
  const { data: doctorsData, isLoading: doctorsLoading } = useGetDoctorsDropdownQuery();

  // Transform doctors data for select options
  const getDoctorOptions = () => {
    if (!doctorsData?.data) return [];

    const options = doctorsData.data.map(doctor => ({
      value: doctor.value,
      label: doctor.nameWithSpecialization || doctor.label,
      name: doctor.name,
      employeeId: doctor.employeeId,
      specialization: doctor.specialization,
      department: doctor.department,
      consultationFee: doctor.consultationFee,
    }));

    return [...options];
  };

  // Get selected doctor data
  const getSelectedDoctor = doctorValue => {
    if (!doctorValue || !doctorsData?.data) return null;
    return doctorsData.data.find(doctor => doctor.value === doctorValue);
  };

  // Form reference for reset
  const formikRef = useRef(null);

  // Reset form completely
  const resetFormData = () => {
    setSelectedPatient('');
    setSearchPatientValue(null);
    setSelectedServices([]);
    setSelectedOption(null);
    setDiscountPercent(0.0);
    setDiscountValue(0);
    setGrandTotal(0);
    setPaidAmount(0);
    setBalanceAmount(0);
    setServicesOptions([]);
    setServicesSearch('');
    // Reset Formik form
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  // Fetch patients from API
  const getPatientOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/patients/dropdown-data`);
      if (response.data.success) {
        setPatientOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient options:', error);
      toast.error('Failed to load patients', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
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

  const handleSearchPatient = cSelectedOption => {
    if (cSelectedOption) {
      if (selectedPatient) {
        setSelectedPatient([]);
      }
      setSelectedPatient(cSelectedOption); // Store the selected patient object
      setSearchPatientValue(null); //
    }
  };

  const handleAddService = aSelectedOption => {
    if (aSelectedOption && !selectedServices.some(service => service.id === aSelectedOption.id)) {
      setSelectedServices(prev => [...prev, { ...aSelectedOption, qty: 1 }]);
      handleGrandTotal();
    }
    setSelectedOption(null); // Clear the selected option
  };

  const handleRemoveService = serviceToRemove => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceToRemove.id));
  };

  const handleQtyChange = (service, newQty) => {
    // Validate quantity - must be positive integer
    const numericQty = parseInt(newQty, 10);
    if (isNaN(numericQty) || numericQty < 1) {
      toast.error('Quantity must be a positive number greater than 0');
      return;
    }

    const updatedServices = selectedServices.map(s => {
      if (s.id === service.id) {
        return { ...s, qty: numericQty };
      }
      return s;
    });
    setSelectedServices(updatedServices);
  };

  const handleRateChange = (service, newRate) => {
    // Validate rate - must be positive number
    const numericRate = parseFloat(newRate);
    if (isNaN(numericRate) || numericRate < 0) {
      toast.error('Rate must be a positive number');
      return;
    }

    const updatedServices = selectedServices.map(s => {
      if (s.id === service.id) {
        return { ...s, rate: numericRate };
      }
      return s;
    });
    setSelectedServices(updatedServices);
  };

  const handleGrandTotal = () => {
    var gTotal = selectedServices.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);

    setGrandTotal(parseFloat(gTotal));
    setDiscountPercent(0);
    setDiscountValue(0);

    setPaidAmount(parseFloat(gTotal));
    setBalanceAmount(0);
    // console.log(gTotal);
  };

  const handleDiscount = (value, type) => {
    if (type === 1) {
      const discountAmount = (grandTotal * value) / 100;
      setDiscountPercent(value);
      setPaidAmount(grandTotal - discountAmount);
      setDiscountValue(discountAmount);
      setBalanceAmount(0);
    } else if (type === 2) {
      const discountPercent = ((value * 100) / grandTotal).toFixed(2);
      setDiscountPercent(discountPercent);
      setDiscountValue(value);
      setPaidAmount(grandTotal - value);
      setBalanceAmount(0);
    } else {
      setDiscountPercent(0);
      setDiscountValue(0);
      setPaidAmount(grandTotal);
      setBalanceAmount(0);
    }
  };

  const handlePaidAmount = value => {
    const numericValue = parseFloat(value) || 0;
    const totalAfterDiscount = parseFloat(grandTotal) - parseFloat(discountValue || 0);

    if (value === '' || numericValue === 0) {
      setPaidAmount(0);
      return;
    }

    if (numericValue > totalAfterDiscount) {
      alert(`Paid amount cannot exceed total after discount (${totalAfterDiscount})`);
      return;
    }

    setPaidAmount(numericValue);
    setBalanceAmount(totalAfterDiscount - numericValue); // Calculate balance amount
  };

  const handleSaveOpdBill = async (values, { setSubmitting, resetForm }) => {
    try {
      // Validate required fields
      if (!selectedPatient) {
        toast.error('Please select a patient');
        return;
      }

      if (selectedServices.length === 0) {
        toast.error('Please select at least one service');
        return;
      }

      // Get selected doctor details and validate
      const selectedDoctor = getSelectedDoctor(values.consultantDoctor);
      if (!selectedDoctor?.employeeId) {
        toast.error('Please select a valid consultant doctor');
        return;
      }

      // Validate patient info completeness
      if (!selectedPatient.mobileno || selectedPatient.mobileno.length < 10) {
        toast.error('Patient mobile number must be at least 10 characters');
        return;
      }

      if (!selectedPatient.age || selectedPatient.age < 1) {
        toast.error('Patient age must be at least 1');
        return;
      }

      // Calculate totals and validate billing
      const servicesTotal = selectedServices.reduce(
        (total, service) => total + service.qty * service.rate,
        0
      );
      const discountAmount = discountValue || (servicesTotal * discountPercent) / 100;
      const calculatedGrandTotal = servicesTotal - discountAmount;
      const calculatedBalance = calculatedGrandTotal - paidAmount;

      // Prepare OPD bill data according to API requirements
      const submitData = {
        // Required fields
        patientId: selectedPatient.id || selectedPatient.value,
        patientInfo: {
          uhid: selectedPatient.UHID || selectedPatient.uhid || selectedPatient.value,
          name: selectedPatient.label,
          fatherOrHusbandName: selectedPatient.fathername || 'N/A',
          mobileNo: selectedPatient.mobileno,
          age: parseInt(selectedPatient.age) || 0,
          gender:
            selectedPatient.gender === 'M'
              ? 'Male'
              : selectedPatient.gender === 'F'
                ? 'Female'
                : selectedPatient.gender || 'Other',
        },
        patientCategory: selectedPatient?.patientType || PATIENT_TYPES.GENERAL,
        refby: values.refby,
        doctorId: selectedDoctor.employeeId,
        services: selectedServices.map(service => ({
          serviceId: service.id,
          serviceName: service.label,
          serviceCode: service.code,
          rate: parseFloat(service.rate) || 0,
          quantity: parseInt(service.qty) || 1,
          amount: parseFloat(service.qty * service.rate) || 0,
        })),
        billing: {
          grandTotal: parseFloat(calculatedGrandTotal) || 0,
          discountPercent: parseFloat(discountPercent) || 0,
          discountValue: parseFloat(discountValue) || 0,
          paidAmount: parseFloat(paidAmount) || 0,
          balanceAmount: parseFloat(calculatedBalance) || 0,
        },

        // Optional fields (only include if not default values)
        ...(values.priority &&
          values.priority !== PRIORITY.NORMAL && { priority: values.priority.toLowerCase() }),
        ...(values.paymentMode && { paymentMode: values.paymentMode.toLowerCase() }),
      };

      console.log('Submitting OPD bill data:', submitData); // Debug log

      const response = await axios.post(`${API_URL}/opd-billing`, submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'OPD Bill created successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form completely
        resetForm();
        resetFormData();
      }
    } catch (error) {
      console.error('Error creating OPD bill:', error);

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

  // use effect
  useEffect(() => {
    getPatientOptions();
    loadServices(); // Load services when component mounts
  }, [loadServices]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      handleGrandTotal();
    }
  }, [selectedServices]);

  return (
    <Formik
      ref={formikRef}
      initialValues={initialOpdBillValues}
      validationSchema={opdBillSchema}
      onSubmit={handleSaveOpdBill}
      enableReinitialize={true}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          {/* Patient Selection Section */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3">
                <i className="fa fa-user me-2 text-primary"></i>Patient Selection
              </h5>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <label className="text-black font-w500 mb-2">
                  Search Patient <span className="text-danger">*</span>
                </label>
                <Select
                  isClearable
                  className="plugins-select-feild"
                  isSearchable
                  name="searchPatient"
                  placeholder="Search and select a patient..."
                  value={searchPatientValue}
                  options={patientOptions}
                  onChange={handleSearchPatient}
                  noOptionsMessage={() => 'No patients found. Try adjusting your search.'}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500 mb-2">Patient Category</label>
                <select
                  name="patientCategory"
                  className="form-control text-black"
                  value={selectedPatient ? selectedPatient.patientType : ''}
                  disabled
                >
                  <option value="">Select Category</option>
                  <option value={PATIENT_TYPES.GENERAL}>General</option>
                  <option value={PATIENT_TYPES.VIP}>Ayushman</option>
                  <option value={PATIENT_TYPES.STAFF}>TPA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Information Display */}
          {selectedPatient && (
            <div className="row mb-3">
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
                            {selectedPatient.UHID || selectedPatient.value}
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
                      <div className="col-lg-2 col-md-6 mb-2">
                        <div className="d-flex">
                          <strong className="me-1 text-nowrap">Mobile:</strong>
                          <span className="text-nowrap">{selectedPatient.mobileno}</span>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 mb-2">
                        <div className="d-flex">
                          <strong className="me-1 text-nowrap">Father/Husband:</strong>
                          <span className="text-truncate" title={selectedPatient.fathername}>
                            {selectedPatient.fathername}
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 mb-2">
                        <div className="d-flex">
                          <strong className="me-1 text-nowrap">Age/Gender:</strong>
                          <span>
                            {selectedPatient.age}/{selectedPatient.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visit Details Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="fa fa-clipboard me-2 text-success"></i>Visit Details
                  </h6>
                  <div className="row">
                    <FormField
                      name="refby"
                      label="Referred By"
                      type="select"
                      required
                      className="col-md-6"
                      options={[{ value: 'Self', label: 'Self' }]}
                      hideEmptyOption={true}
                    />
                    <FormField
                      name="consultantDoctor"
                      label="Consultant Doctor"
                      type="select"
                      required
                      className="col-md-6"
                      options={getDoctorOptions()}
                      disabled={doctorsLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="fa fa-medical-bag me-2 text-warning"></i>Services{' '}
                    <span className="text-danger">*</span>
                  </h6>
                  <div className="row">
                    <div className="col-md-9">
                      <div className="form-group">
                        <label className="text-black font-w500 mb-2">Search and Add Services</label>
                        <Select
                          isClearable
                          className="plugins-select-feild"
                          isSearchable
                          name="searchservices"
                          options={servicesOptions}
                          isLoading={servicesLoading}
                          placeholder="Type to search services..."
                          onInputChange={handleServicesSearch}
                          noOptionsMessage={({ inputValue }) =>
                            inputValue
                              ? `No services found for "${inputValue}"`
                              : 'Start typing to search services'
                          }
                          loadingMessage={() => 'Loading services...'}
                          value={selectedOption}
                          onChange={handleAddService}
                        />
                        <small className="text-muted mt-1">
                          <i className="fa fa-info-circle me-1"></i>
                          Search and select services to add to this bill
                        </small>
                      </div>
                    </div>
                    <FormField
                      name="priority"
                      label="Priority"
                      type="select"
                      required
                      className="col-md-3"
                      options={[
                        { value: PRIORITY.NORMAL, label: 'Normal' },
                        { value: PRIORITY.STAT, label: 'Stat' },
                        { value: PRIORITY.URGENT, label: 'Urgent' },
                      ]}
                      hideEmptyOption={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Services Table */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="fa fa-list me-2 text-primary"></i>Selected Services
                    {selectedServices.length > 0 && (
                      <span className="badge bg-primary ms-2">{selectedServices.length}</span>
                    )}
                  </h6>
                  {selectedServices.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      <i className="fa fa-info-circle me-2"></i>
                      <strong>No services selected yet.</strong> Please search and add services from
                      above.
                    </div>
                  ) : (
                    <Table responsive={true} className="text-black mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Service Code</th>
                          <th>Service Name</th>
                          <th width="80">Qty</th>
                          <th width="100">Price</th>
                          <th width="100">Amount</th>
                          <th width="80" className="text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedServices.map((service, index) => (
                          <tr key={index}>
                            <td>{service.code}</td>
                            <td>{service.label}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '80px', color: 'black' }}
                                min="1"
                                step="1"
                                value={service.qty}
                                onChange={e => handleQtyChange(service, e.target.value)}
                                onBlur={e => {
                                  // Ensure value is at least 1 on blur
                                  if (!e.target.value || parseInt(e.target.value) < 1) {
                                    handleQtyChange(service, '1');
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '100px', color: 'black' }}
                                min="0"
                                step="0.01"
                                readOnly={!service.isEditable}
                                value={service.rate}
                                onChange={e => handleRateChange(service, e.target.value)}
                                onBlur={e => {
                                  // Ensure value is not negative on blur
                                  if (parseFloat(e.target.value) < 0) {
                                    handleRateChange(service, '0');
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <strong className="text-success">
                                ₹{(service.qty * service.rate).toLocaleString()}
                              </strong>
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveService(service)}
                                className="btn btn-sm btn-outline-danger"
                                title="Remove service"
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="fa fa-calculator me-2 text-info"></i>Billing Details
                  </h6>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="text-black font-w500">Grand Total</label>
                        <input
                          type="text"
                          style={{ width: '100px' }}
                          readOnly
                          className="form-control form-control-sm text-black"
                          value={selectedServices.reduce(
                            (acc, curr) => acc + curr.qty * curr.rate,
                            0
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="text-black font-w500">Discount</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control form-control-sm text-black"
                            style={{ width: '40px' }}
                            value={discountPercent}
                            onChange={e => handleDiscount(e.target.value, 1)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text text-black">%</span>
                          </div>
                          <input
                            type="number"
                            className="form-control form-control-sm text-black"
                            style={{ width: '40px' }}
                            value={discountValue}
                            onChange={e => handleDiscount(e.target.value, 2)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="text-black font-w500">
                          Paid<span className="danger">*</span>
                        </label>
                        <Field
                          type="number"
                          name="paidAmount"
                          className="form-control form-control-sm text-black"
                          style={{ width: '90px' }}
                          value={paidAmount}
                          onChange={e => {
                            const value = e.target.value;
                            setFieldValue('paidAmount', value);
                            handlePaidAmount(value);
                          }}
                        />
                        <ErrorMessage name="paidAmount" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label className="text-black font-w500">Balance</label>
                        <input
                          type="number"
                          className="form-control form-control-sm text-black"
                          style={{ width: '80px' }}
                          readOnly
                          value={balanceAmount}
                        />
                      </div>
                    </div>
                    <FormField
                      name="paymentMode"
                      label="Payment Mode"
                      type="select"
                      required
                      className="col-md-2"
                      options={[
                        { value: PAYMENT_MODES.CASH, label: 'Cash' },
                        { value: PAYMENT_MODES.CARD, label: 'Card' },
                        { value: PAYMENT_MODES.UPI, label: 'UPI' },
                      ]}
                      hideEmptyOption={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-4">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group d-flex gap-2">
                <Button
                  type="button"
                  variant="secondary btn-sm"
                  onClick={resetFormData}
                  disabled={isSubmitting}
                >
                  <i className="fa fa-refresh me-1"></i>Reset
                </Button>
                <Button type="submit" variant="primary btn-sm" disabled={isSubmitting}>
                  <i className="fa fa-save me-1"></i>
                  {isSubmitting ? 'Saving...' : 'Save Bill'}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OpdBills;
