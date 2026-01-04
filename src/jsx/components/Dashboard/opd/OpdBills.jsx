import { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import PaginatedSelect from '../../../../components/Common/PaginatedSelect';
import { PAYMENT_MODES } from '../../../../constants/enums';
import useDoctorAPI from '../../../../hooks/useDoctorAPI';
import { loadPatientOptions } from '../../../../services/PatientsService';
import { loadOPDServiceOptions } from '../../../../services/ServicesService';
import OPDApiService from '../../../../services/opdService';
import FormField from '../Reception/components/FormField';

// Service Schema
const serviceSchema = Yup.object().shape({
  serviceId: Yup.string().min(1, 'Service ID is required').required('Service ID is required'),
  price: Yup.number()
    .min(0, 'Rate must be greater than or equal to 0')
    .required('Rate is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .default(1)
    .required('Quantity is required'),
  amount: Yup.number()
    .min(0, 'Amount must be greater than or equal to 0')
    .required('Amount is required'),
});

// Billing Schema
const billingSchema = Yup.object().shape({
  grossAmount: Yup.number()
    .min(0, 'Gross Amount must be greater than or equal to 0')
    .required('Gross Amount is required'),
  discount: Yup.number().min(0, 'Discount value must be greater than or equal to 0').default(0),
  netAmount: Yup.number()
    .min(0, 'Net amount must be greater than or equal to 0')
    .required('Net Amount is required'),
});

// Main OPD Bill Schema
export const opdBillSchema = Yup.object()
  .shape({
    patient: Yup.object()
      .shape({
        value: Yup.string().required('Patient is required'),
        label: Yup.string(), // optional
      })
      .required('Patient is required'),
    consultantDoctor: Yup.object()
      .shape({
        value: Yup.string().required('Consultant doctor is required'),
        label: Yup.string(), // optional
      })
      .required('Consultant doctor is required'),

    referredBy: Yup.object()
      .shape({
        value: Yup.string().required('Referred by is required'),
        label: Yup.string(),
      })
      .required('Referred by is required'),
    paymentMode: Yup.mixed().oneOf(Object.values(PAYMENT_MODES), 'Invalid Payment Mode').optional(),
    paidAmount: Yup.number()
      .min(0, 'Paid amount must be greater than or equal to 0')
      .default(0)
      .required('Paid Amount is required'),
    services: Yup.array().of(serviceSchema).min(1, 'At least one service is required'),
    billing: billingSchema,
    mobileNumber: Yup.string().optional(),
    referenceNumber: Yup.string().optional(),
  })
  // Custom validation for service amount = rate × quantity
  .test('number-check', 'Fields must be numbers', data => {
    //if card or upi is selected, reference number and mobile number is required
    if (!data) return true;
    if (data.paymentMode === PAYMENT_MODES.CARD || data.paymentMode === PAYMENT_MODES.UPI) {
      if (!data.mobileNumber) return false;
      if (!data.referenceNumber) return false;
    }
  })
  .test('service-amount-check', 'Service amounts must equal price × quantity', data => {
    if (!data || !data.services) return true;
    return data.services.every(s => s.amount === s.price * s.quantity);
  })
  // Custom validation for net amount = gross - discount
  .test('net-amount-check', 'Net amount must equal services total minus discount', data => {
    if (!data || !data.services || !data.billing) return true;
    const servicesTotal = data.services.reduce((sum, s) => sum + s.amount, 0);
    const expectedNet = Math.max(servicesTotal - (data.billing.discount || 0), 0);
    return Math.abs(data.billing.netAmount - expectedNet) < 0.01;
  })
  // Custom validation for paid ≤ net amount
  .test('paid-check', 'Paid amount cannot exceed Net amount', data => {
    if (!data || !data.billing) return true;
    const expectedBalance = data.billing.netAmount - (data.paidAmount || 0);
    return expectedBalance >= 0;
  });

// Initial Values
export const initialOpdBillValues = {
  patient: '',
  referredBy: 'Self',
  consultantDoctor: '',
  paymentMode: PAYMENT_MODES.CASH,
  paidAmount: 0,
  services: [],
  billing: {
    grossAmount: 0,
    discount: 0,
    netAmount: 0,
  },
};

const OpdBills = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { loadDoctorOptions } = useDoctorAPI();
  const formikRef = useRef(null);
  const params = useParams();
  const billId = params?.id;
  const navigate = useNavigate();

  const resetFormData = () => {
    setSelectedPatient(null);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const recalcBilling = (values, setFieldValue) => {
    const gross = values.services?.reduce((sum, s) => sum + s.quantity * s.price, 0);
    const discount = values.billing.discount || 0;
    const net = gross - discount;
    console.log(gross, discount, net, values.services);

    setFieldValue('billing.grossAmount', gross);
    setFieldValue('billing.netAmount', net >= 0 ? net : 0);

    if (values.paidAmount > net) {
      setFieldValue('paidAmount', net);
    }
  };

  const handleSaveOpdBill = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);
      const payload = {
        ...values,
        patient: values?.patient?.value,
        services: values?.services,
        consultantDoctor: values?.consultantDoctor?.value,
        referredBy: values?.referredBy?.value,
      };

      if (billId) {
        await OPDApiService.update(billId, payload);
        toast.success('OPD Edited Successfully');
      } else {
        await OPDApiService.create(payload);
        toast.success('OPD Created Successfully');
      }

      navigate(`/opd-bill`);
    } catch (error) {
      console.error('Error creating OPD bill:', error);
      toast.error(error.response?.data?.message || 'Failed to save OPD Bill');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (billId) {
        try {
          const response = await OPDApiService.getOne(billId);
          response?.data && setData(response?.data);
        } catch (err) {
          toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch OPD bill');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetch();
  }, [billId]);

  if (loading) {
    return <p>Loading</p>;
  }

  if (!data && billId) {
    return <p>Data Not Found</p>;
  }

  return (
    <Formik
      innerRef={formikRef}
      initialValues={
        data
          ? {
              patient: {
                ...data?.patient,
                label: data?.patient?.name,
                value: data?.patient?.uhidNo,
              },
              referredBy: {
                ...data?.referringDoctor,
                label: data?.referringDoctor?.name,
                value: data?.referringDoctor?._id,
              },
              consultantDoctor: {
                ...data?.consultantDoctor,
                label: data?.consultantDoctor?.name,
                value: data?.consultantDoctor?._id,
              },
              paymentMode: data?.paymentMode,
              paidAmount: data?.paidAmount,
              services: data?.services?.map(s => ({
                ...s,
                value: s.serviceId?._id,
                label: s?.serviceId?.serviceName,
                name: s?.serviceId?.serviceName,
                serviceId: s.serviceId?._id,
              })),
              mobileNumber: data?.mobileNumber,
              referenceNumber: data?.referenceNumber,
              billing: data?.billing,
            }
          : initialOpdBillValues
      }
      validationSchema={opdBillSchema}
      onSubmit={handleSaveOpdBill}
      enableReinitialize
    >
      {formik => (
        <OpdBillForm
          formik={formik}
          recalcBilling={recalcBilling}
          resetFormData={resetFormData}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          loadDoctorOptions={loadDoctorOptions}
        />
      )}
    </Formik>
  );
};

const OpdBillForm = ({
  formik,
  recalcBilling,
  resetFormData,
  selectedPatient,
  setSelectedPatient,
  loadDoctorOptions,
}) => {
  const { values, setFieldValue, isSubmitting, errors } = formik;
  const { loadReferredDoctorOptions } = useDoctorAPI();

  // ✅ Hook is legal here
  useEffect(() => {
    recalcBilling(values, setFieldValue);
  }, [values.services, values.billing.discount]);

  return (
    <Form>
      <div className="row mb-4">
        <div className="col-md-12">
          <label>
            Search Patient <span className="text-danger">*</span>
          </label>
          <PaginatedSelect
            name="patient"
            loadOptions={loadPatientOptions}
            selectCallback={option => {
              setSelectedPatient(option);
            }}
            placeholder="Search patient..."
          />
        </div>
      </div>
      {selectedPatient && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body py-3">
                <h6 className="card-title mb-2">
                  <i className="fa fa-info-circle me-2 text-info"></i>Patient Information
                </h6>
                <div className="row text-nowrap" style={{ fontSize: '14px' }}>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <div className="d-flex">
                      <strong className="me-1 text-nowrap">UHID:</strong>
                      <span className="text-truncate">
                        {selectedPatient.UHID || selectedPatient.value}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <div className="d-flex">
                      <strong className="me-1 text-nowrap">Name:</strong>
                      <span className="text-truncate" title={selectedPatient.label}>
                        {selectedPatient.label}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2">
                    <div className="d-flex">
                      <strong className="me-1 text-nowrap">Mobile:</strong>
                      <span className="text-nowrap">{selectedPatient.mobileNumber}</span>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2">
                    <div className="d-flex">
                      <strong className="me-1 text-nowrap">{selectedPatient?.relation}:</strong>
                      <span className="text-truncate" title={selectedPatient.relativeName}>
                        {selectedPatient.relativeName}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2">
                    <div className="d-flex">
                      <strong className="me-1 text-nowrap">Age/Gender:</strong>
                      <span>
                        {selectedPatient.age}/{selectedPatient.gender}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Visit Details */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="fa fa-clipboard me-2 text-success"></i>Visit Details
              </h6>
              <div className="row">
                <PaginatedSelect
                  name="referredBy"
                  label="Referred By"
                  loadOptions={loadReferredDoctorOptions}
                  placeholder="Search doctor..."
                  className="col-md-6"
                />
                <PaginatedSelect
                  name="consultantDoctor"
                  label="Consultant Doctor"
                  loadOptions={loadDoctorOptions}
                  placeholder="Search doctor..."
                  className="col-md-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="row mb-4">
        <PaginatedSelect
          name="services"
          label="Add Services"
          loadOptions={loadOPDServiceOptions}
          isMulti
          selectCallback={options => {
            const services = options.map(o => ({
              ...o,
              serviceId: o.value,
              price: o.price,
              quantity: o.qty || 1,
              amount: (o.qty || 1) * o.price,
            }));
            setFieldValue('services', services);
          }}
          placeholder="Search service..."
          className="col-12"
        />
      </div>

      {/* Services Table */}
      {values.services?.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>Service</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
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
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Billing Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label>Gross</label>
          <input value={values.billing.grossAmount} readOnly className="form-control" />
        </div>
        <div className="col-md-3">
          <label>Discount</label>
          <Field type="number" name="billing.discount" className="form-control" />
        </div>
        <div className="col-md-3">
          <label>Net</label>
          <input value={values.billing.netAmount} readOnly className="form-control" />
        </div>
        <div className="col-md-3">
          <label>Paid</label>
          <Field type="number" name="paidAmount" className="form-control" />
          <ErrorMessage name="paidAmount" component="div" className="text-danger" />
        </div>
      </div>

      {/* Payment Mode */}
      <FormField
        name="paymentMode"
        label="Payment Mode"
        type="select"
        required
        className="col-md-3"
        options={[
          { value: PAYMENT_MODES.CASH, label: 'Cash' },
          { value: PAYMENT_MODES.CARD, label: 'Card' },
          { value: PAYMENT_MODES.UPI, label: 'UPI' },
        ]}
        hideEmptyOption={true}
      />

      {/* Reference Number and Mobile Number */}
      {(values.paymentMode === PAYMENT_MODES.CARD || values.paymentMode === PAYMENT_MODES.UPI) && (
        <>
          <div className="row mb-4">
            <FormField
              name="referenceNumber"
              label="Reference Number"
              type="text"
              required
              className="col-md-6"
            />
            <FormField
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              required
              className="col-md-6"
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="mt-4 d-flex gap-2">
        <Button type="button" variant="secondary" onClick={resetFormData} disabled={isSubmitting}>
          Reset
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Bill'}
        </Button>
      </div>
    </Form>
  );
};

export default OpdBills;
