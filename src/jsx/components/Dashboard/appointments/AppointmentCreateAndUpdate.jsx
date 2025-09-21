import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import { ROLES } from '../../../../constants/enums';
import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import appointmentAPIService from '../../../../services/AppointmentService';
import { loadPatientOptions } from '../../../../services/PatientsService';
import { appointmentSchema } from '../Reception/schemas/Appointment';

const PatientInfoCard = ({ patient }) => (
  <Card className="mb-3 shadow-sm">
    <Card.Header className="bg-primary text-white">Patient Details</Card.Header>
    <Card.Body>
      <Row>
        <Col md={6}>
          <h5>{patient.name}</h5>
          <p className="mb-1">
            <strong>UHID:</strong> {patient.uhidNo}
          </p>
          <p className="mb-1">
            <strong>Gender:</strong> {patient.gender}, <strong>Age:</strong> {patient.age}
          </p>
          <p className="mb-1">
            <strong>Mobile:</strong> {patient.mobileNumber}
          </p>
        </Col>
        <Col md={6}>
          <p className="mb-1">
            <strong>Relative:</strong> {patient.relation} {patient.relativeName}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {patient.address.street}, {patient.address.district},{' '}
            {patient.address.state} - {patient.address.pincode}
          </p>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const DoctorInfoCard = ({ doctor }) => (
  <Card className="mb-3 shadow-sm">
    <Card.Header className="bg-success text-white">Doctor Details</Card.Header>
    <Card.Body>
      <h5>{doctor.name}</h5>
      <p className="mb-1">{doctor.qualification}</p>
      <p className="mb-1">
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p className="mb-1">
        <strong>Department:</strong> {doctor.department}
      </p>
      <p className="mb-1">
        <strong>Mobile:</strong> {doctor.mobileNo}
      </p>
    </Card.Body>
  </Card>
);

const formatDateTimeLocal = isoString => {
  if (!isoString) return '';
  const dt = new Date(isoString);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AppointmentCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const { loadDoctorOptions } = useDoctorAPI();
  const { role } = useSelector(state => state.auth);

  const handleSubmit = async (values, form) => {
    form.setSubmitting(true);
    try {
      if (data) {
        await appointmentAPIService.update(data._id, values);
        toast.success('Appointment updated successfully');
      } else {
        await appointmentAPIService.create(values);
        toast.success('Appointment created successfully');
      }
      refetch?.();
      onClose(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving appointment');
      console.error(err);
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update Appointment' : 'Create Appointment'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update Appointment' : 'Create Appointment'}
      size="md"
    >
      <Formik
        enableReinitialize
        initialValues={{
          patient: data?.patient?._id || '',
          doctor: data?.doctor?._id || '',
          appointmentDate: formatDateTimeLocal(data?.appointmentDate),
          reason: data?.reason || '',
          status: data?.status || 'Scheduled',
        }}
        validationSchema={appointmentSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const selectedPatient = data?.patient || null;
          const selectedDoctor = data?.doctor || null;
          const isEdit = !!data;

          return (
            <Form>
              {/* Patient */}
              <div className="mb-3">
                <label>
                  Patient <span className="text-danger">*</span>
                </label>
                {!isEdit ? (
                  <>
                    <PaginatedSelect
                      name="patient"
                      loadOptions={loadPatientOptions}
                      placeholder="Search patient..."
                      // value={values.patient}
                      // onChange={option => setFieldValue('patient', option.value)}
                    />
                    <ErrorMessage name="patient" component="div" className="text-danger" />
                  </>
                ) : (
                  selectedPatient && <PatientInfoCard patient={selectedPatient} />
                )}
              </div>

              {/* Doctor */}
              {(role !== ROLES.DOCTOR || !data) && (
                <div className="mb-3">
                  <label>
                    Doctor <span className="text-danger">*</span>
                  </label>
                  <PaginatedSelect
                    name="doctor"
                    loadOptions={loadDoctorOptions}
                    placeholder="Search doctor..."
                    // value={values.doctor}
                    // onChange={option => setFieldValue('doctor', option.value)}
                    isDisabled={false}
                  />
                  <ErrorMessage name="doctor" component="div" className="text-danger" />
                  {isEdit && selectedDoctor && <DoctorInfoCard doctor={selectedDoctor} />}
                </div>
              )}

              {/* Appointment Date */}
              <div className="mb-3">
                <label>
                  Appointment Date <span className="text-danger">*</span>
                </label>
                <Field type="datetime-local" name="appointmentDate" className="form-control" />
                <ErrorMessage name="appointmentDate" component="div" className="text-danger" />
              </div>

              {/* Reason */}
              <div className="mb-3">
                <label>
                  Reason <span className="text-danger">*</span>
                </label>
                <Field as="textarea" name="reason" className="form-control" rows={3} />
                <ErrorMessage name="reason" component="div" className="text-danger" />
              </div>

              {/* Status (only editable in edit mode) */}
              {isEdit && (
                <div className="mb-3">
                  <label>Status</label>
                  <Field as="select" name="status" className="form-control">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Field>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button onClick={onClose} variant="dark btn-sm" type="button">
                  Close
                </Button>
                <Button variant="primary btn-sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <>{isEdit ? 'Update Appointment' : 'Create Appointment'}</>
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

export default AppointmentCreateAndUpdate;
