import { Button, Modal } from 'react-bootstrap';

import axios from 'axios';
import { FieldArray, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import FormField from './components/FormField';

export const primaryExaminationSchema = Yup.object({
  visitId: Yup.string().required('Visit is required'),

  complaints: Yup.array().of(Yup.string()).min(1, 'At least one complaint required'),
  history: Yup.string(),

  vitals: Yup.object({
    height: Yup.number().nullable(),
    weight: Yup.number().nullable(),
    spo2: Yup.number().nullable(),
    pulse: Yup.number().nullable(),
    bp: Yup.string().nullable(),
    resp: Yup.number().nullable(),
    temp: Yup.number().nullable(),
  }),

  femaleDetails: Yup.object({
    lmp: Yup.date().nullable(),
    edd: Yup.date().nullable(),
    gravida: Yup.number().nullable(),
    parity: Yup.number().nullable(),
    noOfChild: Yup.number().nullable(),
  }),

  investigations: Yup.array().of(Yup.string()),
  investigationAdvised: Yup.string(),

  provisionalDiagnosis: Yup.string(),
  finalDiagnosis: Yup.string(),
  treatment: Yup.string(),
});

export const initialPrimaryExaminationValues = {
  visitId: '',
  complaints: [''],
  history: '',

  vitals: {
    height: '',
    weight: '',
    spo2: '',
    pulse: '',
    bp: '',
    resp: '',
    temp: '',
  },

  femaleDetails: {
    lmp: '',
    edd: '',
    gravida: '',
    parity: '',
    noOfChild: '',
  },

  investigations: [''],
  investigationAdvised: '',
};

const API_URL = import.meta.env.VITE_API_URL;

const AddPrimaryExaminationModal = ({
  show,
  onHide,
  visitId,
  patientId,
  patientGender,
  onSaved,
}) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${API_URL}/primary-examination`, {
        ...values,
        visitId,
        patientId,
      });

      if (res.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'Primary Examination saved successfully',
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        onHide();
        onSaved?.(res.data.data);
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header>
        <Modal.Title>Primary Examination</Modal.Title>
        <Button className="btn-close" onClick={onHide} />
      </Modal.Header>

      <Formik
        initialValues={{ ...initialPrimaryExaminationValues, visitId }}
        validationSchema={primaryExaminationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Modal.Body>
              {/* Complaints */}
              <h6>Complaints</h6>
              <FieldArray name="complaints">
                {helpers => (
                  <>
                    {values.complaints.map((_, i) => (
                      <div key={i} className="d-flex gap-2 mb-2">
                        <FormField name={`complaints[${i}]`} className="flex-grow-1" />
                        <div>
                          <Button size="sm" variant="danger" onClick={() => helpers.remove(i)}>
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" onClick={() => helpers.push('')}>
                      Add Complaint
                    </Button>
                  </>
                )}
              </FieldArray>

              {/* History */}
              <FormField name="history" label="History" className="mt-3" as="textarea" />

              {/* Vitals */}
              <h6 className="mt-4">Vitals</h6>
              <div className="row">
                <FormField name="vitals.height" label="Height" className="col-md-3" />
                <FormField name="vitals.weight" label="Weight" className="col-md-3" />
                <FormField name="vitals.spo2" label="SpO₂" className="col-md-3" />
                <FormField name="vitals.pulse" label="Pulse" className="col-md-3" />
                <FormField name="vitals.bp" label="BP" className="col-md-3" />
                <FormField name="vitals.resp" label="Resp" className="col-md-3" />
                <FormField name="vitals.temp" label="Temp" className="col-md-3" />
              </div>

              {/* Female Section */}
              {patientGender === 'Female' && (
                <>
                  <h6 className="mt-4">Female Details</h6>
                  <div className="row">
                    <FormField
                      name="femaleDetails.lmp"
                      label="LMP"
                      type="text"
                      className="col-md-4"
                    />
                    <FormField
                      name="femaleDetails.edd"
                      label="EDD"
                      type="text"
                      className="col-md-4"
                    />
                    <FormField name="femaleDetails.gravida" label="Gravida" className="col-md-4" />
                    <FormField name="femaleDetails.parity" label="Parity" className="col-md-4" />
                    <FormField
                      name="femaleDetails.noOfChild"
                      label="No. of Child"
                      className="col-md-4"
                    />
                  </div>
                </>
              )}

              {/* Investigations */}
              <h6 className="mt-4">Investigations</h6>
              <FieldArray name="investigations">
                {helpers => (
                  <>
                    {values.investigations.map((_, i) => (
                      <div key={i} className="d-flex gap-2 mb-2">
                        <FormField name={`investigations[${i}]`} className="flex-grow-1" />
                        <div>
                          <Button size="sm" variant="danger" onClick={() => helpers.remove(i)}>
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" onClick={() => helpers.push('')}>
                      Add Investigation
                    </Button>
                  </>
                )}
              </FieldArray>

              <FormField
                name="investigationAdvised"
                label="Investigation Advised"
                className="mt-3"
              />
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Close
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddPrimaryExaminationModal;
