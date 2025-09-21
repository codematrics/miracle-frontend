import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Formik } from 'formik';
import * as Yup from 'yup';

import SimpleCkEditor from './SimpleCkEditor';

const RadiologyTemplateEditor = ({ show, onHide, labTest }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templateData, setTemplateData] = useState(null);

  // Keep Formik helpers in a ref
  const formikRef = useRef(null);

  // Formik initial values
  const initialValues = {
    templateContent: '',
    findings: '',
    impression: '',
    methodology: '',
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    templateContent: Yup.string().required('Template content is required'),
    findings: Yup.string().required('Findings are required'),
    impression: Yup.string().required('Impression is required'),
    methodology: Yup.string(),
  });

  // Fetch template data
  const fetchTemplateData = async setFieldValue => {
    if (!labTest?._id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/${labTest._id}/template`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.status) {
        setTemplateData(data.data);

        // Initialize form data with template content if available
        if (data.data?.template?.templateContent && setFieldValue) {
          setFieldValue('templateContent', data.data.template.templateContent);
        }
        if (data.data?.template?.impression && setFieldValue) {
          setFieldValue('impression', data.data.template.impression);
        }
        if (data.data?.template?.findings && setFieldValue) {
          setFieldValue('findings', data.data.template.findings);
        }
        if (data.data?.template?.methodology && setFieldValue) {
          setFieldValue('methodology', data.data.template.methodology);
        }
      } else {
        toast.error(data.message || 'Failed to fetch template data');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to fetch template data');
    } finally {
      setLoading(false);
    }
  };

  // Handle save and authorize
  const handleSaveAndAuthorize = async values => {
    if (!labTest?._id) return;

    setSaving(true);
    try {
      const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
      const payload = {
        labTestOrderId: labTest._id,
        templateContent: values.templateContent,
        findings: values.findings,
        impression: values.impression,
        methodology: values.methodology,
        ...(userId && { userId }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/save-radiology-result`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status) {
        toast.success('Radiology report saved and authorized successfully');
        onHide(); // This will trigger data reload in parent
      } else {
        toast.error(data.message || 'Failed to save radiology report');
      }
    } catch (error) {
      console.error('Error saving radiology report:', error);
      toast.error('Failed to save radiology report');
    } finally {
      setSaving(false);
    }
  };

  // Handle print report
  const handlePrintReport = async () => {
    if (!labTest?._id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/print-radiology?labTestOrderId=${labTest._id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
          },
        }
      );

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `radiology-report-${labTest._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Report downloaded successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  // ✅ FIX: run effect at component level, not inside Formik
  useEffect(() => {
    if (show && labTest?._id && formikRef.current) {
      const { setFieldValue, resetForm } = formikRef.current;
      resetForm();
      fetchTemplateData(setFieldValue);
    }
  }, [show, labTest?._id]);

  const isEditable = labTest?.status === 'pending';
  const isAuthorized = labTest?.status === 'authorized';

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-file-medical me-2"></i>
          {isEditable ? 'Edit Radiology Template' : 'View Radiology Template'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          innerRef={formikRef} // ✅ get Formik helpers
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSaveAndAuthorize}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading template data...</p>
                </div>
              ) : (
                <>
                  {/* Lab Test Info */}
                  <div className="mb-4 p-3 bg-light rounded">
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-2">
                          <i className="fas fa-vial me-2"></i>
                          Accession: {labTest?._id?.slice(-8).toUpperCase() || 'N/A'}
                        </h6>
                        <p className="mb-1">
                          <strong>Patient:</strong> {labTest?.patient?.name || 'N/A'}
                        </p>
                        <p className="mb-1">
                          <strong>UHID:</strong> {labTest?.patient?.uhidNo || 'N/A'}
                        </p>
                        <p className="mb-0">
                          <strong>Service:</strong> {labTest?.service?.serviceName || 'N/A'}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-1">
                          <strong>Doctor:</strong> {labTest?.doctor?.name || 'N/A'}
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong>
                          <span
                            className={`badge bg-${labTest?.status === 'authorized' ? 'success' : 'warning'} ms-2`}
                          >
                            {labTest?.status || 'Unknown'}
                          </span>
                        </p>
                        <p className="mb-0">
                          <strong>Date:</strong> {new Date(labTest?.createdAt).toLocaleDateString()}
                        </p>
                      </Col>
                    </Row>
                  </div>

                  {/* Template Info */}
                  {templateData?.template ? (
                    <div className="mb-4 p-3 bg-info bg-opacity-10 rounded border border-info">
                      <h6 className="mb-2">
                        <i className="fas fa-file-alt me-2"></i>
                        Template: {templateData.template.templateName}
                      </h6>
                      {templateData.template.description && (
                        <p className="mb-0 text-muted">{templateData.template.description}</p>
                      )}
                    </div>
                  ) : (
                    <Alert variant="warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      No template is linked to this service. Please contact administrator to link a
                      template first.
                    </Alert>
                  )}

                  {templateData?.template && (
                    <Form noValidate>
                      {/* Template Content */}
                      <Row className="mb-4">
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <strong>Template Content</strong>{' '}
                              {!isEditable && <span className="text-muted">(Read Only)</span>}
                              {isEditable && <span className="text-danger">*</span>}
                            </Form.Label>
                            <SimpleCkEditor
                              value={values.templateContent}
                              onChange={value => setFieldValue('templateContent', value)}
                              readOnly={!isEditable}
                              height="300px"
                              placeholder={
                                isEditable
                                  ? 'Enter template content...'
                                  : 'No template content available'
                              }
                            />
                            {touched.templateContent && errors.templateContent && (
                              <div className="text-danger mt-1">
                                <small>{errors.templateContent}</small>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Report Fields */}
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <strong>Findings</strong>{' '}
                              {isEditable && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              placeholder={
                                isEditable ? 'Enter your findings...' : 'No findings recorded'
                              }
                              value={values.findings}
                              onChange={e => setFieldValue('findings', e.target.value)}
                              readOnly={!isEditable}
                              isInvalid={touched.findings && !!errors.findings}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.findings}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <strong>Impression</strong>{' '}
                              {isEditable && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              placeholder={
                                isEditable ? 'Enter your impression...' : 'No impression recorded'
                              }
                              value={values.impression}
                              onChange={e => setFieldValue('impression', e.target.value)}
                              readOnly={!isEditable}
                              isInvalid={touched.impression && !!errors.impression}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.impression}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <strong>Methodology</strong>
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder={
                                isEditable ? 'Enter methodology...' : 'No methodology recorded'
                              }
                              value={values.methodology}
                              onChange={e => setFieldValue('methodology', e.target.value)}
                              readOnly={!isEditable}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Status Information */}
                      {isAuthorized && (
                        <Alert variant="success">
                          <i className="fas fa-check-circle me-2"></i>
                          This report has been authorized and cannot be edited. Use the print option
                          to generate the report.
                        </Alert>
                      )}

                      {!isEditable && !isAuthorized && (
                        <Alert variant="info">
                          <i className="fas fa-info-circle me-2"></i>
                          This report is not in a pending state and cannot be edited.
                        </Alert>
                      )}
                    </Form>
                  )}
                </>
              )}

              <Modal.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="text-muted">
                    <small>
                      <i className="fas fa-info-circle me-1"></i>
                      {isEditable
                        ? 'Saving will authorize the report and prevent further edits'
                        : isAuthorized
                          ? 'Report has been authorized'
                          : 'Report is not editable in current state'}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
                      {isEditable ? 'Cancel' : 'Close'}
                    </Button>
                    {isAuthorized && (
                      <Button
                        variant="success"
                        onClick={handlePrintReport}
                        className="d-flex align-items-center"
                      >
                        <i className="fas fa-print me-2"></i>
                        Print Report
                      </Button>
                    )}
                    {isEditable && templateData?.template && (
                      <Button variant="success" onClick={() => handleSubmit()} disabled={saving}>
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving & Authorizing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Save & Authorize
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RadiologyTemplateEditor;
