import { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { FieldArray, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { PARAMETER_DATATYPE_ENUM } from '../../../../constants/enums';
import { createParameter } from '../../../../services/ParameterService';
import { fetchServices, transformServicesForSelect } from '../../../../services/ServicesService';
import FormField from '../Reception/components/FormField';

const parameterSchema = Yup.object({
  serviceId: Yup.string().required('Service is required'),
  parameterName: Yup.string().required('Parameter name is required'),
  parameterCode: Yup.string(),
  unit: Yup.string(),
  referenceRange: Yup.string(),

  maleRange: Yup.string(),
  femaleRange: Yup.string(),
  childRange: Yup.string(),
  adultRange: Yup.string(),

  minValue: Yup.number(),
  maxValue: Yup.number(),
  decimalPlaces: Yup.number().integer().min(0).max(5),

  dataType: Yup.mixed()
    .oneOf(Object.values(PARAMETER_DATATYPE_ENUM))
    .required('Data type is required'),
  options: Yup.array().of(Yup.string()),

  criticalLow: Yup.number(),
  criticalHigh: Yup.number(),

  formula: Yup.string(),
  methodology: Yup.string(),
  instrumentUsed: Yup.string(),

  sortOrder: Yup.number().integer().default(0),
  isActive: Yup.boolean().default(true),
  printOnReport: Yup.boolean().default(true),
});

const initialValues = {
  serviceId: '',
  parameterName: '',
  parameterCode: '',
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

const ParameterModal = ({ show, onHide, serviceId, onParameterSaved }) => {
  const [servicesOptions, setServicesOptions] = useState([]);

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
      const payload = { ...values, serviceId: serviceId || values.serviceId };
      const response = await createParameter(payload);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Parameter created successfully',
          timer: 1500,
          showConfirmButton: false,
        });
        resetForm();
        onHide();
        if (onParameterSaved) onParameterSaved(response.data);
      } else {
        throw new Error(response.message || 'Failed to create parameter');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Parameter</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
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
                  label="Select the service*"
                  className="col-md-6"
                  options={servicesOptions}
                />
                <FormField name="parameterName" label="Parameter Name*" className="col-md-6" />
                <FormField name="parameterCode" label="Parameter Code*" className="col-md-6" />
                <FormField name="unit" label="Unit*" className="col-md-6" />
                <FormField
                  type="select"
                  name="dataType"
                  label="Data Type*"
                  className="col-md-6"
                  options={[
                    { value: 'numeric', label: 'Numeric' },
                    { value: 'text', label: 'Text' },
                    { value: 'boolean', label: 'Boolean' },
                    { value: 'select', label: 'Select' },
                  ]}
                />

                {/* Ranges */}
                <FormField name="referenceRange" label="Reference Range*" className="col-md-6" />
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
                  <div className="col-md-12">
                    <label className="form-label">Options</label>
                    <FieldArray
                      name="options"
                      render={arrayHelpers => (
                        <div>
                          {values.options && values.options.length > 0 ? (
                            values.options.map((opt, index) => (
                              <div key={index} className="d-flex mb-2">
                                <FormField name={`options.${index}`} className="flex-grow-1 me-2" />
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No options added</p>
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => arrayHelpers.push('')}
                          >
                            + Add Option
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
                  label="Status*"
                  className="col-md-4"
                  options={[
                    { value: true, label: 'Active' },
                    { value: false, label: 'Inactive' },
                  ]}
                />
                <FormField
                  type="select"
                  name="printOnReport"
                  label="Print on Report*"
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
                {isSubmitting ? 'Saving...' : 'Save Parameter'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ParameterModal;
