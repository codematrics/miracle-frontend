import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import { SERVICE_APPLICABLE, SERVICE_CATEGORY, SERVICE_HEADS } from '../../../../constants/enums';
import serviceTypeAPIService from '../../../../services/ServiceTypeService';
import { createService, updateService } from '../../../../services/ServicesService';
import FormField from '../Reception/components/FormField';

// Yup validation schema
const serviceSchema = Yup.object({
  serviceHead: Yup.string().required('Service head is required'),
  serviceName: Yup.string()
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must be less than 100 characters')
    .required('Service name is required'),
  unit: Yup.string().max(50, 'Unit cannot exceed 50 characters'),
  headType: Yup.string()
    .oneOf(Object.values(SERVICE_CATEGORY), 'Invalid category')
    .required('Head Type is required'),
  serviceApplicableOn: Yup.string()
    .oneOf(Object.values(SERVICE_APPLICABLE), 'Invalid applicability')
    .required('This field is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  isActive: Yup.boolean().required('Status is required'),
  isOutSource: Yup.boolean(),
});

const initialValues = {
  serviceHead: '',
  serviceName: '',
  unit: '',
  headType: '',
  serviceApplicableOn: '',
  price: '',
  isActive: true,
  reportName: '',
  isOutSource: false,
};

const ServiceModal = ({ show, onHide, service = null, onServiceSaved }) => {
  const isEditing = Boolean(service);

  const getInitialValues = () => {
    if (isEditing && service) {
      return {
        serviceHead: service.serviceHead || '',
        serviceName: service.serviceName || '',
        unit: service.unit || '',
        headType: service.headType || '',
        serviceType: service.serviceType
          ? { value: service.serviceType?._id, name: service.serviceType?.name }
          : '',
        serviceApplicableOn: service.serviceApplicableOn || '',
        price: service.price || '',
        isActive: service.isActive ?? true,
        isOutSource: service.isOutSource ?? false,
      };
    }
    return initialValues;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;
      if (isEditing) {
        response = await updateService(service._id, {
          ...values,
          serviceType: values.serviceType.value,
        });
      } else {
        response = await createService(values);
      }

      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || `Service ${isEditing ? 'updated' : 'created'} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        onHide();
        if (onServiceSaved) onServiceSaved(response.data);
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    ...Object.values(SERVICE_CATEGORY).map(cat => ({ value: cat, label: cat })),
  ];

  const applicableOptions = [
    ...Object.values(SERVICE_APPLICABLE).map(app => ({ value: app, label: app })),
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Service' : 'Add New Service'}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={serviceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, errors }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <FormField
                  type="select"
                  name="headType"
                  label="Head Type *"
                  className="col-12 col-md-6"
                  options={categoryOptions}
                />
                <FormField
                  name="serviceHead"
                  label="Service Head *"
                  type="select"
                  options={Object.keys(SERVICE_HEADS).map(key => ({
                    label: SERVICE_HEADS[key],
                    value: SERVICE_HEADS[key],
                  }))}
                  className="col-12 col-md-6"
                />
                <PaginatedSelect
                  name="serviceType"
                  label="Service Type *"
                  loadOptions={serviceTypeAPIService.loadServiceTypeOptions}
                  dependentFetch={{
                    key: 'serviceHead',
                    value: values.serviceHead || null, // ✅ primitive
                  }}
                />

                <FormField name="serviceName" label="Service Name *" className="col-12 col-md-6" />
                <FormField name="unit" label="Unit" className="col-12 col-md-6" />
                <FormField
                  type="select"
                  name="serviceApplicableOn"
                  label="Applicable On *"
                  className="col-12 col-md-6"
                  options={applicableOptions}
                />
                <FormField name="price" label="Price *" type="number" className="col-12 col-md-6" />
                <FormField
                  type="select"
                  name="isActive"
                  label="Status *"
                  className="col-12 col-md-4"
                  options={[
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                  ]}
                />
                <FormField
                  name="isOutSource"
                  label="Out Source *"
                  type="checkbox"
                  className="col-12"
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="d-flex gap-2 px-4 flex-column flex-sm-row">
              <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                {isEditing ? 'Update Service' : 'Create Service'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ServiceModal;
