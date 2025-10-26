import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import floorAPIService from '../../../../services/FloorService';
import wardAPIService from '../../../../services/WardService';
import FormField from '../Reception/components/FormField';
import { createWardSchema, updateWardSchema } from '../Reception/schemas/wardValidation';

const WardCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      floor: values.floor?.value,
    };

    try {
      if (data) {
        const response = await wardAPIService.update(data._id, payload);
        toast.success('Ward updated successfully');
      } else {
        const response = await wardAPIService.create(payload);
        toast.success('Ward created successfully');
      }
      refetch?.();
      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving Ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Ward' : 'Create Ward'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Ward' : 'Create Ward'}
    >
      <Formik
        initialValues={{
          name: data ? data.name || '' : '',
          status: data ? data.status || '' : '',
          type: data ? data.type || '' : '',
          floor: data
            ? { value: data.floor._id, label: data.floor.name } // ✅ Pass full object
            : null,
        }}
        validationSchema={data ? updateWardSchema : createWardSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
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
              <FormField name="name" label="Name" placeholder="Name" type="text" className="" />
            </div>

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
                  <>{data ? 'Update Ward' : 'Create Ward'}</>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export default WardCreateAndUpdate;
