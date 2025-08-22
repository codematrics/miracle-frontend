import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import axios from 'axios';
import { Form, Formik } from 'formik';
import { useRef } from 'react';
import Swal from 'sweetalert2';

import AgeField from './components/AgeField';
import FormField from './components/FormField';
import FormRow from './components/FormRow';
import { initialPatientValues, patientSchema } from './schemas/patientValidation';

const CreatePatientModal = ({ show, onHide, onPatientCreated }) => {
  const formikRef = useRef();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Transform data to match exact backend API format
      const submitData = {
        patientName: values.patientName,
        relation: values.relation,
        fatherOrHusbandName: values.fatherOrHusbandName,
        age: parseInt(values.age, 10),
        ageUnit: values.ageUnit,
        gender: values.gender,
        mobileNo: values.mobileNo,
        idType: values.idType,
        idNo: values.idNo,
        address: {
          village: values.address.village,
          state: values.address.state,
          district: values.address.district,
          tehsil: values.address.tehsil,
          postOffice: values.address.postOffice,
          pincode: values.address.pincode,
        },
      };

      // Validate age is a valid number
      if (isNaN(submitData.age) || submitData.age <= 0) {
        toast.error('Please enter a valid age', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Add optional fields only if they have values (convert empty strings to null)
      if (values.maritalStatus && values.maritalStatus !== '') {
        submitData.maritalStatus = values.maritalStatus;
      }
      if (values.religion && values.religion !== '') {
        submitData.religion = values.religion;
      }
      if (values.occupation && values.occupation !== '') {
        submitData.occupation = values.occupation;
      }
      if (values.emailId && values.emailId !== '') {
        submitData.emailId = values.emailId;
      }
      if (values.patientType && values.patientType !== '' && values.patientType !== 'General') {
        submitData.patientType = values.patientType;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/patients`, submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Patient created successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form and close modal
        resetForm();
        onHide();

        // Callback to parent component if needed
        if (onPatientCreated) {
          onPatientCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating patient:', error);

      // Handle backend errors
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes('already exists') || 
            error.response.data?.message?.includes('Mobile number') ||
            error.response.data?.message?.includes('ID number')) {
          // Duplicate patient error
          toast.error(error.response.data.message, {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          // Validation errors
          const firstError = error.response.data.errors[0];
          toast.error(firstError.message || firstError.msg || 'Validation failed', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Other 400 errors
          toast.error(error.response.data?.message || 'Invalid data provided', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        // Handle other types of errors
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Failed to create patient. Please try again.';

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
        validationSchema={patientSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body className="px-3 px-md-4">
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="patientName"
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
                  options={['S/O', 'W/O', 'D/O', 'Other']}
                />
                <FormField
                  name="fatherOrHusbandName"
                  label="F/H Name"
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
                  options={['Male', 'Female', 'Other']}
                />
                <FormField
                  name="maritalStatus"
                  label="Marital Status"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={[
                    { value: '', label: 'Select Marital' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Married', label: 'Married' },
                    { value: 'Separated', label: 'Separated' },
                    { value: 'Unmarried', label: 'Unmarried' },
                    { value: 'Widowed', label: 'Widowed' },
                  ]}
                />
                <FormField
                  name="religion"
                  label="Religion"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={[
                    { value: '', label: 'Select Religion' },
                    { value: 'Hindu', label: 'Hindu' },
                    { value: 'Buddhist', label: 'Buddhist' },
                    { value: 'Christian', label: 'Christian' },
                    { value: 'Jain', label: 'Jain' },
                    { value: 'Muslim', label: 'Muslim' },
                    { value: 'Parsi', label: 'Parsi' },
                    { value: 'Sikh', label: 'Sikh' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                <FormField
                  name="occupation"
                  label="Occupation"
                  type="select"
                  className="col-12 col-md-6 col-lg-6"
                  options={[
                    { value: '', label: 'Select Occupation' },
                    { value: 'SELF EMPLOYED', label: 'SELF EMPLOYED' },
                    { value: 'GOVT. SERVICE', label: 'GOVT. SERVICE' },
                    { value: 'PVT. SERVICE', label: 'PVT. SERVICE' },
                    { value: 'BUSINESS', label: 'BUSINESS' },
                    { value: 'HOUSE WORK', label: 'HOUSE WORK' },
                    { value: 'STUDY', label: 'STUDY' },
                    { value: 'UN-EMPLOYED', label: 'UN-EMPLOYED' },
                    { value: 'OTHER', label: 'OTHER' },
                  ]}
                />
              </FormRow>

              {/* Contact and ID Information Row */}
              <FormRow className="row g-3 mb-3">
                <FormField
                  name="mobileNo"
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
                  options={['Aadhar Card', 'Pancard', 'Driving license', 'Voter ID', 'Passport']}
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
                  options={['General', 'VIP', 'Staff']}
                />
                <FormField
                  name="address.village"
                  label="Village/Colony"
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
                  name="address.postOffice"
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
