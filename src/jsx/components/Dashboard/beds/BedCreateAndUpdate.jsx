import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import bedAPIService from '../../../../services/BedService';
import FormField from '../Reception/components/FormField';
import { createBedSchema, updateBedSchema } from '../Reception/schemas/bedValidation';

const BedCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (data) {
        // Update existing bed
        const response = await bedAPIService.update(data._id, values);
        toast.success('Bed updated successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Bed updated successfully:', response);
      } else {
        // Create new bed
        const response = await bedAPIService.create(values);
        toast.success('Bed created successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Bed created successfully:', response);
      }
      // Close modal after success
      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving bed', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Error saving bed:', error);
    } finally {
      // Stop the submitting state no matter success or error
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Bed' : 'Create Bed'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Bed' : 'Create Bed'}
    >
      <Formik
        initialValues={{
          bedNumber: data ? data.bedNumber || '' : '',
          status: data ? data.status || '' : '',
          type: data ? data.type || '' : '',
          ward: data ? data.ward || '' : '',
        }}
        validationSchema={data ? updateBedSchema : createBedSchema}
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
                  { label: 'Available', value: 'available' },
                  { label: 'Occupied', value: 'occupied' },
                  { label: 'Maintenance', value: 'maintenance' },
                ]}
              />
            </div>

            <div className="mb-3">
              <FormField
                className=""
                name="type"
                label="Type"
                type="select"
                options={[
                  { label: 'General', value: 'general' },
                  { label: 'ICU', value: 'icu' },
                  { label: 'Ward', value: 'ward' },
                ]}
              />
            </div>

            <div className="mb-3">
              <FormField name="ward" label="Ward" type="text" className="" />
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
                  <>{data ? 'Update Bed' : 'Create Bed'}</>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default BedCreateAndUpdate;
