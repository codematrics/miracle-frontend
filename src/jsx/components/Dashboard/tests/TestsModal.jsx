import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { FORMAT_TYPE, REPORT_TYPE, SAMPLE_TYPE } from '../../../../constants/enums';
import { createLabTest, updateLabTest } from '../../../../services/LabTestService';
import CkEditorField from '../../Forms/CkEditor/CkEditor';
import FormField from '../Reception/components/FormField';

// ✅ Yup validation schema (converted from Zod)
const labTestSchema = Yup.object({
  testName: Yup.string().min(1, 'Test name is required').required('Test name is required'),
  reportType: Yup.string()
    .oneOf(Object.values(REPORT_TYPE), 'Invalid report type')
    .required('Report type is required'),
  formatType: Yup.string()
    .oneOf(Object.values(FORMAT_TYPE), 'Invalid format type')
    .required('Format type is required'),
  sampleType: Yup.string().oneOf(Object.values(SAMPLE_TYPE)).optional(),
  methodology: Yup.string().optional(),
  isActive: Yup.boolean().default(true),
  isPrintable: Yup.boolean().default(false),
});

const initialValues = {
  testName: '',
  reportType: '',
  formatType: '',
  sampleType: '',
  methodology: '',
  isActive: true,
  isPrintable: false,
};

const TestsModal = ({ show, onHide, test = null, onTestSaved }) => {
  const isEditing = Boolean(test);

  const getInitialValues = () => {
    if (isEditing && test) {
      return {
        testName: test.testName || '',
        reportType: test.reportType || '',
        formatType: test.formatType || '',
        sampleType: test.sampleType || '',
        methodology: test.methodology || '',
        isActive: test.isActive ?? true,
        isPrintable: test.isPrintable ?? false,
      };
    }
    return initialValues;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;
      if (isEditing) {
        response = await updateLabTest(test._id, values);
      } else {
        response = await createLabTest(values);
      }

      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || `Lab Test ${isEditing ? 'updated' : 'created'} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        onHide();
        if (onTestSaved) onTestSaved(response.data);
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reportTypeOptions = Object.values(REPORT_TYPE).map(val => ({
    value: val,
    label: val,
  }));
  const formatTypeOptions = Object.values(FORMAT_TYPE).map(val => ({
    value: val,
    label: val,
  }));
  const sampleTypeOptions = Object.values(SAMPLE_TYPE).map(val => ({
    value: val,
    label: val,
  }));

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Lab Test' : 'Add New Lab Test'}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={labTestSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <FormField name="testName" label="Test Name *" className="col-12 col-md-6" />

                <FormField
                  type="select"
                  name="reportType"
                  label="Report Type *"
                  options={reportTypeOptions}
                  className="col-12 col-md-6"
                />

                <FormField
                  type="select"
                  name="formatType"
                  label="Format Type *"
                  options={formatTypeOptions}
                  className="col-12 col-md-6"
                />

                <FormField
                  type="select"
                  name="sampleType"
                  label="Sample Type"
                  options={sampleTypeOptions}
                  className="col-12 col-md-6"
                />

                <CkEditorField name="methodology" label="Methodology" className="col-12" />

                <FormField type="checkbox" name="isActive" label="Is Active?" className="col-12" />

                <FormField
                  type="checkbox"
                  name="isPrintable"
                  label="Is Printable?"
                  className="col-12"
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="d-flex gap-2 px-4 flex-column flex-sm-row">
              <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                {isEditing ? 'Update Test' : 'Create Test'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TestsModal;
