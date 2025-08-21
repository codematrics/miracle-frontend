import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';
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

  code: Yup.string()
    .min(2, 'Service code must be at least 2 characters')
    .max(20, 'Service code must be less than 20 characters')
    .matches(
      /^[A-Z0-9_]+$/,
      'Service code must contain only uppercase letters, numbers, and underscores'
    )
    .required('Service code is required'),

  description: Yup.string().max(500, 'Description must be less than 500 characters'),

  category: Yup.string().required('Category is required'),

  rate: Yup.number().min(0, 'Rate must be 0 or greater').required('Rate is required'),

  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
    .required('Status is required'),

  // ✅ Conditional validation for Report Name
  reportName: Yup.string().when('category', {
    is: val => val === 'pathology' || val === 'radiology',
    then: schema => schema.required('Report Name is required'),
    otherwise: schema => schema.notRequired(),
  }),
});

const initialValues = {
  name: '',
  code: '',
  description: '',
  category: '',
  rate: '',
  status: 'active',
  reportName: '', // ✅ Added here
};

const ServiceModal = ({ show, onHide, service = null, onServiceSaved }) => {
  const isEditing = Boolean(service);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const serviceData = {
        ...values,
        rate: parseFloat(values.rate),
      };

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
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.length > 0) {
          const firstError = validationErrors[0];
          toast.error(firstError.message, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Failed to ${isEditing ? 'update' : 'create'} service. Please try again.`;

        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
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
        code: service.code || service.serviceCode || '',
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
        initialValues={getInitialValues()}
        validationSchema={serviceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <FormField name="name" label="Service Name*" className="col-12 col-md-8" />
                <FormField name="code" label="Service Code*" className="col-12 col-md-4" />
                <FormField
                  type="textarea"
                  name="description"
                  label="Description"
                  className="col-12"
                />

                <FormField
                  type="select"
                  name="category"
                  label="Category*"
                  className="col-12 col-md-6"
                  options={categories}
                />

                {/* ✅ Conditionally render Report Name */}
                {(values.category === 'pathology' || values.category === 'radiology') && (
                  <FormField name="reportName" label="Report Name*" className="col-12 col-md-6" />
                )}

                <FormField
                  type="number"
                  name="rate"
                  label="Rate (₹)*"
                  className="col-12 col-md-3"
                />

                <FormField
                  type="select"
                  name="status"
                  label="Status*"
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
