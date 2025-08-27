import { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { FieldArray, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import {
  AGE_UNITS,
  FORMAT_TYPE,
  GENDER_WITH_ALL,
  REPORT_TYPE,
  SAMPLE_TYPE,
} from '../../../../constants/enums';
import { createLabParameter, updateLabParameter } from '../../../../services/ParameterService';
import CkEditorField from '../../Forms/CkEditor/CkEditor';
import FormField from '../Reception/components/FormField';

// ---------------- Yup Schema (converted from Zod) ----------------
const bioReferenceSchema = Yup.object().shape({
  unit: Yup.string().optional(),
  ageFrom: Yup.number().min(0, 'Age From must be >= 0').required('Age From is required'),
  ageTo: Yup.number().min(0, 'Age To must be >= 0').required('Age To is required'),
  ageType: Yup.mixed().oneOf(Object.values(AGE_UNITS)).required('Age Type is required'),
  gender: Yup.mixed().oneOf(Object.values(GENDER_WITH_ALL)).required('Gender is required'),
  range: Yup.string().required('Range is required'),
  min: Yup.number().required('Min is required'),
  max: Yup.number().required('Max is required'),
  criticalLess: Yup.number().nullable(),
  criticalGreat: Yup.number().nullable(),
});

const parameterSchema = Yup.object({
  parameterName: Yup.string().required('Parameter name is required'),
  reportType: Yup.mixed().oneOf(Object.values(REPORT_TYPE)).required('Report type is required'),
  formatType: Yup.mixed().oneOf(Object.values(FORMAT_TYPE)).required('Format type is required'),
  sampleType: Yup.mixed().oneOf(Object.values(SAMPLE_TYPE)).nullable(),
  isPrintable: Yup.boolean().default(true),
  bioReference: Yup.array(bioReferenceSchema).nullable(),
  interpretationType: Yup.mixed()
    .oneOf(Object.values(GENDER_WITH_ALL))
    .required('Interpretation Gender is required'),
  interpretationMale: Yup.string().nullable(),
  interpretationFemale: Yup.string().nullable(),
  interpretationBoth: Yup.string().nullable(),
  methodology: Yup.string().nullable(),
  isActive: Yup.boolean().default(true),
});

// ---------------- Initial Values ----------------
const initialValues = {
  parameterName: '',
  reportType: '',
  formatType: '',
  sampleType: '',
  isPrintable: true,
  bioReference: [],
  interpretationType: '',
  interpretationMale: '',
  interpretationFemale: '',
  interpretationBoth: '',
  methodology: '',
  isActive: true,
};

// ---------------- Component ----------------
const ParameterModal = ({ show, onHide, parameter = null, onParameterSaved }) => {
  const formikRef = useRef();

  const getInitialValues = () => {
    if (parameter) {
      return {
        parameterName: parameter.parameterName || '',
        reportType: parameter.reportType || '',
        formatType: parameter.formatType || '',
        sampleType: parameter.sampleType || '',
        isPrintable: parameter.isPrintable ?? true,
        bioReference: parameter.bioReference || [],
        interpretationType: parameter.interpretationType || '',
        interpretationMale: parameter.interpretationMale || '',
        interpretationFemale: parameter.interpretationFemale || '',
        interpretationBoth: parameter.interpretationBoth || '',
        methodology: parameter.methodology || '',
        isActive: parameter.isActive ?? true,
      };
    }
    return initialValues;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = { ...values };
      const isEditing = Boolean(parameter);

      let response;
      if (isEditing) {
        response = await updateLabParameter(parameter._id, payload);
      } else {
        response = await createLabParameter(payload);
      }

      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Parameter ${isEditing ? 'updated' : 'created'} successfully`,
          timer: 1500,
          showConfirmButton: false,
        });
        resetForm();
        onHide();
        if (onParameterSaved) onParameterSaved(response.data);
      } else {
        throw new Error(response.message || 'API error');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { autoClose: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{parameter ? 'Edit Parameter' : 'Add Parameter'}</Modal.Title>
      </Modal.Header>

      <Formik
        innerRef={formikRef}
        initialValues={getInitialValues()}
        validationSchema={parameterSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <FormField name="parameterName" label="Parameter Name *" className="col-md-6" />
                <FormField
                  type="select"
                  name="reportType"
                  label="Report Type *"
                  className="col-md-6"
                  options={Object.values(REPORT_TYPE).map(r => ({ value: r, label: r }))}
                />
                <FormField
                  type="select"
                  name="formatType"
                  label="Format Type *"
                  className="col-md-6"
                  options={Object.values(FORMAT_TYPE).map(r => ({ value: r, label: r }))}
                />
                <FormField
                  type="select"
                  name="sampleType"
                  label="Sample Type"
                  className="col-md-6"
                  options={Object.values(SAMPLE_TYPE).map(r => ({ value: r, label: r }))}
                />

                {/* ---------- BioReference Section ---------- */}
                <div className="col-12">
                  <label className="fw-bold">Bio References</label>
                  <FieldArray
                    name="bioReference"
                    render={arrayHelpers => (
                      <div className="border rounded p-3 mt-2">
                        {values.bioReference?.length > 0 ? (
                          values.bioReference.map((ref, index) => (
                            <div key={index} className="border p-3 mb-3 rounded">
                              <div className="row g-2">
                                <FormField
                                  name={`bioReference.${index}.unit`}
                                  label="Unit"
                                  className="col-md-3"
                                />
                                <FormField
                                  name={`bioReference.${index}.ageFrom`}
                                  label="Age From"
                                  type="number"
                                  className="col-md-2"
                                />
                                <FormField
                                  name={`bioReference.${index}.ageTo`}
                                  label="Age To"
                                  type="number"
                                  className="col-md-2"
                                />
                                <FormField
                                  type="select"
                                  name={`bioReference.${index}.ageType`}
                                  label="Age Type"
                                  className="col-md-2"
                                  options={Object.values(AGE_UNITS).map(a => ({
                                    value: a,
                                    label: a,
                                  }))}
                                />
                                <FormField
                                  type="select"
                                  name={`bioReference.${index}.gender`}
                                  label="Gender"
                                  className="col-md-3"
                                  options={Object.values(GENDER_WITH_ALL).map(g => ({
                                    value: g,
                                    label: g,
                                  }))}
                                />
                                <FormField
                                  name={`bioReference.${index}.range`}
                                  label="Range"
                                  className="col-md-4"
                                />
                                <FormField
                                  name={`bioReference.${index}.min`}
                                  label="Min"
                                  type="number"
                                  className="col-md-4"
                                />
                                <FormField
                                  name={`bioReference.${index}.max`}
                                  label="Max"
                                  type="number"
                                  className="col-md-4"
                                />
                                <FormField
                                  name={`bioReference.${index}.criticalLess`}
                                  label="Critical Less"
                                  type="number"
                                  className="col-md-6"
                                />
                                <FormField
                                  name={`bioReference.${index}.criticalGreat`}
                                  label="Critical Great"
                                  type="number"
                                  className="col-md-6"
                                />
                              </div>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-2"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No bio references added yet</p>
                        )}
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => arrayHelpers.push({})}
                        >
                          + Add Bio Reference
                        </Button>
                      </div>
                    )}
                  />
                </div>

                {/* Interpretations */}
                <FormField
                  name="interpretationType"
                  label="Interpretation For"
                  type="radio"
                  required
                  className="col-12"
                  options={Object.values(GENDER_WITH_ALL)}
                />
                {console.log(values.interpretationType)}

                {/* Conditionally render editor */}
                {values.interpretationType === GENDER_WITH_ALL.MALE && (
                  <CkEditorField
                    name="interpretationMale"
                    label="Interpretation (Male)"
                    className="col-md-12"
                  />
                )}
                {values.interpretationType === GENDER_WITH_ALL.FEMALE && (
                  <CkEditorField
                    name="interpretationFemale"
                    label="Interpretation (Female)"
                    className="col-md-12"
                  />
                )}
                {values.interpretationType === GENDER_WITH_ALL.ALL && (
                  <CkEditorField
                    name="interpretationBoth"
                    label="Interpretation (Both)"
                    className="col-md-12"
                  />
                )}

                {/* Methodology + Status */}
                <CkEditorField name="methodology" label="Methodology" className="col-12" />
                <FormField
                  type="checkbox"
                  name="isActive"
                  label="is Active?"
                  className="col-md-6"
                />
                <FormField
                  type="checkbox"
                  name="isPrintable"
                  label="Printable"
                  className="col-md-6"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting
                  ? parameter
                    ? 'Updating...'
                    : 'Creating...'
                  : parameter
                    ? 'Update Parameter'
                    : 'Create Parameter'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ParameterModal;
