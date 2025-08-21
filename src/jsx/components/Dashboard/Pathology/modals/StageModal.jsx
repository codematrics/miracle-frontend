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
          <th>Container Type</th>
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
                if (test.status === TEST_STATUS.COLLECTED) {
                  setSelectedTests([test.testId]);
                  setTestParameters(test.parameters?.map(param => ({
                    ...param,
                    value: param?.value || param?.currentResult?.value || '',
                  })) || []);
                }
              }}
              style={{ cursor: test.status === TEST_STATUS.COLLECTED ? 'pointer' : 'default' }}
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
          <Form onSubmit={onSaveResults}>
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
              <Button
                variant="outline-secondary"
                onClick={() => setTestParameters([])}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Results
              </Button>
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
                  setTestParameters(test.parameters?.map(param => ({
                    ...param,
                    value: param?.value || param?.currentResult?.value || '',
                  })) || []);
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
              <Button
                variant="outline-secondary"
                onClick={() => setTestParameters([])}
              >
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {getStageTitle()} - {selectedOrder?.accessionNo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedOrder && (
          <div className="mb-3">
            <strong>Patient:</strong> {orderTests.patientName} |
            <strong> UHID:</strong> {orderTests.uhid} |
            <strong> Visit:</strong> {orderTests.visitNo || 'N/A'} |
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
          <Button
            variant="primary"
            onClick={onCollectTests}
            disabled={selectedTests.length === 0}
          >
            Collect Selected
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default StageModal;