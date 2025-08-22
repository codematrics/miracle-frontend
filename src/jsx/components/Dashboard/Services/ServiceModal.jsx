import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { SERVICE_CATEGORIES } from '../../../../constants/enums';
import { createService, updateService } from '../../../../services/ServicesService';
import FormField from '../Reception/components/FormField';

const serviceSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must be less than 100 characters')
    .required('Service name is required'),


  description: Yup.string().max(500, 'Description must be less than 500 characters'),

  category: Yup.string().required('Category is required'),

  rate: Yup.number()
    .typeError('Rate must be a valid number')
    .min(0, 'Rate cannot be negative')
    .max(999999, 'Rate cannot exceed 999,999')
    .required('Rate is required'),

  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
    .required('Status is required'),

  // ✅ Conditional validation for Report Name
  reportName: Yup.string()
    .max(100, 'Report name must be less than 100 characters')
    .when('category', {
      is: val => val === 'pathology' || val === 'radiology',
      then: schema => schema.required('Report name is required when category is pathology or radiology'),
      otherwise: schema => schema.notRequired(),
    }),
});

const initialValues = {
  name: '',
  description: '',
  category: '',
  rate: '',
  status: 'active',
  reportName: '', // ✅ Added here
};

const ServiceModal = ({ show, onHide, service = null, onServiceSaved }) => {
  const isEditing = Boolean(service);
  const formikRef = useRef();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Transform data to match exact backend API format
      const serviceData = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : '',
        category: values.category,
        rate: parseFloat(values.rate),
        status: values.status || 'active',
      };

      // Add reportName only if category requires it and value exists
      if ((values.category === 'pathology' || values.category === 'radiology') && values.reportName) {
        serviceData.reportName = values.reportName.trim();
      }

      let response;
      if (isEditing) {
        response = await updateService(service.id, serviceData);
      } else {
        response = await createService(serviceData);
      }

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || `Service ${isEditing ? 'updated' : 'created'} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });

        resetForm();
        onHide();

        if (onServiceSaved) {
          onServiceSaved(response.data);
        }
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      // Handle backend errors according to API documentation
      if (error.response?.status === 400) {
        // Validation errors
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
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
          // General validation error
          toast.error(error.response.data?.message || 'Validation failed', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else if (error.response?.status === 409) {
        // Duplicate service code error
        toast.error(error.response.data?.message || 'Service code already exists', {
          position: 'top-right',
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Handle other errors
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Failed to ${isEditing ? 'update' : 'create'} service. Please try again.`;

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

  const getInitialValues = () => {
    if (isEditing && service) {
      return {
        name: service.name || service.serviceName || '',
        description: service.description || '',
        category: service.category || '',
        rate: service.rate || service.price || '',
        status: service.status || 'active',
        reportName: service.reportName || '', // ✅ pre-fill if editing
      };
    }
    return initialValues;
  };

  const categories = [
    { value: '', label: 'Select Category' },
    { value: SERVICE_CATEGORIES.CONSULTATION, label: 'Consultation' },
    { value: SERVICE_CATEGORIES.DIAGNOSTIC, label: 'Diagnostic' },
    { value: SERVICE_CATEGORIES.LABORATORY, label: 'Laboratory' },
    { value: SERVICE_CATEGORIES.RADIOLOGY, label: 'Radiology' },
    { value: SERVICE_CATEGORIES.PATHOLOGY, label: 'Pathology' },
    { value: SERVICE_CATEGORIES.PROCEDURE, label: 'Procedure' },
    { value: SERVICE_CATEGORIES.SURGERY, label: 'Surgery' },
    { value: SERVICE_CATEGORIES.PHARMACY, label: 'Pharmacy' },
    { value: SERVICE_CATEGORIES.EMERGENCY, label: 'Emergency' },
    { value: SERVICE_CATEGORIES.OTHER, label: 'Other' },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      className="service-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </Modal.Title>
      </Modal.Header>

      <Formik
        ref={formikRef}
        initialValues={getInitialValues()}
        validationSchema={serviceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <FormField 
                  name="name" 
                  label={<>Service Name <span style={{ color: 'red' }}>*</span></>} 
                  className="col-12" 
                />
                <FormField
                  type="textarea"
                  name="description"
                  label="Description"
                  className="col-12"
                />

                <FormField
                  type="select"
                  name="category"
                  label={<>Category <span style={{ color: 'red' }}>*</span></>}
                  className="col-12 col-md-6"
                  options={categories}
                />

                {/* ✅ Conditionally render Report Name */}
                {(values.category === 'pathology' || values.category === 'radiology') && (
                  <FormField 
                    name="reportName" 
                    label={<>Report Name <span style={{ color: 'red' }}>*</span></>} 
                    className="col-12 col-md-6" 
                  />
                )}

                <FormField
                  type="number"
                  name="rate"
                  label={<>Rate (₹) <span style={{ color: 'red' }}>*</span></>}
                  className="col-12 col-md-3"
                />

                <FormField
                  type="select"
                  name="status"
                  label="Status"
                  className="col-12 col-md-3"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'InActive', value: 'inactive' },
                  ]}
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="d-flex flex-column flex-sm-row gap-2 px-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onHide}
                disabled={isSubmitting}
                className="order-2 order-sm-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="order-1 order-sm-2"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Service' : 'Create Service'}</>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ServiceModal;
