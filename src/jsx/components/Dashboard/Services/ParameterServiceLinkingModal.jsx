import { useEffect, useState } from 'react';
import { Button, Modal, Form as RBForm, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { REPORT_TYPE } from '../../../../constants/enums';
import {
  getParameterByReportType,
  linkParameterToService,
} from '../../../../services/ServicesService';
import FormField from '../Reception/components/FormField';

// ✅ Validation Schema
const linkingSchema = Yup.object({
  parameterIds: Yup.array().of(Yup.string()).min(1, 'Select at least one parameter'),
  reportType: Yup.string().oneOf(Object.values(REPORT_TYPE)),
});

const LinkParametersModal = ({ show, onHide, serviceId, onLinked }) => {
  const [parameters, setParameters] = useState([]);
  const [filteredParameters, setFilteredParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [reportType, setReportType] = useState(REPORT_TYPE.BIOCHEMISTRY); // 👈 track report type separately

  // ✅ Fetch parameters dynamically
  const fetchParameters = async (type = REPORT_TYPE.BIOCHEMISTRY) => {
    try {
      setLoading(true);
      const res = await getParameterByReportType(serviceId, type);
      if (res.status) {
        // ✅ REPLACE instead of appending
        setParameters(res.data || []);
        setFilteredParameters(res.data || []);
      } else {
        throw new Error(res.message || 'Failed to fetch parameters');
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching parameters');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch when modal opens
  useEffect(() => {
    if (show && serviceId) {
      fetchParameters(reportType);
    }
  }, [show, serviceId, reportType]);

  // ✅ Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredParameters(parameters);
    } else {
      const q = search.toLowerCase();
      setFilteredParameters(parameters.filter(s => s.parameterName.toLowerCase().includes(q)));
    }
  }, [search, parameters]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await linkParameterToService(serviceId, values);

      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.message || 'Parameters linked successfully',
          timer: 1500,
          showConfirmButton: false,
        });
        onHide();
        if (onLinked) onLinked(res.data);
      } else {
        throw new Error(res.message || 'Failed to link parameters');
      }
    } catch (err) {
      toast.error(err.message || 'Error linking parameters');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Link parameters to Lab Test</Modal.Title>
      </Modal.Header>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center p-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Formik
          initialValues={{
            parameterIds: parameters.filter(s => s.isLinked).map(s => s._id),
            reportType: reportType, // 👈 bind to state
          }}
          enableReinitialize
          validationSchema={linkingSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Modal.Body className="px-4">
                {/* Report Type */}
                <FormField
                  type="select"
                  name="reportType"
                  label="Report Type"
                  className="w-full"
                  options={[...Object.values(REPORT_TYPE).map(app => ({ value: app, label: app }))]}
                  onChange={e => {
                    const value = e.target.value;
                    setFieldValue('reportType', value);
                    setReportType(value); // 👈 update local state, triggers fetch
                  }}
                />

                {/* 🔍 Search */}
                <RBForm.Control
                  type="text"
                  placeholder="Search by name"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mb-3"
                />

                {/* ✅ Table */}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>Select</th>
                      <th>Parameter Name</th>
                      <th>Format Type</th>
                      <th>Sample Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParameters.length > 0 ? (
                      filteredParameters.map(parameter => (
                        <tr key={parameter._id}>
                          <td>
                            <Field
                              type="checkbox"
                              name="parameterIds"
                              value={parameter._id}
                              checked={values.parameterIds.includes(parameter._id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFieldValue('parameterIds', [
                                    ...values.parameterIds,
                                    parameter._id,
                                  ]);
                                } else {
                                  setFieldValue(
                                    'parameterIds',
                                    values.parameterIds.filter(id => id !== parameter._id)
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>{parameter.parameterName}</td>
                          <td>{parameter.formatType}</td>
                          <td>{parameter.sampleType}</td>
                          <td>{parameter.isActive ? 'Active' : 'InActive'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No parameters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Modal.Body>

              <Modal.Footer className="d-flex gap-2 px-4 flex-column flex-sm-row">
                <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Save Links
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default LinkParametersModal;
