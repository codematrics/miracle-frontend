import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import AddressForm from './AddressForm';
import ConsultationTimingForm from './ConsultationTimingForm';

const DoctorForm = ({ show, onHide, onSubmit, loading, initialData = null }) => {
  const [formData, setFormData] = useState({
    doctorName: initialData?.doctorName || '',
    specialization: initialData?.specialization || '',
    qualification: initialData?.qualification || '',
    licenseNo: initialData?.licenseNo || '',
    email: initialData?.email || '',
    mobileNo: initialData?.mobileNo || '',
    department: initialData?.department || '',
    designation: initialData?.designation || '',
    consultationFee: initialData?.consultationFee || 0,
    emergencyContactNo: initialData?.emergencyContactNo || '',
    address: initialData?.address || {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    joiningDate: initialData?.joiningDate
      ? new Date(initialData.joiningDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    isActive: initialData?.isActive ?? true,
    isConsultant: initialData?.isConsultant ?? true,
    availableDays: initialData?.availableDays || [],
    consultationTimings: initialData?.consultationTimings || {
      morning: { startTime: '', endTime: '' },
      evening: { startTime: '', endTime: '' },
    },
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        doctorName: initialData.doctorName || '',
        specialization: initialData.specialization || '',
        qualification: initialData.qualification || '',
        licenseNo: initialData.licenseNo || '',
        email: initialData.email || '',
        mobileNo: initialData.mobileNo || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        consultationFee: initialData.consultationFee || 0,
        emergencyContactNo: initialData.emergencyContactNo || '',
        address: initialData.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        },
        joiningDate: initialData.joiningDate
          ? new Date(initialData.joiningDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        isActive: initialData.isActive ?? true,
        isConsultant: initialData.isConsultant ?? true,
        availableDays: initialData.availableDays || [],
        consultationTimings: initialData.consultationTimings || {
          morning: { startTime: '', endTime: '' },
          evening: { startTime: '', endTime: '' },
        },
        notes: initialData.notes || '',
      });
    } else {
      // Reset form for new doctor
      setFormData({
        doctorName: '',
        specialization: '',
        qualification: '',
        licenseNo: '',
        email: '',
        mobileNo: '',
        department: '',
        designation: '',
        consultationFee: 0,
        emergencyContactNo: '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        },
        joiningDate: new Date().toISOString().split('T')[0],
        isActive: true,
        isConsultant: true,
        availableDays: [],
        consultationTimings: {
          morning: { startTime: '', endTime: '' },
          evening: { startTime: '', endTime: '' },
        },
        notes: '',
      });
    }
    // Clear any existing errors
    setErrors({});
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleDaysChange = (day, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        availableDays: [...prev.availableDays, day],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availableDays: prev.availableDays.filter(d => d !== day),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.licenseNo.trim()) newErrors.licenseNo = 'License number is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile number validation
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
    }

    // Emergency contact validation
    if (formData.emergencyContactNo && !/^\d{10}$/.test(formData.emergencyContactNo)) {
      newErrors.emergencyContactNo = 'Emergency contact must be 10 digits';
    }

    // Consultation fee validation
    if (formData.consultationFee < 0) {
      newErrors.consultationFee = 'Consultation fee cannot be negative';
    }

    // Pincode validation
    if (formData.address.pincode && !/^\d{6}$/.test(formData.address.pincode)) {
      newErrors.addressPincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      doctorName: '',
      specialization: '',
      qualification: '',
      licenseNo: '',
      email: '',
      mobileNo: '',
      department: '',
      designation: '',
      consultationFee: 0,
      emergencyContactNo: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
      joiningDate: new Date().toISOString().split('T')[0],
      isActive: true,
      isConsultant: true,
      availableDays: [],
      consultationTimings: {
        morning: { startTime: '', endTime: '' },
        evening: { startTime: '', endTime: '' },
      },
      notes: '',
    });
    setErrors({});
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Doctor' : 'Add New Doctor'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Basic Information */}
          <div className="row">
            <div className="col-md-12">
              <h6 className="text-black font-w600 mb-3">Basic Information</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">
                  Doctor Name <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  value={formData.doctorName}
                  onChange={e => handleChange('doctorName', e.target.value)}
                  placeholder="Enter doctor name"
                  style={{ height: '40px' }}
                  isInvalid={!!errors.doctorName}
                />
                <Form.Control.Feedback type="invalid">{errors.doctorName}</Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">
                  Specialization <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  value={formData.specialization}
                  onChange={e => handleChange('specialization', e.target.value)}
                  placeholder="Enter specialization"
                  style={{ height: '40px' }}
                  isInvalid={!!errors.specialization}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.specialization}
                </Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">Qualification</label>
                <Form.Control
                  type="text"
                  value={formData.qualification}
                  onChange={e => handleChange('qualification', e.target.value)}
                  placeholder="e.g., MBBS, MD"
                  style={{ height: '40px' }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">
                  License Number <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  value={formData.licenseNo}
                  onChange={e => handleChange('licenseNo', e.target.value)}
                  placeholder="Enter medical license number"
                  style={{ height: '40px' }}
                  isInvalid={!!errors.licenseNo}
                />
                <Form.Control.Feedback type="invalid">{errors.licenseNo}</Form.Control.Feedback>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black font-w500">
                  Department <span className="text-danger">*</span>
                </label>
                <Form.Select
                  value={formData.department}
                  onChange={e => handleChange('department', e.target.value)}
                  style={{ height: '40px' }}
                  isInvalid={!!errors.department}
                >
                  <option value="">Select Department</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Emergency">Emergency</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black font-w500">Designation</label>
                <Form.Control
                  type="text"
                  value={formData.designation}
                  onChange={e => handleChange('designation', e.target.value)}
                  placeholder="e.g., Senior Consultant"
                  style={{ height: '40px' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black font-w500">Consultation Fee</label>
                <Form.Control
                  type="number"
                  value={formData.consultationFee}
                  onChange={e => handleChange('consultationFee', parseFloat(e.target.value) || 0)}
                  placeholder="Enter fee"
                  style={{ height: '40px' }}
                  min="0"
                  isInvalid={!!errors.consultationFee}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.consultationFee}
                </Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black font-w500">Joining Date</label>
                <Form.Control
                  type="date"
                  value={formData.joiningDate}
                  onChange={e => handleChange('joiningDate', e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="row">
            <div className="col-md-12">
              <h6 className="text-black font-w600 mb-3 mt-3">Contact Information</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">Email</label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  style={{ height: '40px' }}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">Mobile Number</label>
                <Form.Control
                  type="text"
                  value={formData.mobileNo}
                  onChange={e => handleChange('mobileNo', e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  style={{ height: '40px' }}
                  maxLength={10}
                  isInvalid={!!errors.mobileNo}
                />
                <Form.Control.Feedback type="invalid">{errors.mobileNo}</Form.Control.Feedback>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="text-black font-w500">Emergency Contact</label>
                <Form.Control
                  type="text"
                  value={formData.emergencyContactNo}
                  onChange={e => handleChange('emergencyContactNo', e.target.value)}
                  placeholder="Enter emergency contact"
                  style={{ height: '40px' }}
                  maxLength={10}
                  isInvalid={!!errors.emergencyContactNo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.emergencyContactNo}
                </Form.Control.Feedback>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="row">
            <div className="col-md-12">
              <h6 className="text-black font-w600 mb-3 mt-3">Address</h6>
            </div>
          </div>

          <AddressForm
            address={formData.address}
            onAddressChange={address => handleChange('address', address)}
            errors={{
              pincode: errors.addressPincode,
            }}
          />

          {/* Available Days */}
          <div className="row">
            <div className="col-md-12">
              <h6 className="text-black font-w600 mb-3 mt-3">Available Days</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <div className="d-flex flex-wrap gap-3">
                  {weekDays.map(day => (
                    <Form.Check
                      key={day}
                      type="checkbox"
                      id={`day-${day}`}
                      label={day}
                      checked={formData.availableDays.includes(day)}
                      onChange={e => handleDaysChange(day, e.target.checked)}
                      className="text-black"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Timings */}
          <ConsultationTimingForm
            timings={formData.consultationTimings}
            onTimingsChange={timings => handleChange('consultationTimings', timings)}
            errors={{}}
          />

          {/* Additional Options */}
          <div className="row">
            <div className="col-md-12">
              <h6 className="text-black font-w600 mb-3 mt-3">Additional Options</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  label="Active Doctor"
                  checked={formData.isActive}
                  onChange={e => handleChange('isActive', e.target.checked)}
                  className="text-black"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Form.Check
                  type="checkbox"
                  id="isConsultant"
                  label="Available for Consultation"
                  checked={formData.isConsultant}
                  onChange={e => handleChange('isConsultant', e.target.checked)}
                  className="text-black"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="text-black font-w500">Notes</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  placeholder="Enter any additional notes..."
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Doctor' : 'Create Doctor'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DoctorForm;
