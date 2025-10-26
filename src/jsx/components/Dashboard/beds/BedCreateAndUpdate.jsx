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
      const payload = {
        ...values,
        ward: values?.ward?.value,
        floor: values?.floor?.value,
      };

      if (data) {
        // --- Editing: update single bed ---
        const response = await bedAPIService.update(data._id, payload);
        toast.success('Bed updated successfully');
        refetch?.();
      } else {
        // --- Creating: bulk beds from `bedNumberFrom` to `bedNumberTo` ---
        const from = parseInt(values.bedNumberFrom, 10);
        const to = parseInt(values.bedNumberTo, 10);

        if (isNaN(from) || isNaN(to) || from > to) {
          toast.error('Invalid bed number range');
          setSubmitting(false);
          return;
        }

        const createPromises = [];
        for (let i = from; i <= to; i++) {
          const bedPayload = { ...payload, bedNumber: i.toString() };
          createPromises.push(bedAPIService.create(bedPayload));
        }

        await Promise.all(createPromises);
        toast.success(`Beds from ${from} to ${to} created successfully`);
        refetch?.();
      }

      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving bed');
      console.error('Error saving bed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Bed' : 'Create Beds'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Bed' : 'Create Beds'}
    >
      <Formik
        initialValues={{
          bedNumberFrom: '',
          bedNumberTo: '',
          status: data ? data.status || '' : '',
          type: data ? data.type || '' : '',
          ward: data ? { value: data.ward._id, label: data.ward.name } : null,
          floor: data ? { value: data.ward?.floor._id, label: data.ward.floor.name } : null,
        }}
        validationSchema={data ? updateBedSchema : createBedSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors }) => (
          <Form>
            {/* --- Bed Number Range (only when creating) --- */}
            {!data && (
              <div className="mb-3 d-flex gap-2 w-full">
                <FormField
                  className="col-md-6"
                  name="bedNumberFrom"
                  label="Bed Number From"
                  type="number"
                  placeholder="From"
                />
                <FormField
                  className="col-md-6"
                  name="bedNumberTo"
                  label="Bed Number To"
                  type="number"
                  placeholder="To"
                />
              </div>
            )}

            {/* --- Status --- */}
            <div className="mb-3 w-full">
              <FormField
                className="col-md-12"
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

            {/* --- Floor --- */}
            <div className="mb-3">
              <PaginatedSelect
                name="floor"
                label="Floor"
                loadOptions={floorAPIService.loadFloorOptions}
                placeholder="Search Floor..."
              />
            </div>

            {/* --- Ward --- */}
            <div className="mb-3">
              <PaginatedSelect
                name="ward"
                label="Ward"
                loadOptions={wardAPIService.loadWardOptions}
                placeholder="Search Ward..."
                dependentFetch={{ key: 'floor', value: values.floor }}
              />
            </div>

            {/* --- Submit Buttons --- */}
            <div className="d-flex justify-content-end gap-2">
              <Button onClick={onClose} variant="dark btn-sm" type="button">
                Close
              </Button>
              <Button variant="primary btn-sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {data ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{data ? 'Update Bed' : 'Create Beds'}</>
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
