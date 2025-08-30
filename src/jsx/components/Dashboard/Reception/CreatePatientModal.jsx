import { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import axios from 'axios';
import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as yup from 'yup';

import {
  GENDER,
  ID_TYPES,
  MARITAL_STATUS,
  OCCUPATIONS,
  PATIENT_TYPES,
  RELATION_TYPES,
  RELIGIONS,
} from '../../../../constants/enums';
import AgeField from './components/AgeField';
import FormField from './components/FormField';
import FormRow from './components/FormRow';

const validationSchema = yup.object().shape({
  name: yup.string().required('Patient Name is required'),
  relation: yup
    .string()
    .oneOf(Object.values(RELATION_TYPES), 'Invalid relation')
    .required('Relation is required'),
  relativeName: yup.string().required('F/H Name is required'),
  age: yup.number().required('Age is required').min(0, 'Age must be a positive number'),
  gender: yup
    .string()
    .oneOf(Object.values(GENDER), 'Invalid gender')
    .required('Gender is required'),
  maritalStatus: yup
    .string()
    .oneOf(Object.values(MARITAL_STATUS), 'Invalid marital status')
    .nullable(), // Optional
  religion: yup.string().nullable(),
  occupation: yup.string().nullable(),
  patientType: yup.string().nullable(),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be 10 digits'),
  email: yup.string().email('Invalid email').nullable(),
  idType: yup
    .string()
    .oneOf(Object.values(ID_TYPES), 'Invalid ID type')
    .required('ID Type is required'),
  idNo: yup.string().required('ID No is required'),
  address: yup.object().shape({
    street: yup.string().required('Village/Colony is required'),
    city: yup.string().nullable(),
    state: yup.string().required('State is required'),
    district: yup.string().required('District is required'),
    tehsil: yup.string().required('Tehsil is required'),
    post: yup.string().required('Post is required'),
    pincode: yup
      .string()
      .required('Pincode is required')
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  }),
});

const initialPatientValues = {
  name: '',
  relation: '',
  relativeName: '',
  age: '',
  ageUnit: 'Year',
  gender: '',
  maritalStatus: '',
  religion: '',
  occupation: '',
  mobileNo: '',
  emailId: '',
  idType: '',
  idNo: '',
  patientType: 'General',
  address: {
    village: '',
    state: '',
    district: '',
    tehsil: '',
    post: '',
    pincode: '',
  },
};

const CreatePatientModal = ({ show, onHide, onPatientCreated }) => {
  const formikRef = useRef();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const parsedAge = parseInt(values.age, 10);
      if (isNaN(parsedAge) || parsedAge <= 0) {
        toast.error('Please enter a valid age');
        return;
      }

      const submitData = {
        ...values,
        age: parsedAge,
        maritalStatus: values.maritalStatus,
        religion: values.religion,
        occupation: values.occupation,
        emailId: values.emailId,
        patientType: values.patientType !== 'General' ? values.patientType : null,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/patients`, submitData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Patient created successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        resetForm();
        onHide();

        // Callback to parent component if needed
        if (onPatientCreated) {
          onPatientCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating patient:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create patient. Please try again.';

      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="xl"
      className="create-patient-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">New Patient</Modal.Title>
      </Modal.Header>

      <Formik
        ref={formikRef}
        initialValues={initialPatientValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body className="px-3 px-md-4">
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="name"
                  label="Patient Name"
                  required
                  className="col-12 col-md-6 col-lg-3"
                />
                <FormField
                  name="relation"
                  label="Relation"
                  type="select"
                  required
                  className="col-12 col-md-6 col-lg-3"
                  options={Object.values(RELATION_TYPES)}
                />
                <FormField
                  name="relativeName"
                  label="Relative Name"
                  required
                  className="col-12 col-md-6 col-lg-3"
                />
                <div className="col-12 col-md-6 col-lg-3">
                  <AgeField />
                </div>
              </FormRow>

              {/* Gender and Personal Information Row */}
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="gender"
                  label="Gender"
                  type="radio"
                  required
                  className="col-12 col-md-6 col-lg-6"
                  options={Object.values(GENDER)}
                />
                <FormField
                  name="maritalStatus"
                  label="Marital Status"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={Object.keys(MARITAL_STATUS).map(key => ({
                    value: MARITAL_STATUS[key],
                    label: MARITAL_STATUS[key],
                  }))}
                />
                <FormField
                  name="religion"
                  label="Religion"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={Object.keys(RELIGIONS).map(key => ({
                    value: RELIGIONS[key],
                    label: RELIGIONS[key],
                  }))}
                />
                <FormField
                  name="occupation"
                  label="Occupation"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={Object.keys(OCCUPATIONS).map(key => ({
                    value: OCCUPATIONS[key],
                    label: OCCUPATIONS[key],
                  }))}
                />
              </FormRow>

              {/* Contact and ID Information Row */}
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="mobileNumber"
                  label="Mobile No"
                  type="text"
                  required
                  maxLength="10"
                  className="col-12 col-md-6 col-lg-6"
                />
                <FormField
                  name="emailId"
                  label="Email Id"
                  type="email"
                  className="col-12 col-md-6 col-lg-6"
                />
                <FormField
                  name="idType"
                  label="ID Type"
                  type="select"
                  required
                  className="col-6 col-sm-6 col-lg-6"
                  options={Object.keys(ID_TYPES).map(key => ({
                    value: ID_TYPES[key],
                    label: ID_TYPES[key],
                  }))}
                />
                <FormField name="idNo" label="ID No" required className="col-6 col-sm-6 col-lg-6" />
              </FormRow>

              {/* Patient Type and Address Row 1 */}
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="patientType"
                  label="Patient Type"
                  type="select"
                  className="col-6 col-sm-4 col-lg-3"
                  options={Object.keys(PATIENT_TYPES).map(key => ({
                    value: PATIENT_TYPES[key],
                    label: PATIENT_TYPES[key],
                  }))}
                />
                <FormField
                  name="address.street"
                  label="Village/street"
                  required
                  className="col-12 col-sm-8 col-lg-6"
                />
                <FormField
                  name="address.state"
                  label="State"
                  placeholder="Enter state name"
                  required
                  className="col-6 col-sm-6 col-lg-3"
                />
              </FormRow>

              {/* Address Row 2 */}
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="address.district"
                  label="District"
                  placeholder="Enter district name"
                  required
                  className="col-6 col-sm-6 col-lg-3"
                />
                <FormField
                  name="address.tehsil"
                  label="Tehsil"
                  required
                  className="col-6 col-sm-6 col-lg-3"
                />
                <FormField
                  name="address.post"
                  label="Post"
                  required
                  className="col-6 col-sm-6 col-lg-3"
                />
                <FormField
                  name="address.pincode"
                  label="Pincode"
                  maxLength="6"
                  required
                  className="col-6 col-sm-6 col-lg-3"
                />
              </FormRow>
            </Modal.Body>

            <Modal.Footer className="d-flex flex-column flex-sm-row gap-2 px-3 px-md-4">
              <Button
                type="button"
                className="btn btn-outline-secondary order-2 order-sm-1"
                onClick={onHide}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary order-1 order-sm-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  'Save Patient'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreatePatientModal;
