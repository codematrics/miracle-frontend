import { useState } from 'react';
import { Badge, Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ReportTypesModal = ({ show, onHide, orderData }) => {
  const [loading, setLoading] = useState(false);
  const [printingReportType, setPrintingReportType] = useState(null);
  const [printingCombined, setPrintingCombined] = useState(false);
  const [viewingReportType, setViewingReportType] = useState(null);
  const [viewingCombined, setViewingCombined] = useState(false);

  // Handle individual report type view
  const handleViewReportType = async reportType => {
    setViewingReportType(reportType);
    try {
      // Create URL with authorization token for viewing
      const url = `${import.meta.env.VITE_API_URL}/lab-test-orders/print?labTestOrderId=${orderData.labTestOrderId}&reportType=${encodeURIComponent(reportType)}&printType=separate`;
      
      // Open in new tab for viewing
      const newWindow = window.open('about:blank', '_blank');
      
      // Fetch the PDF and create blob URL
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const viewUrl = window.URL.createObjectURL(blob);
        newWindow.location.href = viewUrl;
        toast.success(`${reportType} report opened for viewing`);
      } else {
        newWindow.close();
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error viewing report:', error);
      toast.error(error.message || 'Failed to view report');
    } finally {
      setViewingReportType(null);
    }
  };

  // Handle individual report type print
  const handlePrintReportType = async reportType => {
    setPrintingReportType(reportType);
    try {
      // Call API to print individual report type using GET request
      const url = `${import.meta.env.VITE_API_URL}/lab-test-orders/print?labTestOrderId=${orderData.labTestOrderId}&reportType=${encodeURIComponent(reportType)}&printType=separate`;

      // Add authorization header by creating a fetch request first to check if it works
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
        },
      });

      if (response.ok) {
        // Create blob from response and download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${reportType}-report-${orderData.labTestOrderId}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast.success(`${reportType} report downloaded successfully`);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error printing report:', error);
      toast.error(error.message || 'Failed to print report');
    } finally {
      setPrintingReportType(null);
    }
  };

  // Handle combined view
  const handleViewCombined = async () => {
    setViewingCombined(true);
    try {
      // Create URL for viewing combined report
      const url = `${import.meta.env.VITE_API_URL}/lab-test-orders/print?labTestOrderId=${orderData.labTestOrderId}&printType=combined&reportType=all`;
      
      // Open in new tab for viewing
      const newWindow = window.open('about:blank', '_blank');
      
      // Fetch the PDF and create blob URL
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const viewUrl = window.URL.createObjectURL(blob);
        newWindow.location.href = viewUrl;
        toast.success('Combined report opened for viewing');
      } else {
        newWindow.close();
        throw new Error('Failed to generate combined report');
      }
    } catch (error) {
      console.error('Error viewing combined report:', error);
      toast.error(error.message || 'Failed to view combined report');
    } finally {
      setViewingCombined(false);
    }
  };

  // Handle combined print
  const handlePrintCombined = async () => {
    setPrintingCombined(true);
    try {
      // Call API to print all report types combined using GET request
      const url = `${import.meta.env.VITE_API_URL}/lab-test-orders/print?labTestOrderId=${orderData.labTestOrderId}&printType=combined&reportType=all`;

      // Create a fetch request to download the combined report
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
        },
      });

      if (response.ok) {
        // Create blob from response and download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `combined-report-${orderData.labTestOrderId}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast.success('Combined report downloaded successfully');
      } else {
        throw new Error('Failed to generate combined report');
      }
    } catch (error) {
      console.error('Error printing combined report:', error);
      toast.error(error.message || 'Failed to print combined report');
    } finally {
      setPrintingCombined(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Report Types - {orderData?.serviceName}
          <Badge bg="success" className="ms-2">
            Authorized
          </Badge>
        </Modal.Title>
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
                <strong>Accession No:</strong> {orderData.accessionNumber}
              </Col>
            </Row>
          </div>
        )}

        {/* Report Types */}
        {orderData?.reportTypes && orderData.reportTypes.length > 0 ? (
          <div className="mb-4">
            <h5 className="mb-3">
              <i className="fas fa-file-alt me-2"></i>
              Available Report Types
              <Badge bg="primary" className="ms-2">
                {orderData.reportTypes.length}
              </Badge>
            </h5>

            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '35%' }}>Report Type</th>
                    <th style={{ width: '15%' }}>Status</th>
                    <th style={{ width: '25%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.reportTypes.map((reportType, index) => {
                    // Find corresponding summary data
                    const summary = orderData.reportTypeSummary?.find(
                      s => s.reportType === reportType.reportType
                    );

                    return (
                      <tr key={reportType || index}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{reportType}</strong>
                        </td>

                        <td>
                          <Badge bg={reportType.status === 'authorized' ? 'success' : 'warning'}>
                            {reportType.status || 'authorized'}
                          </Badge>
                        </td>

                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewReportType(reportType)}
                              disabled={loading || viewingReportType === reportType || printingReportType === reportType}
                              title="View Report"
                            >
                              {viewingReportType === reportType ? (
                                <>
                                  <i className="fas fa-spinner fa-spin me-1"></i>
                                  View
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-eye me-1"></i>
                                  View
                                </>
                              )}
                            </Button>
                            
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handlePrintReportType(reportType)}
                              disabled={loading || printingReportType === reportType || viewingReportType === reportType}
                              title="Download Report"
                            >
                              {printingReportType === reportType ? (
                                <>
                                  <i className="fas fa-spinner fa-spin me-1"></i>
                                  Print
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-download me-1"></i>
                                  Print
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted py-5">
            <i className="fas fa-file-alt fa-3x mb-3"></i>
            <h5>No Report Types Found</h5>
            <p>No report types available for this order</p>
          </div>
        )}

        {/* Combined Print Section */}
        {orderData?.reportTypes && orderData.reportTypes.length > 1 && (
          <Card className="border-primary">
            <Card.Header className="bg-light text-white">
              <h6 className="mb-0">
                <i className="fas fa-layer-group me-2"></i>
                Combined Report Options
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={7}>
                  <h6>Combined Report Options</h6>
                  <p className="mb-0 text-muted">
                    View or download a single PDF containing all {orderData.reportTypes.length} report types
                  </p>
                </Col>
                <Col md={5} className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="outline-info"
                      size="lg"
                      onClick={handleViewCombined}
                      disabled={loading || viewingCombined || printingCombined}
                      className="px-3"
                      title="View Combined Report"
                    >
                      {viewingCombined ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Viewing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-eye me-2"></i>
                          View Combined
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handlePrintCombined}
                      disabled={loading || printingCombined || viewingCombined}
                      className="px-3"
                      title="Download Combined Report"
                    >
                      {printingCombined ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download me-2"></i>
                          Download Combined
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="text-muted">
            <small>
              <i className="fas fa-info-circle me-2"></i>
              Status: Authorized | Total Report Types: {orderData?.reportTypes?.length || 0}
            </small>
          </div>
          <div className="d-flex gap-3">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={onHide}
              disabled={loading || printingReportType || printingCombined}
              className="px-4"
            >
              <i className="fas fa-times me-2"></i>Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportTypesModal;
