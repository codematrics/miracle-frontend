import { Button } from 'react-bootstrap';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import bedAPIService from '../../../../services/BedService';
import FormField from '../Reception/components/FormField';
import { createBedSchema, updateBedSchema } from '../Reception/schemas/bedValidation';

const BedCreateAndUpdate = ({ data, setOpen, open, onClose }) => {
  const handleSubmit = values => {
    if (data) {
      // Update existing bed
      bedAPIService
        .update(data.id, values)
        .then(response => {
          console.log('Bed updated successfully:', response);
          setOpen(false);
        })
        .catch(error => {
          console.error('Error updating bed:', error);
        });
    } else {
      // Create new bed
      bedAPIService
        .create(values)
        .then(response => {
          console.log('Bed created successfully:', response);
          setOpen(false);
        })
        .catch(error => {
          console.error('Error creating bed:', error);
        });
    }
  };

  return (
    <CommonModal
      open={open}
      setOpen={setOpen}
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
        {({ errors }) => (
          <Form>
            {console.log(errors)}
            <div className="mb-3">
              <FormField name="bedNumber" label="Bed Number" type="text" />
            </div>

            <div className="mb-3">
              <FormField
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
              <FormField name="ward" label="Ward" type="text" />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button onClick={onClose} variant="dark btn-sm" type="button">
                Close
              </Button>
              <Button variant="primary btn-sm" type="submit">
                {data ? 'Update Bed' : 'Create Bed'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default BedCreateAndUpdate;
