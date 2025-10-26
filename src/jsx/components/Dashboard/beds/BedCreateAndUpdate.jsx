import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import bedAPIService from '../../../../services/BedService';
import floorAPIService from '../../../../services/FloorService';
import wardAPIService from '../../../../services/WardService';
import FormField from '../Reception/components/FormField';
import { createBedSchema, updateBedSchema } from '../Reception/schemas/bedValidation';

const BedCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = { ...values, ward: values?.ward?.value, floor: values?.floor?.value };
      if (data) {
        // Update existing bed
        const response = await bedAPIService.update(data._id, payload);
        toast.success('Bed updated successfully', {
          position: 'top-right',
          autoClose: 5000,
        });
        refetch?.();
        console.log('Bed updated successfully:', response);
      } else {
        // Create new bed
        const response = await bedAPIService.create(payload);
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
          ward: data ? { value: data.ward._id, label: data.ward.name } : null,
          floor: data ? { value: data.ward?.floor._id, label: data.ward.floor.name } : null,
        }}
        validationSchema={data ? updateBedSchema : createBedSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            {console.log(values, data)}
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
              <PaginatedSelect
                name="floor"
                label="Floor"
                loadOptions={floorAPIService.loadFloorOptions}
                placeholder="Search Floor..."
                // value={values.patient}
                // onChange={option => setFieldValue('patient', option.value)}
              />
            </div>

            <div className="mb-3">
              <PaginatedSelect
                name="ward"
                label="Ward"
                loadOptions={wardAPIService.loadWardOptions}
                placeholder="Search Ward..."
                dependentFetch={{ key: 'floor', value: values.floor }}
                // value={values.patient}
                // onChange={option => setFieldValue('patient', option.value)}
              />
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
