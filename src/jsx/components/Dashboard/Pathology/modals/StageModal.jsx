import { Badge, Button, Form, Modal, Table } from 'react-bootstrap';

import { ORDER_STATUS } from '../../../../../constants/enums';
import PathologyService, { TEST_STATUS } from '../../../../../services/PathologyService';

const StageModal = ({
  show,
  onHide,
  stage,
  selectedOrder,
  orderTests,
  selectedTests,
  setSelectedTests,
  testParameters,
  setTestParameters,
  onCollectTests,
  onSaveResults,
  onAuthorize,
  getStageTitle,
}) => {
  const getStatusBadge = status => {
    const config = PathologyService.utils.getStatusConfig(status);
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const renderCollectionStage = () => (
    <Table striped bordered responsive>
      <thead>
        <tr>
          <th width="50">Select</th>
          <th>Report Name</th>
          <th>Test Name</th>
          <th>Sample Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orderTests.tests?.map(test => (
          <tr key={test.id}>
            <td>
              <Form.Check
                type="checkbox"
                checked={
                  selectedTests.includes(test.testId) ||
                  test.status === ORDER_STATUS.COLLECTED ||
                  test.status === TEST_STATUS.AUTHORIZED
                }
                disabled={!(test.status === ORDER_STATUS.PENDING)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedTests([...selectedTests, test.testId]);
                  } else {
                    setSelectedTests(selectedTests.filter(id => id !== test.testId));
                  }
                }}
              />
            </td>
            <td>{test.reportName}</td>
            <td>{test.serviceName}</td>
            <td>{test.sampleType}</td>
            <td>{test.containerType}</td>
            <td>{getStatusBadge(test.status)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderResultStage = () => (
    <div>
      <h6>Select Test for Result Entry:</h6>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Report Type</th>
            <th>Sample Type</th>
            <th>Container Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderTests.parameters?.map(test => (
            <tr
              key={test._id}
              style={{ cursor: test.status === TEST_STATUS.COLLECTED ? 'pointer' : 'default' }}
            >
              <td>{test.parameterName}</td>
              <td>{test.reportType}</td>
              <td>{test.sampleType}</td>
              <td>{test.formatType}</td>
              <td>{getStatusBadge(test.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {testParameters.length > 0 && (
        <div className="mt-4">
          <h5 className="mb-3 text-primary">Enter Test Results</h5>
          <Form onSubmit={onSaveResults}>
            <div className="table-responsive">
              <Table bordered hover className="mb-4">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '25%' }}>Parameter</th>
                    <th style={{ width: '12%' }}>Code</th>
                    <th style={{ width: '10%' }}>Unit</th>
                    <th style={{ width: '18%' }}>Reference Range</th>
                    <th style={{ width: '35%' }}>Result Value</th>
                  </tr>
                </thead>
                <tbody>
                  {testParameters.map((param, index) => (
                    <tr key={param.parameterId}>
                      <td>
                        <strong>{param.parameterName}</strong>
                        <br />
                        <small className="text-muted">{param.methodology}</small>
                      </td>
                      <td>
                        <code className="text-info">{param.parameterCode}</code>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{param.unit || '-'}</span>
                      </td>
                      <td>
                        <small className="text-success fw-bold">
                          {param.referenceRange || '-'}
                        </small>
                      </td>
                      <td style={{ minWidth: '250px', padding: '12px' }}>
                        {param.dataType === 'select' ? (
                          <Form.Select
                            size="sm"
                            value={testParameters[index]?.value || ''}
                            onChange={e =>
                              setTestParameters(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  value: e.target.value,
                                };
                                return updated;
                              })
                            }
                            className="shadow-sm"
                          >
                            <option value="">Select...</option>
                            {param.options?.map((option, optIndex) => (
                              <option key={optIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </Form.Select>
                        ) : param.dataType === 'boolean' ? (
                          <Form.Select
                            size="sm"
                            value={testParameters[index]?.value?.toString() || ''}
                            onChange={e =>
                              setTestParameters(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  value: e.target.value === 'true',
                                };
                                return updated;
                              })
                            }
                            className="shadow-sm"
                          >
                            <option value="">Select...</option>
                            <option value="true">Positive</option>
                            <option value="false">Negative</option>
                          </Form.Select>
                        ) : param.dataType === 'numeric' ? (
                          <Form.Control
                            type="number"
                            size="sm"
                            step={
                              param.decimalPlaces
                                ? `0.${'0'.repeat(param.decimalPlaces - 1)}1`
                                : '0.01'
                            }
                            min={param.minValue || undefined}
                            max={param.maxValue || undefined}
                            value={testParameters[index]?.value || ''}
                            onChange={e =>
                              setTestParameters(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  value: parseFloat(e.target.value) || '',
                                };
                                return updated;
                              })
                            }
                            placeholder="Enter numeric value"
                            className="shadow-sm text-center fw-bold"
                          />
                        ) : (
                          <Form.Control
                            type="text"
                            size="lg"
                            value={testParameters[index]?.value || ''}
                            onChange={e =>
                              setTestParameters(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  value: e.target.value,
                                };
                                return updated;
                              })
                            }
                            placeholder="Enter text value"
                            className="shadow-sm"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div
              style={{ flexDirection: 'column', gap: '10px' }}
              className="d-flex justify-content-end align-items-start mt-4 p-3 bg-light rounded"
            >
              <div className="text-muted">
                <small>
                  <i className="fas fa-info-circle me-2"></i>
                  Ensure all values are entered accurately before saving
                </small>
              </div>
              <div className="d-flex gap-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => setTestParameters([])}
                  className="px-4"
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </Button>
                <Button type="submit" variant="primary" className="px-4">
                  <i className="fas fa-save me-2"></i>Save Results
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );

  const renderAuthorizationStage = () => (
    <div>
      <h6>Select Test for Authorization:</h6>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Test Name</th>
            <th>Sample Type</th>
            <th>Container Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderTests.tests?.map(test => (
            <tr
              key={test.testId}
              onClick={() => {
                if (test.status === TEST_STATUS.SAVED) {
                  setSelectedTests([test.testId]);
                  setTestParameters(
                    test.parameters?.map(param => ({
                      ...param,
                      value: param?.value || param?.currentResult?.value || '',
                    })) || []
                  );
                }
              }}
              style={{ cursor: test.status === TEST_STATUS.SAVED ? 'pointer' : 'default' }}
            >
              <td>{test.reportName}</td>
              <td>{test.serviceName}</td>
              <td>{test.sampleType}</td>
              <td>{test.containerType}</td>
              <td>{getStatusBadge(test.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {testParameters.length > 0 && (
        <div className="mt-3">
          <h6>Parameters:</h6>
          <Form onSubmit={onAuthorize}>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Code</th>
                  <th>Unit</th>
                  <th>Reference Range</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {testParameters.map((param, index) => (
                  <tr key={param.parameterId}>
                    <td>{param.parameterName}</td>
                    <td>{param.parameterCode}</td>
                    <td>{param.unit}</td>
                    <td>{param.referenceRange}</td>
                    <td>
                      <Form.Control
                        type={param.dataType === 'numeric' ? 'number' : 'text'}
                        value={testParameters[index]?.value || ''}
                        onChange={e =>
                          setTestParameters(prev => {
                            const updated = [...prev];
                            updated[index] = {
                              ...updated[index],
                              value: e.target.value,
                            };
                            return updated;
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setTestParameters([])}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Authorize
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );

  const renderStageContent = () => {
    switch (stage) {
      case 'collection':
        return renderCollectionStage();
      case 'result':
        return renderResultStage();
      case 'authorization':
        return renderAuthorizationStage();
      default:
        return null;
    }
  };
  console.log(show, 'show');

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {getStageTitle()} - {selectedOrder?.accessionNo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedOrder && (
          <div className="mb-3">
            <strong>Patient:</strong> {orderTests.patientName} |<strong> UHID:</strong>{' '}
            {orderTests.uhid} |<strong> Visit:</strong> {orderTests.visitNo || 'N/A'} |
            <strong> Order Date:</strong> {new Date(orderTests.orderDate).toLocaleDateString()}
          </div>
        )}
        {renderStageContent()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {stage === 'collection' && (
          <Button variant="primary" onClick={onCollectTests} disabled={selectedTests.length === 0}>
            Collect Selected
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default StageModal;
