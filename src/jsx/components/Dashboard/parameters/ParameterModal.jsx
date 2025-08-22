import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { FieldArray, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { PARAMETER_DATATYPE_ENUM } from '../../../../constants/enums';
import { createParameter, updateParameter } from '../../../../services/ParameterService';
import { fetchServices, transformServicesForSelect } from '../../../../services/ServicesService';
import FormField from '../Reception/components/FormField';

const parameterSchema = Yup.object({
  serviceId: Yup.string().required('Service is required'),
  parameterName: Yup.string()
    .required('Parameter name is required')
    .max(200, 'Parameter name must be less than 200 characters'),
  unit: Yup.string().max(50, 'Unit must be less than 50 characters'),
  referenceRange: Yup.string().max(200, 'Reference range must be less than 200 characters'),

  maleRange: Yup.string(),
  femaleRange: Yup.string(),
  childRange: Yup.string(),
  adultRange: Yup.string(),

  minValue: Yup.number().nullable(),
  maxValue: Yup.number().nullable(),
  decimalPlaces: Yup.number().integer().min(0).max(5).nullable(),

  dataType: Yup.mixed()
    .oneOf(Object.values(PARAMETER_DATATYPE_ENUM))
    .required('Data type is required'),
  options: Yup.array()
    .of(Yup.string())
    .when('dataType', {
      is: 'select',
      then: schema => schema.min(1, 'At least one option is required for select type'),
      otherwise: schema => schema.notRequired(),
    }),

  criticalLow: Yup.number().nullable(),
  criticalHigh: Yup.number().nullable(),

  formula: Yup.string(),
  methodology: Yup.string().max(100, 'Methodology must be less than 100 characters'),
  instrumentUsed: Yup.string(),

  sortOrder: Yup.number().integer().min(0).default(0),
  isActive: Yup.boolean().default(true),
  printOnReport: Yup.boolean().default(true),
});

const initialValues = {
  serviceId: '',
  parameterName: '',
  unit: '',
  referenceRange: '',
  maleRange: '',
  femaleRange: '',
  childRange: '',
  adultRange: '',
  minValue: '',
  maxValue: '',
  decimalPlaces: 0,
  criticalLow: '',
  criticalHigh: '',
  dataType: 'numeric',
  options: [],
  formula: '',
  methodology: '',
  instrumentUsed: '',
  sortOrder: 0,
  isActive: true,
  printOnReport: true,
};

const ParameterModal = ({ show, onHide, serviceId, parameter = null, onParameterSaved }) => {
  const [servicesOptions, setServicesOptions] = useState([]);
  const formikRef = useRef();

  // Extract serviceId from parameter data when editing
  const effectiveServiceId = serviceId || parameter?.serviceId?._id;

  console.log('serviceId prop:', serviceId);
  console.log('parameter serviceId:', parameter?.serviceId);
  console.log('effective serviceId:', effectiveServiceId);

  const getInitialValues = () => {
    if (parameter) {
      return {
        serviceId: effectiveServiceId || '',
        parameterName: parameter.parameterName || '',
        unit: parameter.unit || '',
        referenceRange: parameter.referenceRange || '',
        maleRange: parameter.maleRange || '',
        femaleRange: parameter.femaleRange || '',
        childRange: parameter.childRange || '',
        adultRange: parameter.adultRange || '',
        minValue: parameter.minValue ?? '',
        maxValue: parameter.maxValue ?? '',
        decimalPlaces: parameter.decimalPlaces ?? 0,
        criticalLow: parameter.criticalLow ?? '',
        criticalHigh: parameter.criticalHigh ?? '',
        dataType: parameter.dataType || 'numeric',
        options: parameter.options || [],
        formula: parameter.formula || '',
        methodology: parameter.methodology || '',
        instrumentUsed: parameter.instrumentUsed || '',
        sortOrder: parameter.sortOrder ?? 0,
        isActive: parameter.isActive ?? true,
        printOnReport: parameter.printOnReport ?? true,
      };
    }
    return {
      ...initialValues,
      serviceId: effectiveServiceId || '',
    };
  };

  const loadServices = useCallback(async (searchQuery = '') => {
    try {
      const response = await fetchServices(searchQuery);
      if (response.success) {
        const transformedServices = transformServicesForSelect(response.data);
        setServicesOptions(transformedServices);
      } else {
        toast.error('Failed to load services', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Error loading services. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Transform data to match exact backend API format
      const payload = {
        serviceId: effectiveServiceId || values.serviceId,
        parameterName: values.parameterName.trim(),
        dataType: values.dataType,
      };

      const isEditing = Boolean(parameter);

      // Add optional fields only if they have values
      if (values.unit && values.unit.trim()) {
        payload.unit = values.unit.trim();
      }
      if (values.referenceRange && values.referenceRange.trim()) {
        payload.referenceRange = values.referenceRange.trim();
      }
      if (values.maleRange && values.maleRange.trim()) {
        payload.maleRange = values.maleRange.trim();
      }
      if (values.femaleRange && values.femaleRange.trim()) {
        payload.femaleRange = values.femaleRange.trim();
      }
      if (values.childRange && values.childRange.trim()) {
        payload.childRange = values.childRange.trim();
      }
      if (values.adultRange && values.adultRange.trim()) {
        payload.adultRange = values.adultRange.trim();
      }
      if (values.minValue !== null && values.minValue !== '') {
        payload.minValue = parseFloat(values.minValue);
      }
      if (values.maxValue !== null && values.maxValue !== '') {
        payload.maxValue = parseFloat(values.maxValue);
      }
      if (values.decimalPlaces !== null && values.decimalPlaces !== '') {
        payload.decimalPlaces = parseInt(values.decimalPlaces, 10);
      }
      if (values.criticalLow !== null && values.criticalLow !== '') {
        payload.criticalLow = parseFloat(values.criticalLow);
      }
      if (values.criticalHigh !== null && values.criticalHigh !== '') {
        payload.criticalHigh = parseFloat(values.criticalHigh);
      }
      if (values.formula && values.formula.trim()) {
        payload.formula = values.formula.trim();
      }
      if (values.methodology && values.methodology.trim()) {
        payload.methodology = values.methodology.trim();
      }
      if (values.instrumentUsed && values.instrumentUsed.trim()) {
        payload.instrumentUsed = values.instrumentUsed.trim();
      }
      if (values.sortOrder !== null && values.sortOrder !== '') {
        payload.sortOrder = parseInt(values.sortOrder, 10);
      }
      if (typeof values.isActive === 'boolean') {
        payload.isActive = values.isActive;
      }
      if (typeof values.printOnReport === 'boolean') {
        payload.printOnReport = values.printOnReport;
      }
      // Add options for select type
      if (values.dataType === 'select' && values.options && values.options.length > 0) {
        payload.options = values.options
          .filter(option => option && option.trim())
          .map(option => option.trim());
      }

      let response;
      if (isEditing) {
        // For editing, we would need an updateParameter function
        response = await updateParameter(parameter.id, payload);
      } else {
        response = await createParameter(payload);
      }

      if (response.success) {
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
        throw new Error(
          response.message || `Failed to ${isEditing ? 'update' : 'create'} parameter`
        );
      }
    } catch (error) {
      // Enhanced error handling for backend responses
      if (error.response?.status === 400) {
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          const firstError = error.response.data.errors[0];
          toast.error(firstError.message || firstError.msg || 'Validation failed', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(error.response.data?.message || 'Validation failed', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        const isEditing = Boolean(parameter);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            `Failed to ${isEditing ? 'update' : 'create'} parameter`,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      loadServices();
    }
  }, [show, loadServices]);

  // Debug log for troubleshooting
  useEffect(() => {
    if (show) {
      console.log('Modal opened with:');
      console.log('- serviceId prop:', serviceId);
      console.log('- parameter:', parameter);
      console.log('- effectiveServiceId:', effectiveServiceId);
      console.log('- Available services:', servicesOptions.length, 'services loaded');
      console.log('- Services:', servicesOptions);
    }
  }, [show, parameter, serviceId, effectiveServiceId, servicesOptions]);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{parameter ? 'Edit Parameter' : 'Add Parameter'}</Modal.Title>
      </Modal.Header>

      <Formik
        ref={formikRef}
        initialValues={getInitialValues()}
        validationSchema={parameterSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                {/* Basic Info */}
                <FormField
                  type="select"
                  name="serviceId"
                  label={
                    <>
                      Select the service <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  className="col-md-6"
                  options={[
                    { value: '', label: 'Select Service' },
                    ...servicesOptions.map(service => ({
                      value: service.value || service.id,
                      label: service.label || service.name,
                    })),
                  ]}
                  disabled={!!effectiveServiceId && !!parameter}
                />
                <FormField
                  name="parameterName"
                  label={
                    <>
                      Parameter Name <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  className="col-md-6"
                />
                <FormField name="unit" label="Unit" className="col-md-6" />
                <FormField
                  type="select"
                  name="dataType"
                  label={
                    <>
                      Data Type <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  className="col-md-6"
                  options={[
                    { value: 'numeric', label: 'Numeric' },
                    { value: 'text', label: 'Text' },
                    { value: 'boolean', label: 'Boolean' },
                    { value: 'select', label: 'Select' },
                  ]}
                />

                {/* Ranges */}
                <FormField name="referenceRange" label="Reference Range" className="col-md-6" />
                <FormField name="maleRange" label="Male Range" className="col-md-6" />
                <FormField name="femaleRange" label="Female Range" className="col-md-6" />
                <FormField name="childRange" label="Child Range" className="col-md-6" />
                <FormField name="adultRange" label="Adult Range" className="col-md-6" />

                {/* Numeric fields */}
                {values.dataType === 'numeric' && (
                  <>
                    <FormField
                      type="number"
                      name="minValue"
                      label="Min Value"
                      className="col-md-4"
                    />
                    <FormField
                      type="number"
                      name="maxValue"
                      label="Max Value"
                      className="col-md-4"
                    />
                    <FormField
                      type="number"
                      name="decimalPlaces"
                      label="Decimal Places"
                      className="col-md-4"
                    />
                    <FormField
                      type="number"
                      name="criticalLow"
                      label="Critical Low"
                      className="col-md-6"
                    />
                    <FormField
                      type="number"
                      name="criticalHigh"
                      label="Critical High"
                      className="col-md-6"
                    />
                  </>
                )}

                {/* Select Options */}
                {values.dataType === 'select' && (
                  <div className="col-12">
                    <label className="form-label">
                      Options <span style={{ color: 'red' }}>*</span>
                    </label>
                    <FieldArray
                      name="options"
                      render={arrayHelpers => (
                        <div className="border rounded p-3">
                          {values.options && values.options.length > 0 ? (
                            values.options.map((opt, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <div className="flex-grow-1 me-2">
                                  <FormField
                                    name={`options.${index}`}
                                    placeholder={`Option ${index + 1}`}
                                    className="mb-0"
                                  />
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => arrayHelpers.remove(index)}
                                  className="ms-2"
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted mb-2">No options added yet</p>
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => arrayHelpers.push('')}
                            className="mt-2"
                          >
                            <i className="fa fa-plus me-1"></i> Add Option
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Technical details */}
                <FormField name="formula" label="Formula" className="col-md-6" />
                <FormField name="methodology" label="Methodology" className="col-md-6" />
                <FormField name="instrumentUsed" label="Instrument Used" className="col-md-6" />

                {/* Report Settings */}
                <FormField type="number" name="sortOrder" label="Sort Order" className="col-md-4" />
                <FormField
                  type="select"
                  name="isActive"
                  label="Status"
                  className="col-md-4"
                  options={[
                    { value: true, label: 'Active' },
                    { value: false, label: 'Inactive' },
                  ]}
                />
                <FormField
                  type="select"
                  name="printOnReport"
                  label="Print on Report"
                  className="col-md-4"
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ]}
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
