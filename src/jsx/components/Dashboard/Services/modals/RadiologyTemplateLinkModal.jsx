import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const RadiologyTemplateLinkModal = ({ show, onHide, service, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // Fetch templates with service link status
  const fetchTemplatesWithLinkStatus = async () => {
    if (!service?._id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template/service-linking/${service._id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success || data.status) {
        setTemplates(data.data?.templates || []);
        // Find currently linked template
        const linkedTemplate = data.data?.templates?.find(t => t.isLinked);
        setSelectedTemplateId(linkedTemplate?._id || null);
      } else {
        toast.error(data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  // Handle template linking/unlinking
  const handleSaveTemplateLink = async () => {
    if (!service?._id) return;

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
      const payload = {
        templateId: selectedTemplateId, // null to unlink
        ...(userId && { userId }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template/service-linking/${service._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success || data.status) {
        const action = selectedTemplateId ? 'linked' : 'unlinked';
        toast.success(`Template ${action} successfully`);
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to update template link');
      }
    } catch (error) {
      console.error('Error updating template link:', error);
      toast.error('Failed to update template link');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when modal opens
  useEffect(() => {
    if (show && service?._id) {
      fetchTemplatesWithLinkStatus();
    }
  }, [show, service?._id]);

  // Handle template selection (radio button behavior)
  const handleTemplateSelect = (templateId) => {
    // If clicking the currently selected template, unselect it
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    } else {
      setSelectedTemplateId(templateId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-link me-2"></i>
          Link Radiology Template
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Service Info */}
        <div className="mb-4 p-3 bg-light rounded">
          <Row>
            <Col md={8}>
              <h6 className="mb-1">
                <i className="fas fa-hospital me-2"></i>
                Service: {service?.serviceName}
              </h6>
              {service?.code && (
                <p className="mb-1 text-muted">Code: {service.code}</p>
              )}
              <Badge bg="info">{service?.headType}</Badge>
            </Col>
            <Col md={4} className="text-end">
              <Badge bg={service?.isActive ? 'success' : 'danger'}>
                {service?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Col>
          </Row>
        </div>

        {/* Templates List */}
        <div>
          <h6 className="mb-3">
            <i className="fas fa-file-medical me-2"></i>
            Available Radiology Templates ({templates.length})
          </h6>

          {loading ? (
            <div className="text-center py-5">
              <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
              <p>Loading templates...</p>
            </div>
          ) : templates.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '5%' }}>Select</th>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '30%' }}>Template Name</th>
                    <th style={{ width: '35%' }}>Description</th>
                    <th style={{ width: '10%' }}>Status</th>
                    <th style={{ width: '15%' }}>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template, index) => (
                    <tr 
                      key={template._id}
                      className={selectedTemplateId === template._id ? 'table-primary' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTemplateSelect(template._id)}
                    >
                      <td>
                        <Form.Check
                          type="radio"
                          name="templateSelection"
                          checked={selectedTemplateId === template._id}
                          onChange={() => handleTemplateSelect(template._id)}
                          disabled={loading}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>
                        <div>
                          <strong>{template.templateName}</strong>
                          {template.isLinked && (
                            <Badge bg="success" className="ms-2">
                              Currently Linked
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {template.description || (
                            <span className="text-muted">No description</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={template.isActive ? 'success' : 'danger'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <small>
                          {template.createdBy?.name || 'Unknown'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="fas fa-file-medical fa-3x mb-3"></i>
              <h6>No Templates Available</h6>
              <p>No radiology templates found in the system</p>
            </div>
          )}
        </div>

        {/* Selection Info */}
        {selectedTemplateId ? (
          <div className="mt-4 p-3 bg-success bg-opacity-10 rounded border border-success">
            <div className="d-flex align-items-center">
              <i className="fas fa-check-circle text-success me-2"></i>
              <div>
                <strong>Template Selected:</strong>{' '}
                {templates.find(t => t._id === selectedTemplateId)?.templateName}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded border border-warning">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle text-warning me-2"></i>
              <div>
                <strong>No Template Selected:</strong> This service will not have a linked template
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="text-muted">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              Only one template can be linked to a service at a time
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTemplateLink}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RadiologyTemplateLinkModal;