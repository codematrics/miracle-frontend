import { useState } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';

import { RADIOLOGY_ENUMS, VALIDATION_PATTERNS } from '../../../../../../constants/enums';

const FieldBuilder = ({ fields = [], onFieldsUpdate, errors = {} }) => {
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fieldForm, setFieldForm] = useState({
    fieldName: '',
    fieldType: 'text',
    fieldLabel: '',
    isRequired: false,
    placeholder: '',
    defaultValue: '',
    options: [],
    validation: {},
    order: 0,
  });

  const fieldTypes = RADIOLOGY_ENUMS.TEMPLATE_FIELD_TYPES;
  
  // Predefined options for common fields
  const predefinedOptions = {
    patient_position: Object.entries(RADIOLOGY_ENUMS.PATIENT_POSITIONS).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    })),
    contrast_type: Object.entries(RADIOLOGY_ENUMS.CONTRAST_TYPES).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    })),
    image_quality: Object.entries(RADIOLOGY_ENUMS.IMAGE_QUALITY).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' '),
    })),
    anatomical_region: Object.entries(RADIOLOGY_ENUMS.ANATOMICAL_REGIONS).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    })),
    scan_technique: Object.entries(RADIOLOGY_ENUMS.SCAN_TECHNIQUES).map(([key, value]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' '),
    })),
  };

  // Initialize field form
  const initFieldForm = (field = null, index = null) => {
    if (field) {
      setFieldForm({ ...field });
      setEditingIndex(index);
    } else {
      setFieldForm({
        fieldName: '',
        fieldType: 'text',
        fieldLabel: '',
        isRequired: false,
        placeholder: '',
        defaultValue: '',
        options: [],
        validation: {},
        order: fields.length,
      });
      setEditingIndex(null);
    }
    setShowFieldForm(true);
  };

  // Handle field form input changes
  const handleFieldFormChange = (name, value) => {
    setFieldForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-populate options for common field names
      if (name === 'fieldName' && predefinedOptions[value]) {
        updated.options = predefinedOptions[value];
        if (['select', 'radio', 'checkbox'].includes(updated.fieldType)) {
          // Auto-set field type based on common patterns
          if (value.includes('position') || value.includes('quality')) {
            updated.fieldType = 'select';
          }
        }
      }
      
      // Clear options when field type doesn't need them
      if (name === 'fieldType' && !['select', 'radio', 'checkbox'].includes(value)) {
        updated.options = [];
      }
      
      return updated;
    });
  };

  // Handle validation changes
  const handleValidationChange = (key, value) => {
    setFieldForm(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [key]: value === '' ? undefined : value,
      },
    }));
  };

  // Handle options changes
  const handleOptionChange = (index, key, value) => {
    setFieldForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [key]: value } : option
      ),
    }));
  };

  // Add new option
  const addOption = () => {
    setFieldForm(prev => ({
      ...prev,
      options: [...prev.options, { value: '', label: '' }],
    }));
  };

  // Remove option
  const removeOption = (index) => {
    setFieldForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Save field
  const saveField = () => {
    // Validate field
    const fieldErrors = validateField(fieldForm);
    if (Object.keys(fieldErrors).length > 0) {
      // Handle field validation errors
      return;
    }

    let updatedFields;
    if (editingIndex !== null) {
      // Update existing field
      updatedFields = fields.map((field, index) => 
        index === editingIndex ? fieldForm : field
      );
    } else {
      // Add new field
      updatedFields = [...fields, fieldForm];
    }

    // Update order for all fields
    updatedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index + 1,
    }));

    onFieldsUpdate(updatedFields);
    setShowFieldForm(false);
    setEditingIndex(null);
  };

  // Validate individual field
  const validateField = (field) => {
    const fieldErrors = {};

    if (!field.fieldName.trim()) {
      fieldErrors.fieldName = 'Field name is required';
    } else if (!VALIDATION_PATTERNS.SNAKE_CASE.test(field.fieldName)) {
      fieldErrors.fieldName = 'Field name must be in snake_case format';
    }

    if (!field.fieldLabel.trim()) {
      fieldErrors.fieldLabel = 'Field label is required';
    }

    if (['select', 'radio', 'checkbox'].includes(field.fieldType)) {
      if (!field.options || field.options.length === 0) {
        fieldErrors.options = 'Options are required for this field type';
      } else if (field.options.some(opt => !opt.value || !opt.label)) {
        fieldErrors.options = 'All options must have both value and label';
      }
    }

    return fieldErrors;
  };

  // Delete field
  const deleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index)
      .map((field, i) => ({ ...field, order: i + 1 }));
    onFieldsUpdate(updatedFields);
  };

  // Move field up/down
  const moveField = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    
    // Update order
    updatedFields.forEach((field, i) => {
      field.order = i + 1;
    });

    onFieldsUpdate(updatedFields);
  };

  return (
    <div>
      {/* Fields List */}
      {fields.length > 0 && (
        <div className="mb-4">
          {fields.map((field, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={1}>
                    <Badge bg="secondary">{field.order || index + 1}</Badge>
                  </Col>
                  <Col md={3}>
                    <strong>{field.fieldLabel}</strong>
                    <div>
                      <small className="text-muted">{field.fieldName}</small>
                    </div>
                  </Col>
                  <Col md={2}>
                    <Badge bg="info">{field.fieldType}</Badge>
                  </Col>
                  <Col md={2}>
                    {field.isRequired ? (
                      <Badge bg="warning">Required</Badge>
                    ) : (
                      <Badge bg="light" text="dark">Optional</Badge>
                    )}
                  </Col>
                  <Col md={2}>
                    {['select', 'radio', 'checkbox'].includes(field.fieldType) && (
                      <small className="text-muted">
                        {field.options?.length || 0} options
                      </small>
                    )}
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => initFieldForm(field, index)}
                        title="Edit Field"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === fields.length - 1}
                        title="Move Down"
                      >
                        <i className="fas fa-arrow-down"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteField(index)}
                        title="Delete Field"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Add Field Button */}
      {!showFieldForm && (
        <div className="text-center mb-4">
          <Button
            variant="outline-primary"
            onClick={() => initFieldForm()}
          >
            <i className="fas fa-plus me-2"></i>
            Add Template Field
          </Button>
        </div>
      )}

      {/* Field Form */}
      {showFieldForm && (
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              {editingIndex !== null ? 'Edit Field' : 'Add New Field'}
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Field Name (snake_case) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., patient_position, contrast_type"
                    value={fieldForm.fieldName}
                    onChange={(e) => handleFieldFormChange('fieldName', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  />
                  <Form.Text className="text-muted">
                    Must be in snake_case format (lowercase with underscores)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Field Label *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Patient Position, Contrast Type"
                    value={fieldForm.fieldLabel}
                    onChange={(e) => handleFieldFormChange('fieldLabel', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Field Type *</Form.Label>
                  <Form.Select
                    value={fieldForm.fieldType}
                    onChange={(e) => handleFieldFormChange('fieldType', e.target.value)}
                  >
                    {Object.entries(fieldTypes).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Placeholder</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter placeholder text"
                    value={fieldForm.placeholder}
                    onChange={(e) => handleFieldFormChange('placeholder', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Default Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter default value"
                    value={fieldForm.defaultValue}
                    onChange={(e) => handleFieldFormChange('defaultValue', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Required Field"
                  checked={fieldForm.isRequired}
                  onChange={(e) => handleFieldFormChange('isRequired', e.target.checked)}
                  className="mb-3"
                />
              </Col>
            </Row>

            {/* Validation Rules */}
            {['text', 'textarea', 'number'].includes(fieldForm.fieldType) && (
              <Card className="mb-3">
                <Card.Header>
                  <small>Validation Rules (Optional)</small>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {fieldForm.fieldType === 'number' ? (
                      <>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Minimum Value</Form.Label>
                            <Form.Control
                              type="number"
                              step="any"
                              value={fieldForm.validation.min || ''}
                              onChange={(e) => handleValidationChange('min', parseFloat(e.target.value) || '')}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Maximum Value</Form.Label>
                            <Form.Control
                              type="number"
                              step="any"
                              value={fieldForm.validation.max || ''}
                              onChange={(e) => handleValidationChange('max', parseFloat(e.target.value) || '')}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Minimum Length</Form.Label>
                            <Form.Control
                              type="number"
                              value={fieldForm.validation.min || ''}
                              onChange={(e) => handleValidationChange('min', parseInt(e.target.value) || '')}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Maximum Length</Form.Label>
                            <Form.Control
                              type="number"
                              value={fieldForm.validation.max || ''}
                              onChange={(e) => handleValidationChange('max', parseInt(e.target.value) || '')}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pattern (Regex)</Form.Label>
                            <Form.Select
                              value={fieldForm.validation.pattern || ''}
                              onChange={(e) => handleValidationChange('pattern', e.target.value)}
                            >
                              <option value="">No Pattern</option>
                              <option value={VALIDATION_PATTERNS.ALPHANUMERIC}>Alphanumeric</option>
                              <option value={VALIDATION_PATTERNS.ALPHA_ONLY}>Letters Only</option>
                              <option value={VALIDATION_PATTERNS.NUMERIC_ONLY}>Numbers Only</option>
                              <option value={VALIDATION_PATTERNS.DECIMAL}>Decimal Numbers</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Options for select/radio/checkbox */}
            {['select', 'radio', 'checkbox'].includes(fieldForm.fieldType) && (
              <Card className="mb-3">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <small>Options *</small>
                    <Button variant="outline-primary" size="sm" onClick={addOption}>
                      <i className="fas fa-plus me-1"></i>Add Option
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {fieldForm.options.map((option, index) => (
                    <Row key={index} className="align-items-center mb-2">
                      <Col md={5}>
                        <Form.Control
                          type="text"
                          placeholder="Option value"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                        />
                      </Col>
                      <Col md={5}>
                        <Form.Control
                          type="text"
                          placeholder="Option label"
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowFieldForm(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={saveField}>
                {editingIndex !== null ? 'Update Field' : 'Add Field'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {fields.length === 0 && !showFieldForm && (
        <div className="text-center text-muted py-5">
          <i className="fas fa-list fa-3x mb-3"></i>
          <h6>No Template Fields</h6>
          <p>Add template fields to define the structure of your radiology template</p>
        </div>
      )}
    </div>
  );
};

export default FieldBuilder;