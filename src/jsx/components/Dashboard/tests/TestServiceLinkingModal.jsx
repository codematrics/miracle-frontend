import { useEffect, useState } from 'react';
import { Button, Modal, Form as RBForm, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { getServicesWithLabTest, linkServicesToLabTest } from '../../../../services/LabTestService';

// ✅ Validation Schema
const linkingSchema = Yup.object({
  serviceIds: Yup.array().of(Yup.string()).min(1, 'Select at least one service'),
});

const LinkServicesModal = ({ show, onHide, testId, onLinked }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // ✅ Fetch services with linked flag
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServicesWithLabTest(testId);
      if (res.status) {
        setServices(res.data);
        setFilteredServices(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch services');
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && testId) fetchServices();
  }, [show, testId]);

  // ✅ Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredServices(services);
    } else {
      const q = search.toLowerCase();
      setFilteredServices(
        services.filter(
          s =>
            s.serviceName.toLowerCase().includes(q) ||
            (s.code && s.code.toLowerCase().includes(q)) ||
            (s.serviceHead && s.serviceHead.toLowerCase().includes(q))
        )
      );
    }
  }, [search, services]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await linkServicesToLabTest(testId, values.serviceIds);

      if (res.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.message || 'Services linked successfully',
          timer: 1500,
          showConfirmButton: false,
        });
        onHide();
        if (onLinked) onLinked(res.data);
      } else {
        throw new Error(res.message || 'Failed to link services');
      }
    } catch (err) {
      toast.error(err.message || 'Error linking services');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Link Services to Lab Test</Modal.Title>
      </Modal.Header>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center p-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Formik
          initialValues={{
            serviceIds: services.filter(s => s.isLinked).map(s => s._id),
          }}
          enableReinitialize
          validationSchema={linkingSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Modal.Body className="px-4">
                {/* 🔍 Search Box */}
                <RBForm.Control
                  type="text"
                  placeholder="Search by name, code, or head..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mb-3"
                />

                {/* ✅ Table */}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>Select</th>
                      <th>Service Name</th>
                      <th>Code</th>
                      <th>Service Head</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length > 0 ? (
                      filteredServices.map(service => (
                        <tr key={service._id}>
                          <td>
                            <Field
                              type="checkbox"
                              name="serviceIds"
                              value={service._id}
                              checked={values.serviceIds.includes(service._id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFieldValue('serviceIds', [...values.serviceIds, service._id]);
                                } else {
                                  setFieldValue(
                                    'serviceIds',
                                    values.serviceIds.filter(id => id !== service._id)
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>{service.serviceName}</td>
                          <td>{service.code}</td>
                          <td>{service.serviceHead}</td>
                          <td>{service.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No services found
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

export default LinkServicesModal;
