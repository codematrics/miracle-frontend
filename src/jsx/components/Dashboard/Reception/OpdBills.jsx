import { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';

import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';

import { PATIENT_TYPES, PAYMENT_MODES, PRIORITY } from '../../../../constants/enums';
import { fetchServices, transformServicesForSelect } from '../../../../services/ServicesService';
import FormField from './components/FormField';
import FormRow from './components/FormRow';
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
  const [doctorOptions, setDoctorOptions] = useState([]);

  // Initialize doctor options (can be replaced with API call later)\n  const initializeDoctorOptions = () => {\n    const doctors = [\n      { value: '', label: 'Select Doctor' },\n      { value: '1', label: 'Dr. Kailash Garg' },\n      { value: '2', label: 'Dr. Manohar Menariya' },\n      { value: '3', label: 'Dr. Vishal Khutwal' },\n    ];\n    setDoctorOptions(doctors);\n  };\n\n  // Fetch patients from API
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
    const updatedServices = selectedServices.map(s => {
      if (s.id === service.id) {
        return { ...s, qty: newQty };
      }
      return s;
    });
    setSelectedServices(updatedServices);
  };

  const handleRateChange = (service, newRate) => {
    const updatedServices = selectedServices.map(s => {
      if (s.id === service.id) {
        return { ...s, rate: newRate };
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
        toast.error('Please select a patient', {
          position: 'top-right',
          autoClose: 5000,
        });
        return;
      }

      if (selectedServices.length === 0) {
        toast.error('Please select at least one service', {
          position: 'top-right',
          autoClose: 5000,
        });
        return;
      }

      // Prepare OPD bill data
      const submitData = {
        patientId: selectedPatient.id || selectedPatient.value,
        patientCategory: selectedPatient?.patientType || PATIENT_TYPES.GENERAL,
        patientInfo: {
          uhid: selectedPatient.UHID || selectedPatient.value,
          name: selectedPatient.label,
          fatherOrHusbandName: selectedPatient.fathername,
          mobileNo: selectedPatient.mobileno,
          age: selectedPatient.age,
          gender:
            selectedPatient.gender === 'M'
              ? 'Male'
              : selectedPatient.gender === 'F'
                ? 'Female'
                : 'Other',
        },
        ...values,
        services: selectedServices.map(service => ({
          serviceId: service.id,
          serviceName: service.label,
          serviceCode: service.code,
          rate: service.rate,
          quantity: service.qty,
          amount: service.qty * service.rate,
        })),
        billing: {
          grandTotal,
          discountPercent,
          discountValue,
          paidAmount,
          balanceAmount,
        },
      };

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

        // Reset form
        resetForm();
        setSelectedPatient('');
        setSelectedServices([]);
        setDiscountPercent(0);
        setDiscountValue(0);
        setGrandTotal(0);
        setPaidAmount(0);
        setBalanceAmount(0);
      }
    } catch (error) {
      console.error('Error creating OPD bill:', error);

      // Handle validation errors from backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;

        if (validationErrors.length > 0) {
          const firstError = validationErrors[0];
          toast.error(`${firstError.message}`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        const errorMessage =
          error.response?.data?.message || 'Failed to create OPD bill. Please try again.';

        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
      initialValues={initialOpdBillValues}
      validationSchema={opdBillSchema}
      onSubmit={handleSaveOpdBill}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="text-black font-w500">Search Patient</label>
                <Select
                  isClearable
                  className="plugins-select-feild"
                  isSearchable
                  name="searchPatient"
                  id="searchPatient"
                  value={searchPatientValue}
                  options={patientOptions}
                  onChange={handleSearchPatient}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="text-black">Patient Category</label>
              <select
                name="patientCategory"
                label="Patient Category"
                type="select"
                required
                className="form-control text-black"
                value={selectedPatient ? selectedPatient.patientType : ''}
              >
                {[
                  { value: '', label: 'Category' },
                  { value: PATIENT_TYPES.GENERAL, label: 'General' },
                  { value: PATIENT_TYPES.VIP, label: 'Ayushman' },
                  { value: PATIENT_TYPES.STAFF, label: 'TPA' },
                ].map(data => (
                  <option key={data.value} value={data.value}>
                    {data.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 form-group">
              <label className="text-black">UHID No </label>
              <input
                type="text"
                readOnly
                className="form-control form-control-sm text-black"
                value={selectedPatient ? selectedPatient.UHID : ''}
              />
            </div>
            <div className="col-md-3 form-group">
              <label className="text-black">Patient Name </label>
              <input
                type="text"
                readOnly
                className="form-control form-control-sm text-black"
                value={selectedPatient ? selectedPatient.label : ''}
              />
            </div>
            <div className="col-md-3 form-group">
              <label className="text-black">Father/Husband</label>
              <input
                type="text"
                readOnly
                className="form-control form-control-sm text-black"
                value={selectedPatient ? selectedPatient.fathername : ''}
              />
            </div>
            <div className="col-md-2 form-group">
              <label className="text-black">Mobile No </label>
              <input
                type="text"
                readOnly
                className="form-control form-control-sm text-black"
                value={selectedPatient ? selectedPatient.mobileno : ''}
              />
            </div>
            <div className="col-md-2 form-group">
              <label className="text-black">Sex/Age</label>
              <input
                type="text"
                readOnly
                className="form-control form-control-sm text-black"
                value={
                  selectedPatient
                    ? `${selectedPatient.gender ? selectedPatient.gender : ''}/${selectedPatient.age ? selectedPatient.age : ''}`
                    : ''
                }
              />
            </div>
          </div>

          <FormRow className="row">
            <FormField
              name="refby"
              label="Ref By"
              type="select"
              required
              className="col-md-3"
              options={[{ value: '1', label: 'Self' }]}
            />
            <FormField
              name="consultantDoctor"
              label="Consultant Doctor"
              type="select"
              required
              className="col-md-3"
              options={[
                { value: 'Dr. Kailash Garg', label: 'Dr. Kailash Garg' },
                { value: 'Dr. Manohar Menariya', label: 'Dr. Manohar Menariya' },
                { value: 'Dr. Vishal Khutwal', label: 'Dr. Vishal Khutwal' },
              ]}
            />
          </FormRow>

          <div className="row">
            <div className="col-md-10 col-sm-10">
              <div className="form-group">
                <label className="text-black font-w500">Search Service</label>
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
              </div>
            </div>
            <FormField
              name="priority"
              label="Priority"
              type="select"
              required
              className="col-md-2"
              options={[
                { value: PRIORITY.NORMAL, label: 'Normal' },
                { value: PRIORITY.STAT, label: 'Stat' },
                { value: PRIORITY.URGENT, label: 'Urgent' },
              ]}
            />
          </div>

          <div className="row">
            <div className="col-md-11 selected-services">
              <Table responsive={true} className="text-black">
                <thead>
                  <tr>
                    <th>Service Code</th>
                    <th>Service Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amt</th>
                    <th>Action</th>
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
                          value={service.qty}
                          onChange={e => handleQtyChange(service, e.target.value, 'qty')}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ width: '100px', color: 'black' }}
                          readOnly={!service.isEditable}
                          value={service.rate}
                          onChange={e => handleRateChange(service, e.target.value, 'rate')}
                        />
                      </td>
                      <td>{service.qty * service.rate}</td>
                      <td>
                        {
                          <button
                            onClick={() => handleRemoveService(service)}
                            className="btn btn-sm"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <label className="text-black font-w500">Grand Total</label>
                <input
                  type="text"
                  style={{ width: '100px' }}
                  readOnly
                  className="form-control form-control-sm text-black"
                  value={selectedServices.reduce((acc, curr) => acc + curr.qty * curr.rate, 0)}
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
            />
          </div>

          <div className="row">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <div className="form-group">
                <Button type="submit" variant="primary btn-sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
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
