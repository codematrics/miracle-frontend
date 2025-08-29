import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

import CKEditorComponent from '../../Common/CKEditorComponent';

const RadiologyTemplateForm = ({ show, onHide, template, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    templateName: '',
    templateContent: '',
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (show) {
      if (template) {
        // Edit mode
        setFormData({
          templateName: template.templateName || '',
          templateContent: template.templateContent || '',
          description: template.description || '',
          isActive: template.isActive !== undefined ? template.isActive : true,
        });
      } else {
        // Create mode
        setFormData({
          templateName: '',
          templateContent: '',
          description: '',
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [show, template]);

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Template name validation
    if (!formData.templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    } else if (formData.templateName.trim().length < 3) {
      newErrors.templateName = 'Template name must be at least 3 characters';
    } else if (formData.templateName.trim().length > 100) {
      newErrors.templateName = 'Template name must not exceed 100 characters';
    }

    // Template content validation
    if (!formData.templateContent.trim()) {
      newErrors.templateContent = 'Template content is required';
    }

    // Description validation (optional but has limits)
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
      const payload = {
        ...formData,
        ...(userId && { userId }),
      };

      const url = template
        ? `${import.meta.env.VITE_API_URL}/radiology-template/${template._id}`
        : `${import.meta.env.VITE_API_URL}/radiology-template`;

      const method = template ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || data.status) {
        toast.success(template ? 'Template updated successfully' : 'Template created successfully');
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-file-medical me-2"></i>
          {template ? 'Edit Template' : 'Create New Template'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>
                Template Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter template name (e.g., CT Chest Template)"
                value={formData.templateName}
                onChange={e => handleInputChange('templateName', e.target.value)}
                isInvalid={!!errors.templateName}
              />
              <Form.Control.Feedback type="invalid">{errors.templateName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.isActive.toString()}
                onChange={e => handleInputChange('isActive', e.target.value === 'true')}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter template description (optional)"
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              <Form.Text className="text-muted">
                Characters: {formData.description.length}/500
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>
                Template Content <span className="text-danger">*</span>
              </Form.Label>
              <Form.Text className="d-block mb-2 text-muted">
                Use the rich text editor to create your radiology template content
              </Form.Text>
              <CKEditorComponent
                value={formData.templateContent}
                onChange={value => handleInputChange('templateContent', value)}
                placeholder="Enter your radiology template content here..."
                height="400px"
              />
              {errors.templateContent && (
                <div className="text-danger mt-1">
                  <small>{errors.templateContent}</small>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Preview Section */}
        {formData.templateContent && (
          <Row>
            <Col md={12}>
              <div className="border rounded p-3 bg-light">
                <h6 className="mb-2">
                  <i className="fas fa-eye me-2"></i>
                  Template Preview
                </h6>
                <div
                  className="template-preview"
                  dangerouslySetInnerHTML={{ __html: formData.templateContent }}
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="text-muted">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              {template ? 'Updating existing template' : 'Creating new template'}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  {template ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className={`fas fa-${template ? 'save' : 'plus'} me-2`}></i>
                  {template ? 'Update Template' : 'Create Template'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RadiologyTemplateForm;
