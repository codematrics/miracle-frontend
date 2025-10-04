import { Button, Modal } from 'react-bootstrap';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { DOCTOR_DEPARTMENTS, DOCTOR_SPECIALIZATION } from '../../../../../constants/enums';
import FormField from '../../Reception/components/FormField';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DoctorValidationSchema = Yup.object().shape({
  _id: Yup.string().optional(),
  name: Yup.string().required('Doctor name is required'),
  specialization: Yup.string().required('Specialization is required'),
  qualification: Yup.string().optional(),
  licenseNumber: Yup.string().required('License number is required'),
  department: Yup.string().required('Department is required'),
  designation: Yup.string().optional(),
  joiningDate: Yup.date().required('Joining date is required'),
  email: Yup.string().email('Invalid email').required('Email id is required'),
  mobileNo: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  emergencyContact: Yup.string()
    .matches(/^\d{10}$/, 'Emergency contact must be 10 digits')
    .required('Emergency contact is required'),
  streetAddress: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
  country: Yup.string().required('Country is required'),
  availableDays: Yup.array()
    .of(Yup.string().oneOf(weekDays))
    .required('Select at least one available day'),
  isActive: Yup.boolean().required(),
  password: Yup.string().required(),
});

const DoctorForm = ({ show, onHide, onSubmit, loading, initialData = null }) => {
  const initialValues = initialData || {
    _id: '',
    name: '',
    specialization: '',
    qualification: '',
    licenseNumber: '',
    department: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    email: '',
    mobileNo: '',
    emergencyContact: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    availableDays: [],
    isActive: true,
    password: '',
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Doctor' : 'Add New Doctor'}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={DoctorValidationSchema}
        onSubmit={values => onSubmit(values)}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <h6 className="mb-3">Basic Information</h6>
              <div className="row">
                <FormField name="name" label="Doctor Name" required />
                <FormField
                  name="specialization"
                  label="Specialization"
                  type="select"
                  options={DOCTOR_SPECIALIZATION}
                  required
                />
                <FormField name="qualification" label="Qualification" />
              </div>

              <div className="row mt-3">
                <FormField name="licenseNumber" label="License Number" required />
                <FormField
                  name="department"
                  label="Department"
                  type="select"
                  options={DOCTOR_DEPARTMENTS}
                  required
                />
                <FormField name="designation" label="Designation" />
              </div>

              <h6 className="mt-4 mb-3">Contact Information</h6>
              <div className="row">
                <FormField name="email" label="Email" type="email" />
                <FormField name="mobileNo" label="Mobile Number" required />
                <FormField name="emergencyContact" label="Emergency Contact" required />
              </div>

              <h6 className="mt-4 mb-3">Address</h6>
              <div className="row">
                <FormField name="streetAddress" label="Street Address" required />
                <FormField name="city" label="City" required />
                <FormField name="state" label="State" required />
              </div>
              <div className="row mt-3">
                <FormField name="pincode" label="Pincode" required />
                <FormField name="country" label="Country" required />
                <FormField name="joiningDate" label="Joining Date" type="date" required />
              </div>

              <h6 className="mt-4 mb-3">Available Days *</h6>
              <div className="d-flex flex-wrap gap-3">
                {weekDays.map(day => (
                  <div key={day} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`day-${day}`}
                      checked={values?.availableDays?.includes(day)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFieldValue('availableDays', [...values.availableDays, day]);
                        } else {
                          setFieldValue(
                            'availableDays',
                            values.availableDays?.filter(d => d !== day)
                          );
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={`day-${day}`}>
                      {day}
                    </label>
                  </div>
                ))}
              </div>

              <FormField
                name="consultationTiming"
                label="Consultation Timing"
                placeholder="e.g., 10:00-14:00"
                required
              />

              <FormField name="password" label="Password" required />

              <div className="mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={values.isActive}
                  onChange={e => setFieldValue('isActive', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active Doctor
                </label>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : initialData ? 'Update Doctor' : 'Create Doctor'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default DoctorForm;
