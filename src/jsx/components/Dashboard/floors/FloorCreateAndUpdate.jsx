import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import floorAPIService from '../../../../services/FloorService';
import FormField from '../Reception/components/FormField';
import { createFloorSchema, updateFloorSchema } from '../Reception/schemas/floorValidation';

const FloorCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (data) {
        // Update existing bed
        const response = await floorAPIService.update(data._id, values);
        toast.success('Floor updated successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Floor updated successfully:', response);
      } else {
        // Create new bed
        const response = await floorAPIService.create(values);
        toast.success('Floor created successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Floor created successfully:', response);
      }
      // Close modal after success
      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving floor', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Error saving floor:', error);
    } finally {
      // Stop the submitting state no matter success or error
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Floor' : 'Create Floor'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Floor' : 'Create Floor'}
    >
      <Formik
        initialValues={{
          name: data ? data.name || '' : '',
          status: data ? data.status || '' : '',
        }}
        validationSchema={data ? updateFloorSchema : createFloorSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <FormField
                className=""
                name="status"
                label="Status"
                type="select"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'InActive', value: 'inactive' },
                ]}
              />
            </div>

            <div className="mb-3">
              <FormField name="name" label="Name" type="text" className="" />
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
                  <>{data ? 'Update Floor' : 'Create Floor'}</>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default FloorCreateAndUpdate;
