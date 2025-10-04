import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import { ROLES } from '../../../../constants/enums';
import usersAPIService from '../../../../services/UsersService';
import FormField from '../Reception/components/FormField';
import { userSchema } from '../Reception/schemas/user';

const ReceptionistCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const handleSubmit = async (values, form) => {
    form.setSubmitting(true);
    try {
      if (data) {
        await usersAPIService.update(data._id, values);
        toast.success('Receptionist updated successfully');
      } else {
        await usersAPIService.create(values);
        toast.success('Receptionist created successfully');
      }
      refetch?.();
      onClose(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving receptionist');
      console.error(err);
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Receptionist' : 'Create Receptionist'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Receptionist' : 'Create Receptionist'}
      size="md"
    >
      <Formik
        enableReinitialize
        initialValues={{
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          password: data?.password || '',
          role: data?.role || ROLES.RECEPTIONIST,
          isActive: data?.isActive || true,
        }}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormField
                name="firstName"
                required
                label="First Name"
                type="text"
                className="col-md-12"
              />
              <FormField
                name="lastName"
                required
                label="Last Name"
                type="text"
                className="col-md-12"
              />
              <FormField name="email" required label="Email" type="email" className="col-md-12" />
              <FormField
                name="password"
                required
                label="Password"
                type="text"
                className="col-md-12"
              />

              {/* Footer Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button onClick={onClose} variant="dark btn-sm" type="button">
                  Close
                </Button>
                <Button variant="primary btn-sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <>{data ? 'Update Receptionist' : 'Create Receptionist'}</>
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </CommonModal>
  );
};

export default ReceptionistCreateAndUpdate;
