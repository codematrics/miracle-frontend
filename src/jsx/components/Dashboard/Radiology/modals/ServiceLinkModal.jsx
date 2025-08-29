import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ServiceLinkModal = ({ show, onHide, template, services, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [allServices, setAllServices] = useState([]);

  // Fetch all radiology services
  const fetchAllServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services?headType=Radiology`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success || data.status) {
        // Ensure we always set an array
        const servicesData = data.data;
        if (Array.isArray(servicesData)) {
          setAllServices(servicesData);
        } else if (Array.isArray(servicesData?.services)) {
          setAllServices(servicesData.services);
        } else {
          setAllServices([]);
        }
      } else {
        setAllServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setAllServices([]);
    }
  };

  useEffect(() => {
    if (show) {
      fetchAllServices();
      setSelectedServiceId('');
    }
  }, [show]);

  // Handle service linking
  const handleLinkService = async () => {
    if (!selectedServiceId) {
      toast.error('Please select a service');
      return;
    }

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
      const payload = {
        serviceId: selectedServiceId,
        templateId: template._id,
        ...(userId && { userId }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template/link-service`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success || data.status) {
        toast.success('Template linked to service successfully');
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to link template to service');
      }
    } catch (error) {
      console.error('Error linking service:', error);
      toast.error('Failed to link template to service');
    } finally {
      setLoading(false);
    }
  };

  // Handle service unlinking
  const handleUnlinkService = async (serviceId) => {
    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
      const payload = {
        serviceId: serviceId,
        ...(userId && { userId }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/radiology-template/unlink-service`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success || data.status) {
        toast.success('Template unlinked from service successfully');
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to unlink template from service');
      }
    } catch (error) {
      console.error('Error unlinking service:', error);
      toast.error('Failed to unlink template from service');
    } finally {
      setLoading(false);
    }
  };

  // Get linked services for this template
  const linkedServices = Array.isArray(services) 
    ? services.filter(service => 
        service.linkedTemplate && service.linkedTemplate._id === template?._id
      )
    : [];

  // Get available services (not linked to this template)
  const availableServices = Array.isArray(allServices)
    ? allServices.filter(service => 
        !linkedServices.some(linked => linked._id === service._id)
      )
    : [];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-link me-2"></i>
          Link Template to Services
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Template Info */}
        <div className="mb-4 p-3 bg-light rounded">
          <h6 className="mb-2">
            <i className="fas fa-file-medical me-2"></i>
            Template: {template?.templateName}
          </h6>
          {template?.description && (
            <p className="mb-0 text-muted">{template.description}</p>
          )}
        </div>

        {/* Link New Service */}
        <div className="mb-4">
          <h6 className="mb-3">
            <i className="fas fa-plus me-2"></i>
            Link to New Service
          </h6>
          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Select Radiology Service</Form.Label>
                <Form.Select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select a service...</option>
                  {availableServices.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.serviceName} {service.code && `(${service.code})`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                variant="primary"
                onClick={handleLinkService}
                disabled={loading || !selectedServiceId}
                className="w-100"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-1"></i>
                    Linking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-link me-1"></i>
                    Link Service
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </div>

        {/* Currently Linked Services */}
        <div>
          <h6 className="mb-3">
            <i className="fas fa-list me-2"></i>
            Currently Linked Services ({linkedServices.length})
          </h6>

          {linkedServices.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '40%' }}>Service Name</th>
                    <th style={{ width: '20%' }}>Code</th>
                    <th style={{ width: '20%' }}>Head Type</th>
                    <th style={{ width: '15%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedServices.map((service, index) => (
                    <tr key={service._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{service.serviceName}</strong>
                      </td>
                      <td>
                        <Badge bg="secondary">{service.code || 'N/A'}</Badge>
                      </td>
                      <td>
                        <Badge bg="info">{service.headType}</Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleUnlinkService(service._id)}
                          disabled={loading}
                          title="Unlink Service"
                        >
                          {loading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-unlink"></i>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="fas fa-unlink fa-3x mb-3"></i>
              <h6>No Services Linked</h6>
              <p>This template is not currently linked to any radiology services</p>
            </div>
          )}
        </div>

        {availableServices.length === 0 && linkedServices.length > 0 && (
          <div className="alert alert-info mt-3">
            <i className="fas fa-info-circle me-2"></i>
            All available radiology services have been linked to this template.
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="text-muted">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              Manage service-template associations
            </small>
          </div>
          <div>
            <Button
              variant="outline-secondary"
              onClick={onHide}
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceLinkModal;