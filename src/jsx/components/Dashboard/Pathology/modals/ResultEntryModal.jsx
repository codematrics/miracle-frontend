import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ResultEntryModal = ({ show, onHide, orderData, onSaveResults }) => {
  const [resultValues, setResultValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  // Initialize result values from existing data
  const initializeValues = () => {
    const initialValues = {};
    if (orderData?.reportTypeGroups) {
      Object.values(orderData.reportTypeGroups).forEach(group => {
        group.parameters?.forEach(param => {
          initialValues[param._id] = param.currentValue || '';
        });
      });
    }
    setResultValues(initialValues);
  };

  // Handle result value change
  const handleValueChange = (parameterId, value) => {
    setResultValues(prev => ({
      ...prev,
      [parameterId]: value,
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[parameterId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[parameterId];
        return newErrors;
      });
    }
  };

  // Validate individual parameter
  const validateParameter = (param, value) => {
    const errors = [];
    
    // ALL parameters are required
    if (!value || value.toString().trim() === '') {
      errors.push('This field is required');
      return errors;
    }
    
    // Validate numeric fields
    if (param.dataType === 'numeric' || param.formatType === 'Numeric') {
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        errors.push('Please enter a valid number');
      } else {
        // Check min/max range
        if (param.ref_min !== undefined && numValue < parseFloat(param.ref_min)) {
          errors.push(`Value should be at least ${param.ref_min}`);
        }
        if (param.ref_max !== undefined && numValue > parseFloat(param.ref_max)) {
          errors.push(`Value should not exceed ${param.ref_max}`);
        }
        
        // Check critical ranges
        if (param.criticalMin !== undefined && numValue < parseFloat(param.criticalMin)) {
          errors.push(`⚠️ CRITICAL: Value is below critical minimum (${param.criticalMin})`);
        }
        if (param.criticalMax !== undefined && numValue > parseFloat(param.criticalMax)) {
          errors.push(`⚠️ CRITICAL: Value exceeds critical maximum (${param.criticalMax})`);
        }
      }
    }
    
    // Validate select fields
    if (param.options && param.options.length > 0) {
      if (!param.options.includes(value)) {
        errors.push('Please select a valid option');
      }
    }
    
    // Validate text length
    if (param.dataType === 'text' && value.length > 255) {
      errors.push('Text is too long (maximum 255 characters)');
    }
    
    return errors;
  };

  // Validate all parameters
  const validateAllParameters = () => {
    const errors = {};
    let hasErrors = false;
    
    if (orderData?.reportTypeGroups) {
      Object.values(orderData.reportTypeGroups).forEach(group => {
        group.parameters?.forEach(param => {
          const value = resultValues[param._id];
          const paramErrors = validateParameter(param, value);
          
          if (paramErrors.length > 0) {
            errors[param._id] = paramErrors;
            hasErrors = true;
          }
        });
      });
    }
    
    setValidationErrors(errors);
    setShowValidationSummary(hasErrors);
    
    return !hasErrors;
  };

  // Render input field based on parameter type
  const renderInputField = param => {
    const currentValue = resultValues[param._id] || '';
    const hasError = validationErrors[param._id];
    const isRequired = true; // ALL parameters are required
    
    const baseClasses = `shadow-sm ${hasError ? 'is-invalid' : ''}`;

    // Check if parameter has options (select type)
    if (param.options && param.options.length > 0) {
      return (
        <div>
          <Form.Select
            size="lg"
            value={currentValue}
            onChange={e => handleValueChange(param._id, e.target.value)}
            className={baseClasses}
            required={isRequired}
          >
            <option value="">Select...</option>
            {param.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          {hasError && (
            <div className="invalid-feedback d-block">
              {validationErrors[param._id].map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Check if it's a boolean/interpretation type
    if (param.interpretationType === 'Boolean' || param.formatType === 'Boolean') {
      return (
        <div>
          <Form.Select
            size="lg"
            value={currentValue.toString()}
            onChange={e => handleValueChange(param._id, e.target.value === 'true')}
            className={baseClasses}
            required={isRequired}
          >
            <option value="">Select...</option>
            <option value="true">Positive</option>
            <option value="false">Negative</option>
          </Form.Select>
          {hasError && (
            <div className="invalid-feedback d-block">
              {validationErrors[param._id].map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default to text/numeric input
    return (
      <div>
        <Form.Control
          type={param.dataType === 'numeric' ? 'number' : 'text'}
          size="lg"
          value={currentValue}
          onChange={e => handleValueChange(param._id, e.target.value)}
          placeholder="Enter result value"
          className={`${baseClasses} text-center fw-bold`}
          required={isRequired}
          min={param.dataType === 'numeric' ? param.ref_min : undefined}
          max={param.dataType === 'numeric' ? param.ref_max : undefined}
          step={param.dataType === 'numeric' ? 'any' : undefined}
        />
        {hasError && (
          <div className="invalid-feedback d-block">
            {validationErrors[param._id].map((error, index) => (
              <div key={index} className={error.includes('CRITICAL') ? 'text-danger fw-bold' : ''}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle save results
  const handleSave = async () => {
    // Validate all parameters first
    if (!validateAllParameters()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setLoading(true);
    try {
      // Prepare data grouped by reportType
      const resultsByReportType = {};

      if (orderData?.reportTypeGroups) {
        Object.entries(orderData.reportTypeGroups).forEach(([reportType, group]) => {
          const reportResults = [];
          group.parameters?.forEach(param => {
            // Include ALL parameters since all are required
            reportResults.push({
              parameterId: param._id,
              parameterValue: resultValues[param._id] || '', // Include empty values for validation
            });
          });

          if (reportResults.length > 0) {
            resultsByReportType[reportType] = reportResults;
          }
        });
      }

      // Check if there are any results to save
      if (Object.keys(resultsByReportType).length === 0) {
        toast.warning('Please enter all required results before saving');
        return;
      }

      // Count total parameters vs entered parameters to ensure all are filled
      let totalParameters = 0;
      let enteredParameters = 0;
      
      if (orderData?.reportTypeGroups) {
        Object.values(orderData.reportTypeGroups).forEach(group => {
          group.parameters?.forEach(param => {
            totalParameters++;
            if (resultValues[param._id] && resultValues[param._id].toString().trim() !== '') {
              enteredParameters++;
            }
          });
        });
      }
      
      if (enteredParameters < totalParameters) {
        toast.warning(`Please fill all ${totalParameters} parameters. Currently ${enteredParameters} of ${totalParameters} are completed.`);
        return;
      }

      // Call the save function with formatted data
      await onSaveResults({
        labTestOrderId: orderData.labTestOrderId,
        resultsByReportType,
      });

      // Clear validation errors and reset state on successful save
      setValidationErrors({});
      setShowValidationSummary(false);
      
      toast.success('Results saved successfully');
      onHide();
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
    } finally {
      setLoading(false);
    }
  };

  // Initialize values when modal opens
  useEffect(() => {
    if (show && orderData) {
      initializeValues();
      setValidationErrors({});
      setShowValidationSummary(false);
    }
  }, [show, orderData]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Result Entry - {orderData?.serviceName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Patient Information */}
        {orderData?.patient && (
          <div className="mb-4 p-3 bg-light rounded">
            <Row>
              <Col md={6}>
                <strong>Patient:</strong> {orderData.patient.name}
              </Col>
              <Col md={3}>
                <strong>Age:</strong> {orderData.patient.age}
              </Col>
              <Col md={3}>
                <strong>Gender:</strong> {orderData.patient.gender}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <strong>Service:</strong> {orderData.serviceName}
              </Col>
              <Col md={6}>
                <strong>Department:</strong> {orderData.serviceHead}
              </Col>
            </Row>
          </div>
        )}

        {/* Validation Summary */}
        {showValidationSummary && Object.keys(validationErrors).length > 0 && (
          <div className="alert alert-danger mb-4">
            <h6 className="alert-heading">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Validation Errors ({Object.keys(validationErrors).length})
            </h6>
            <p className="mb-0">Please fix the following issues before saving:</p>
            <ul className="mb-0 mt-2">
              {Object.entries(validationErrors).map(([parameterId, errors]) => {
                // Find parameter name for better error display
                let parameterName = parameterId;
                if (orderData?.reportTypeGroups) {
                  Object.values(orderData.reportTypeGroups).forEach(group => {
                    const param = group.parameters?.find(p => p._id === parameterId);
                    if (param) parameterName = param.parameterName;
                  });
                }
                return (
                  <li key={parameterId}>
                    <strong>{parameterName}:</strong> {errors.join(', ')}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Results by Report Type */}
        {orderData?.reportTypeGroups &&
          Object.entries(orderData.reportTypeGroups).map(([reportType, group]) => (
            <Card key={reportType} className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-flask me-2"></i>
                  {reportType}
                  <Badge bg="light" text="dark" className="ms-2">
                    {group.parameterCount} parameters
                  </Badge>
                </h5>
              </Card.Header>

              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '20%' }}>Test Name</th>
                        <th style={{ width: '25%' }}>Result Input</th>
                        <th style={{ width: '8%' }}>Unit</th>
                        <th style={{ width: '12%' }}>Bio Reference</th>
                        <th style={{ width: '8%' }}>Ref Min</th>
                        <th style={{ width: '8%' }}>Ref Max</th>
                        <th style={{ width: '8%' }}>Critical Min</th>
                        <th style={{ width: '8%' }}>Critical Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.parameters?.map((param, index) => {
                        const isRequired = true; // ALL parameters are required
                        const hasError = validationErrors[param._id];
                        
                        return (
                        <tr key={param._id} className={hasError ? 'table-danger' : ''}>
                          <td>
                            <strong>
                              {param.parameterName}
                              {isRequired && <span className="text-danger ms-1">*</span>}
                            </strong>
                            <br />
                            <small className="text-muted">
                              {param.methodology && (
                                <span dangerouslySetInnerHTML={{ __html: param.methodology }} />
                              )}
                            </small>
                            {hasError && (
                              <div className="mt-1">
                                <Badge bg="danger" className="me-1">
                                  <i className="fas fa-exclamation-triangle me-1"></i>
                                  Error
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td style={{ minWidth: '200px', padding: '12px' }}>
                            {renderInputField(param)}
                          </td>
                          <td>
                            <span className="badge bg-secondary">{param.unit || '-'}</span>
                          </td>
                          <td>
                            <small className="text-success fw-bold">
                              {param.bioReference?.length > 0 ? param.bioReference.join(', ') : '-'}
                            </small>
                          </td>
                          <td>
                            <small className="text-info">{param.ref_min || '-'}</small>
                          </td>
                          <td>
                            <small className="text-info">{param.ref_max || '-'}</small>
                          </td>
                          <td>
                            <small className="text-danger fw-bold">
                              {param.criticalMin || param.critical_min || '-'}
                            </small>
                          </td>
                          <td>
                            <small className="text-danger fw-bold">
                              {param.criticalMax || param.critical_max || '-'}
                            </small>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          ))}

        {/* No data message */}
        {(!orderData?.reportTypeGroups || Object.keys(orderData.reportTypeGroups).length === 0) && (
          <div className="text-center text-muted py-5">
            <i className="fas fa-flask fa-3x mb-3"></i>
            <h5>No Parameters Found</h5>
            <p>No test parameters available for result entry</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="text-muted">
            <small>
              <i className="fas fa-info-circle me-2"></i>
              Total Report Types: {orderData?.totalReportTypes || 0} | Total Parameters:{' '}
              {orderData?.totalParameters || 0}
            </small>
          </div>
          <div className="d-flex gap-3">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={onHide}
              disabled={loading}
              className="px-4"
            >
              <i className="fas fa-times me-2"></i>Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={loading}
              className="px-4"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Save Results
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultEntryModal;
