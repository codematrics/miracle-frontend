import { useEffect, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import axios from 'axios';
import { FieldArray, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import FormField from './components/FormField';

export const prescriptionSchema = Yup.object({
  visitId: Yup.string().required('Visit is required'),
  medicines: Yup.array()
    .of(
      Yup.object({
        medicineName: Yup.string().required('Medicine name is required'),
        dosage: Yup.string().nullable(),
        frequency: Yup.string().nullable(),
        duration: Yup.string().nullable(),
        instructions: Yup.string().nullable(),
      })
    )
    .min(1, 'At least one medicine is required'),
  notes: Yup.string().nullable(),
  followUpDate: Yup.date().nullable(),
});

export const initialPrescriptionValues = {
  visitId: '',
  medicines: [],
  notes: '',
  followUpDate: '',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreatePrescriptionModal = ({ show, onHide, onPrescriptionCreated, visitId, patientId }) => {
  const { loadDoctorOptions } = useDoctorAPI();

  const formikRef = useRef(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `${API_URL}/prescriptions`,
        { ...values, patientId, visitId },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Prescription created successfully',
          showConfirmButton: false,
          timer: 1500,
        });

        resetForm();
        onHide();

        if (onPrescriptionCreated) {
          onPrescriptionCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error(error.response?.data?.message || 'Error creating prescription');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset on modal close
  useEffect(() => {
    if (!show && formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [show]);

  return (
    <Modal className="fade" show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Prescription</Modal.Title>
        <Button variant="" className="btn-close" onClick={onHide}></Button>
      </Modal.Header>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...initialPrescriptionValues, visitId }}
        validationSchema={prescriptionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Modal.Body>
              {/* Medicines */}
              <h6 className="mt-3">Medicines</h6>
              <FieldArray
                name="medicines"
                render={arrayHelpers => (
                  <div>
                    {values.medicines.map((med, idx) => (
                      <div key={idx} className="card p-3 mb-3">
                        <div className="row">
                          <FormField
                            name={`medicines[${idx}].medicineName`}
                            label="Medicine"
                            required
                            className="col-md-4"
                          />
                          <FormField
                            name={`medicines[${idx}].dosage`}
                            label="Dosage"
                            className="col-md-2"
                          />
                          <FormField
                            name={`medicines[${idx}].frequency`}
                            label="Frequency"
                            className="col-md-2"
                          />
                          <FormField
                            name={`medicines[${idx}].duration`}
                            label="Duration"
                            className="col-md-2"
                          />
                          <FormField
                            name={`medicines[${idx}].instructions`}
                            label="Instructions"
                            className="col-md-12 mt-2"
                          />
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => arrayHelpers.remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        arrayHelpers.push({
                          medicineName: '',
                          dosage: '',
                          frequency: '',
                          duration: '',
                          instructions: '',
                        })
                      }
                    >
                      Add Medicine
                    </Button>
                  </div>
                )}
              />

              {/* Notes & Follow-up */}
              <div className="row mt-3">
                <FormField
                  name="notes"
                  label="Notes"
                  className="col-12"
                  placeholder="Enter additional notes..."
                />
                <FormField
                  name="followUpDate"
                  label="Follow-up Date"
                  type="date"
                  className="col-md-6"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-danger btn-sm light"
                onClick={onHide}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button type="submit" className="btn btn-sm btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Prescription'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreatePrescriptionModal;
