import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import { SERVICE_HEADS } from '../../../../constants/enums';
import serviceTypeAPIService from '../../../../services/ServiceTypeService';
import FormField from '../Reception/components/FormField';
import { createServiceTypeSchema, updateServiceTypeSchema } from '../Reception/schemas/serviceType';

const ServiceTypeCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (data) {
        // Update existing bed
        const response = await serviceTypeAPIService.update(data._id, values);
        toast.success('Service Type updated successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Service Type updated successfully:', response);
      } else {
        // Create new bed
        const response = await serviceTypeAPIService.create(values);
        toast.success('Service Type created successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Service Type created successfully:', response);
      }
      // Close modal after success
      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving Service type', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Error saving Service type:', error);
    } finally {
      // Stop the submitting state no matter success or error
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Service Type' : 'Create Service Type'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Service Type' : 'Create Service Type'}
    >
      <Formik
        initialValues={{
          name: data ? data.name || '' : '',
          serviceHead: data ? data?.serviceHead : '',
        }}
        validationSchema={data ? updateServiceTypeSchema : createServiceTypeSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <FormField name="name" label="Name" type="text" className="" />
              <FormField
                name="serviceHead"
                label="Service Head *"
                type="select"
                options={Object.keys(SERVICE_HEADS).map(key => ({
                  label: SERVICE_HEADS[key],
                  value: SERVICE_HEADS[key],
                }))}
                className="col-12 col-md-6"
              />{' '}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button onClick={onClose} variant="dark btn-sm" type="button">
                Close
              </Button>
              <Button variant="primary btn-sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />{' '}
                    {data ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{data ? 'Update Service Type' : 'Create Service Type'}</>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default ServiceTypeCreateAndUpdate;
