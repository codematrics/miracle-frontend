import { Badge, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Field, Form, Formik } from 'formik';

import CommonModal from '../../../../components/Common/CommonModal';
import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import bedAPIService from '../../../../services/BedService';
import { loadPatientOptions } from '../../../../services/PatientsService';
import { loadIPDServiceOptions } from '../../../../services/ServicesService';
import IPDApiService from '../../../../services/ipdService';
import { createIPDSchema, updateIPDSchema } from '../Reception/schemas/ipdValidation';

const PAYMENT_MODES = {
  CASH: 'Cash',
  CARD: 'Card',
  UPI: 'UPI',
};

// ---------- Info Cards ----------
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
    <Card.Header className="bg-success text-white">Referring Doctor</Card.Header>
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

const BedInfoCard = ({ bed }) => (
  <Card className="mb-3 shadow-sm">
    <Card.Header className="bg-info text-white">Bed Details</Card.Header>
    <Card.Body>
      <p className="mb-1">
        <strong>Bed No:</strong> {bed.bedNumber}{' '}
        <Badge bg={bed.status === 'occupied' ? 'danger' : 'success'}>{bed.status}</Badge>
      </p>
      <p className="mb-1">
        <strong>Type:</strong> {bed.type}
      </p>
      <p className="mb-1">
        <strong>Ward:</strong> {bed.ward?.name}
      </p>
    </Card.Body>
  </Card>
);

// ---------- Main Component ----------
const IPDCreateAndUpdate = ({ data, open, onClose, refetch }) => {
  const { loadDoctorOptions } = useDoctorAPI();

  const handleSubmit = async (values, form) => {
    form.setSubmitting(true);
    const updatedFields = {
      ...values,
      services: values?.services || [],
      patient: values?.patient?.value,
      bed: values?.bed?.value,
      referringDoctor: values?.referringDoctor?.value,
    };

    console.log(values, 'updatedFields');
    try {
      if (data) {
        // Send updated fields (or full values if simpler)
        await IPDApiService.update(data._id, updatedFields);
        toast.success('IPD updated successfully');
      } else {
        await IPDApiService.create(updatedFields);
        toast.success('IPD created successfully');
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err?.message || 'IPD creation Failed');
    }
    refetch?.();
    onClose(false);
    form.setSubmitting(false);
  };

  const handleDischarge = async (values, setSubmitting) => {
    try {
      const payload = { patientStatus: 'Discharged' };
      await IPDApiService.update(data._id, payload);
      toast.success('Patient discharged successfully');
      refetch?.();
      onClose(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error discharging patient');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonModal
      title={data ? 'Update IPD' : 'Create IPD'}
      open={open}
      onClose={onClose}
      confirmButtonText={data ? 'Update IPD' : 'Create IPD'}
      size="lg"
    >
      <Formik
        enableReinitialize
        initialValues={{
          services:
            data?.services.map(s => ({
              serviceId: s.serviceId._id || s.serviceId,
              name: s.serviceId.serviceName || s.name,
              price: s.price,
              quantity: s.quantity,
              amount: s.price * s.quantity,
              label: s.name,
              value: s.serviceId._id || s.serviceId,
            })) || [],
          patient: data ? { value: data.patient._id, label: data.patient.name } : null,
          bed: data?.bed ? { value: data?.bed._id, label: data?.bed.name } : null,
          referringDoctor: data
            ? { value: data.referringDoctor._id, label: data.referringDoctor.name }
            : null,
          discount: data?.discount || 0,
          paidAmount: data?.paidAmount || 0,
          paymentMode: data?.paymentMode || PAYMENT_MODES.CASH,
        }}
        validationSchema={data ? updateIPDSchema : createIPDSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => {
          const gross = values.services.reduce((sum, s) => sum + s.amount, 0);
          const net = gross - (values.discount || 0);
          const due = net - (values.paidAmount || 0);

          console.log(errors);
          return (
            <Form>
              {/* Patient */}
              {!data ? (
                <div className="mb-3">
                  <label>
                    Patient<span className="text-danger">*</span>
                  </label>
                  <PaginatedSelect
                    name="patient"
                    loadOptions={loadPatientOptions}
                    placeholder="Search patient..."
                  />
                </div>
              ) : (
                <PatientInfoCard patient={data.patient} />
              )}

              {/* Doctor */}
              {!data ? (
                <div className="mb-3">
                  <label>
                    Doctor<span className="text-danger">*</span>
                  </label>
                  <PaginatedSelect
                    name="referringDoctor"
                    loadOptions={loadDoctorOptions}
                    placeholder="Search doctor..."
                  />
                </div>
              ) : (
                <DoctorInfoCard doctor={data.referringDoctor} />
              )}

              {/* Bed */}
              {!data ? (
                <div className="mb-3">
                  <label>
                    Bed<span className="text-danger">*</span>
                  </label>
                  <PaginatedSelect
                    name="bed"
                    loadOptions={bedAPIService.loadBedOptions}
                    placeholder="Search bed..."
                  />
                </div>
              ) : (
                <BedInfoCard bed={data.bed} />
              )}

              {/* Services */}
              <div className="mb-3">
                <label>Services</label>
                <PaginatedSelect
                  name="services"
                  isMulti
                  loadOptions={loadIPDServiceOptions}
                  placeholder="Search & add services..."
                  value={values.services.map(s => ({
                    value: s.serviceId,
                    label: s.name,
                    price: s.price,
                    qty: s.quantity,
                  }))}
                  selectCallback={options => {
                    const mapped = options.map(o => ({
                      serviceId: o.value,
                      name: o.label,
                      price: o.price,
                      quantity: o.qty || 1,
                      amount: (o.qty || 1) * o.price,
                    }));
                    setFieldValue('services', mapped);
                  }}
                />
              </div>

              {/* Services Table */}
              {values.services.length > 0 && (
                <Card className="mb-3 shadow-sm">
                  <Card.Header className="bg-warning text-dark">Services</Card.Header>
                  <Card.Body className="p-0">
                    <Table bordered size="sm" responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Service</th>
                          <th style={{ width: '80px' }}>Qty</th>
                          <th style={{ width: '100px' }}>Price</th>
                          <th>Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.services.map((s, idx) => (
                          <tr key={idx}>
                            <td>{s.name}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={s.quantity}
                                className="form-control"
                                style={{ minWidth: '70px' }}
                                onChange={e => {
                                  const qty = parseInt(e.target.value) || 1;
                                  const updated = [...values.services];
                                  updated[idx].quantity = qty;
                                  updated[idx].amount = qty * updated[idx].price;
                                  setFieldValue('services', updated);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                value={s.price}
                                className="form-control"
                                style={{ minWidth: '80px' }}
                                onChange={e => {
                                  const price = parseFloat(e.target.value) || 0;
                                  const updated = [...values.services];
                                  updated[idx].price = price;
                                  updated[idx].amount = price * updated[idx].quantity;
                                  setFieldValue('services', updated);
                                }}
                              />
                            </td>
                            <td>₹{s.amount}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  const updated = values.services.filter((_, i) => i !== idx);
                                  setFieldValue('services', updated);
                                }}
                              >
                                ×
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Billing Summary */}
              <Card className="shadow-sm mb-3">
                <Card.Header className="bg-secondary text-white">Billing Summary</Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={3}>
                      <label>Gross</label>
                      <input value={gross} readOnly className="form-control" />
                    </Col>
                    <Col md={3}>
                      <label>Discount</label>
                      <Field type="number" name="discount" className="form-control" />
                    </Col>
                    <Col md={3}>
                      <label>Net</label>
                      <input value={net} readOnly className="form-control" />
                    </Col>
                    <Col md={3}>
                      <label>Paid</label>
                      <Field type="number" name="paidAmount" className="form-control" />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Due</label>
                      <input
                        value={due}
                        readOnly
                        className="form-control"
                        style={{ color: due > 0 ? 'red' : 'black', fontWeight: 'bold' }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Footer Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button onClick={onClose} variant="dark btn-sm" type="button">
                  Close
                </Button>

                {data && data.patientStatus !== 'Discharged' && (
                  <Button
                    variant="warning btn-sm"
                    type="button"
                    onClick={() => handleDischarge(values, true)}
                  >
                    Discharge
                  </Button>
                )}

                <Button variant="primary btn-sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <>{data ? 'Update IPD' : 'Create IPD'}</>
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

export default IPDCreateAndUpdate;
