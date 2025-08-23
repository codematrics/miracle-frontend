import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Nav, Row, Tab, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

import PathologyService from '../../../../services/PathologyService';
import DateFilterModal from './modals/DateFilterModal';

const PathologyWorkflow = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const [labOrders, setLabOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  // Collection Modal State
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTests, setOrderTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  // Result Entry Modal State
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testParameters, setTestParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});

  // Authorization Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Fetch lab orders based on workflow stage
  const fetchLabOrders = async (status = null, filters = {}) => {
    setLoading(true);
    try {
      const response = await PathologyService.labOrders.getAll(status, filters);
      if (response.success) {
        setLabOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      toast.error('Failed to fetch lab orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch lab order tests for collection modal
  const fetchOrderTests = async orderId => {
    try {
      const response = await PathologyService.labOrderTests.getByOrderId(orderId);
      if (response.success) {
        setOrderTests(response.data || []);
        setSelectedTests([]); // Reset selected tests
      }
    } catch (error) {
      console.error('Error fetching order tests:', error);
      toast.error('Failed to fetch order tests');
    }
  };

  // Fetch order details with test parameters for result entry
  const fetchOrderDetails = async (orderId, testId) => {
    try {
      const response = await PathologyService.labOrders.getDetails(orderId);
      if (response.success) {
        const orderData = response.data;
        // Find the specific test
        const targetTest = orderData.tests?.find(test => test.testId === testId);
        
        if (targetTest) {
          console.log('Target test found:', targetTest);
          console.log('Parameters:', targetTest.parameters);
          setTestParameters(targetTest.parameters || []);
          // Initialize parameter values from currentResult
          const initialValues = {};
          targetTest.parameters?.forEach(param => {
            initialValues[param.parameterId] = param.currentResult?.value || '';
            console.log(`Parameter ${param.parameterName} (${param.dataType}):`, param);
          });
          setParameterValues(initialValues);
        } else {
          toast.error('Test not found in order details');
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  // Fetch test results for authorization
  const fetchTestResults = async orderId => {
    try {
      const response = await PathologyService.labOrders.getDetails(orderId);
      if (response.success) {
        const orderData = response.data;
        // Flatten all parameters from all tests into a single array for authorization
        const allParameters = [];
        orderData.tests?.forEach(test => {
          test.parameters?.forEach(param => {
            if (param.currentResult && param.currentResult.status !== 'pending') {
              allParameters.push({
                ...param,
                testName: test.reportName || test.serviceName,
                value: param.currentResult.value,
                status: param.currentResult.status,
                isCritical: param.currentResult.isCritical,
                isAbnormal: param.currentResult.isAbnormal,
                interpretation: param.currentResult.isCritical ? 'critical' : 
                              param.currentResult.isAbnormal ? 'abnormal' : 'normal'
              });
            }
          });
        });
        setTestResults(allParameters);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to fetch test results');
    }
  };

  // Handle test collection
  const handleCollectTests = async () => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test to collect');
      return;
    }

    try {
      const response = await PathologyService.labOrders.collectTests(
        selectedOrder.id,
        selectedTests
      );
      if (response.success) {
        toast.success('Tests collected successfully');
        setShowCollectionModal(false);
        fetchLabOrders(
          activeTab === 'collection' ? PathologyService.constants.WORKFLOW_STATUS.PENDING : null
        );
      }
    } catch (error) {
      console.error('Error collecting tests:', error);
      toast.error('Failed to collect tests');
    }
  };

  // Handle result entry save
  const handleSaveResults = async () => {
    try {
      const resultsData = {
        results: Object.entries(parameterValues).map(([paramId, value]) => ({
          parameter_id: paramId,
          value: value,
          test_id: selectedTest.id,
          order_id: selectedOrder.id,
        })),
      };

      const response = await PathologyService.labResults.save(resultsData);
      if (response.success) {
        toast.success('Results saved successfully');
        setShowResultModal(false);
        fetchLabOrders(
          activeTab === 'result' ? PathologyService.constants.WORKFLOW_STATUS.COLLECTED : null
        );
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
    }
  };

  // Handle authorization
  const handleAuthorize = async (authData) => {
    try {
      const response = await PathologyService.labOrders.authorize(
        selectedOrder.id,
        authData.comment
      );
      if (response.success) {
        toast.success(`Authorized ${authData.selectedResults.length} results successfully`);
        setShowAuthModal(false);
        fetchLabOrders(
          activeTab === 'authorization'
            ? PathologyService.constants.WORKFLOW_STATUS.COMPLETED
            : null
        );
      }
    } catch (error) {
      console.error('Error authorizing order:', error);
      toast.error('Failed to authorize order');
    }
  };

  // Get status badge using PathologyService utility
  const getStatusBadge = status => {
    const config = PathologyService.utils.getStatusConfig(status);
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // Handle tab change
  const handleTabChange = tab => {
    setActiveTab(tab);
    let status = null;
    if (tab === 'collection') status = PathologyService.constants.WORKFLOW_STATUS.PENDING;
    else if (tab === 'result') status = PathologyService.constants.WORKFLOW_STATUS.COLLECTED;
    else if (tab === 'authorization') status = PathologyService.constants.WORKFLOW_STATUS.COMPLETED;

    fetchLabOrders(status, currentFilters);
  };

  // Handle filter submission
  const handleFilterSubmit = async (filters) => {
    setCurrentFilters(filters);
    let status = null;
    if (activeTab === 'collection') status = PathologyService.constants.WORKFLOW_STATUS.PENDING;
    else if (activeTab === 'result') status = PathologyService.constants.WORKFLOW_STATUS.COLLECTED;
    else if (activeTab === 'authorization') status = PathologyService.constants.WORKFLOW_STATUS.COMPLETED;
    
    await fetchLabOrders(status, filters);
  };

  // Open collection modal
  const openCollectionModal = order => {
    setSelectedOrder(order);
    fetchOrderTests(order.id);
    setShowCollectionModal(true);
  };

  // Open result modal
  const openResultModal = (order, test) => {
    setSelectedOrder(order);
    setSelectedTest(test);
    fetchOrderDetails(order.id, test.testId || test.id);
    setShowResultModal(true);
  };

  // Open authorization modal
  const openAuthModal = order => {
    setSelectedOrder(order);
    fetchTestResults(order.id);
    setShowAuthModal(true);
  };

  // Initialize
  useEffect(() => {
    fetchLabOrders(PathologyService.constants.WORKFLOW_STATUS.PENDING);
  }, []);

  return (
    <div className="container-fluid">
      <div className="form-head align-items-center d-flex mb-4">
        <div className="me-auto">
          <h2 className="text-black font-w600">Pathology Workflow</h2>
        </div>
        <div>
          <Button
            className="me-2"
            variant={Object.keys(currentFilters).length > 0 ? "success" : "primary"}
            size="sm"
            onClick={() => setShowFilterModal(true)}
          >
            <i className="las la-filter scale5 me-2" /> 
            {Object.keys(currentFilters).length > 0 ? 'Filters Applied' : 'Filter'}
            {Object.keys(currentFilters).length > 0 && (
              <span className="badge bg-light text-dark ms-1">
                {Object.keys(currentFilters).length}
              </span>
            )}
          </Button>
          {Object.keys(currentFilters).length > 0 && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleFilterSubmit({})}
              title="Clear all filters"
            >
              <i className="las la-times" />
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="collection">Collection</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="result">Result Entry</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="authorization">Authorization</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="collection">
            <CollectionTable
              orders={labOrders}
              loading={loading}
              onViewClick={openCollectionModal}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="result">
            <ResultEntryTable
              orders={labOrders}
              loading={loading}
              onAccessionClick={openResultModal}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="authorization">
            <AuthorizationTable
              orders={labOrders}
              loading={loading}
              onAccessionClick={openAuthModal}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Collection Modal */}
      <CollectionModal
        show={showCollectionModal}
        onHide={() => setShowCollectionModal(false)}
        order={selectedOrder}
        tests={orderTests}
        selectedTests={selectedTests}
        onTestSelect={setSelectedTests}
        onCollect={handleCollectTests}
      />

      {/* Result Entry Modal */}
      <ResultEntryModal
        show={showResultModal}
        onHide={() => setShowResultModal(false)}
        order={selectedOrder}
        test={selectedTest}
        parameters={testParameters}
        values={parameterValues}
        onValueChange={setParameterValues}
        onSave={handleSaveResults}
      />

      {/* Authorization Modal */}
      <AuthorizationModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        order={selectedOrder}
        results={testResults}
        onAuthorize={handleAuthorize}
      />

      {/* Filter Modal */}
      <DateFilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        initialFilters={currentFilters}
        onSubmit={handleFilterSubmit}
      />
    </div>
  );
};

// Collection Table Component
const CollectionTable = ({ orders, loading, onViewClick }) => (
  <div>
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Sr No</th>
          <th>Accession No</th>
          <th>Order Date</th>
          <th>Report Name</th>
          <th>Service Names</th>
          <th>Cons./Ref. Doctor</th>
          <th>UHID</th>
          <th>Patient Name</th>
          <th>Age/Sex</th>
          <th>Visit No</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="11" className="text-center">
              Loading...
            </td>
          </tr>
        ) : orders.length === 0 ? (
          <tr>
            <td colSpan="11" className="text-center">
              No orders found
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.accession_no}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.report_name}</td>
              <td>{order.service_names}</td>
              <td>
                {order.consultant_doctor} / {order.ref_doctor}
              </td>
              <td>{order.uhid}</td>
              <td>{order.patient_name}</td>
              <td>
                {order.age}/{order.gender}
              </td>
              <td>{order.visit_no}</td>
              <td>
                <Button size="sm" variant="primary" onClick={() => onViewClick(order)}>
                  View
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </div>
);

// Result Entry Table Component
const ResultEntryTable = ({ orders, loading, onAccessionClick }) => (
  <div className="table-responsive">
    <Table striped bordered hover>
      <thead className="table-dark">
        <tr>
          <th>Sr No</th>
          <th>Accession No</th>
          <th>Order Date</th>
          <th>Report Name</th>
          <th>Service Names</th>
          <th>Cons./Ref. Doctor</th>
          <th>UHID</th>
          <th>Patient Name</th>
          <th>Age/Sex</th>
          <th>Visit No</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="11" className="text-center">
              Loading...
            </td>
          </tr>
        ) : orders.length === 0 ? (
          <tr>
            <td colSpan="11" className="text-center">
              No collected orders found
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>
                <Button variant="link" className="p-0" onClick={() => onAccessionClick(order)}>
                  {order.accession_no}
                </Button>
              </td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.report_name}</td>
              <td>{order.service_names}</td>
              <td>
                {order.consultant_doctor} / {order.ref_doctor}
              </td>
              <td>{order.uhid}</td>
              <td>{order.patient_name}</td>
              <td>
                {order.age}/{order.gender}
              </td>
              <td>{order.visit_no}</td>
              <td>{getStatusBadge(order.status)}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </div>
);

// Authorization Table Component
const AuthorizationTable = ({ orders, loading, onAccessionClick }) => (
  <div className="table-responsive">
    <Table striped bordered hover>
      <thead className="table-dark">
        <tr>
          <th>Sr No</th>
          <th>Accession No</th>
          <th>Order Date</th>
          <th>Report Name</th>
          <th>Service Names</th>
          <th>Cons./Ref. Doctor</th>
          <th>UHID</th>
          <th>Patient Name</th>
          <th>Age/Sex</th>
          <th>Visit No</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="11" className="text-center">
              Loading...
            </td>
          </tr>
        ) : orders.length === 0 ? (
          <tr>
            <td colSpan="11" className="text-center">
              No completed orders found
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>
                <Button variant="link" className="p-0" onClick={() => onAccessionClick(order)}>
                  {order.accession_no}
                </Button>
              </td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.report_name}</td>
              <td>{order.service_names}</td>
              <td>
                {order.consultant_doctor} / {order.ref_doctor}
              </td>
              <td>{order.uhid}</td>
              <td>{order.patient_name}</td>
              <td>
                {order.age}/{order.gender}
              </td>
              <td>{order.visit_no}</td>
              <td>{getStatusBadge(order.status)}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  </div>
);

// Collection Modal Component
const CollectionModal = ({
  show,
  onHide,
  order,
  tests,
  selectedTests,
  onTestSelect,
  onCollect,
}) => {
  const handleTestToggle = testId => {
    if (selectedTests.includes(testId)) {
      onTestSelect(selectedTests.filter(id => id !== testId));
    } else {
      onTestSelect([...selectedTests, testId]);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Collection - {order?.accession_no}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order && (
          <div className="mb-3">
            <strong>Patient:</strong> {order.patient_name} |<strong> UHID:</strong> {order.uhid} |
            <strong> Visit:</strong> {order.visit_no}
          </div>
        )}

        <Table striped bordered>
          <thead>
            <tr>
              <th width="50">Select</th>
              <th>Service Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(test => (
              <tr key={test.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedTests.includes(test.id)}
                    onChange={() => handleTestToggle(test.id)}
                  />
                </td>
                <td>{test.service_name}</td>
                <td>{getStatusBadge(test.status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onCollect} disabled={selectedTests.length === 0}>
          Collect Selected
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Result Entry Modal Component
const ResultEntryModal = ({
  show,
  onHide,
  order,
  test,
  parameters,
  values,
  onValueChange,
  onSave,
}) => {
  const handleParameterChange = (paramId, value) => {
    onValueChange(prev => ({
      ...prev,
      [paramId]: value,
    }));
  };

  const renderInputField = (param) => {
    const currentValue = values[param.parameterId] || param.currentResult?.value || '';
    const status = param.currentResult?.status || 'pending';
    
    // Debug logging for select parameters
    if (param.dataType === 'select') {
      console.log('Select parameter:', param.parameterName, {
        dataType: param.dataType,
        options: param.options,
        currentValue: currentValue,
        parameterId: param.parameterId
      });
    }
    
    switch (param.dataType) {
      case 'numeric':
        return (
          <Form.Control
            type="number"
            step={param.decimalPlaces ? `0.${'0'.repeat(param.decimalPlaces - 1)}1` : '0.01'}
            min={param.minValue || undefined}
            max={param.maxValue || undefined}
            value={currentValue}
            onChange={e => handleParameterChange(param.parameterId, parseFloat(e.target.value) || '')}
            placeholder="Enter numeric value"
            className={status === 'authorized' ? 'bg-light' : ''}
            disabled={status === 'authorized'}
          />
        );
      
      case 'boolean':
        return (
          <Form.Select
            value={currentValue.toString()}
            onChange={e => handleParameterChange(param.parameterId, e.target.value === 'true')}
            className={status === 'authorized' ? 'bg-light' : ''}
            disabled={status === 'authorized'}
          >
            <option value="">Select...</option>
            <option value="true">Positive</option>
            <option value="false">Negative</option>
          </Form.Select>
        );
      
      case 'select':
        return (
          <Form.Select
            value={currentValue}
            onChange={e => handleParameterChange(param.parameterId, e.target.value)}
            className={status === 'authorized' ? 'bg-light' : ''}
            disabled={status === 'authorized'}
          >
            <option value="">Select...</option>
            {param.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        );
      
      case 'text':
      default:
        return (
          <Form.Control
            type="text"
            value={currentValue}
            onChange={e => handleParameterChange(param.parameterId, e.target.value)}
            placeholder="Enter text value"
            className={status === 'authorized' ? 'bg-light' : ''}
            disabled={status === 'authorized'}
          />
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'saved':
        return <Badge bg="info">Saved</Badge>;
      case 'authorized':
        return <Badge bg="success">Authorized</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Result Entry - {test?.reportName || test?.service_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order && (
          <div className="mb-4 p-3 bg-light rounded">
            <Row>
              <Col md={6}>
                <strong>Patient:</strong> {order.patientName || order.patient_name}
              </Col>
              <Col md={6}>
                <strong>Accession No:</strong> {order.accessionNo || order.accession_no}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>UHID:</strong> {order.uhid}
              </Col>
              <Col md={6}>
                <strong>Order ID:</strong> {order.id}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Age/Gender:</strong> {order.ageGender}
              </Col>
              <Col md={6}>
                <strong>Status:</strong> {order.statusDisplay}
              </Col>
            </Row>
          </div>
        )}

        <Form>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                  <th>Methodology</th>
                </tr>
              </thead>
              <tbody>
                {parameters?.map(param => (
                  <tr key={param.parameterId || param.id}>
                    <td>
                      <strong>{param.parameterName || param.parameter_name}</strong>
                      <br />
                      <small className="text-muted">
                        Code: {param.parameterCode || param.code}
                      </small>
                    </td>
                    <td style={{ minWidth: '200px' }}>
                      {renderInputField(param)}
                      {param.currentResult && (param.currentResult.isCritical || param.currentResult.isAbnormal) && (
                        <small className={`d-block mt-1 ${
                          param.currentResult.isCritical ? 'text-danger fw-bold' :
                          param.currentResult.isAbnormal ? 'text-warning' : 'text-success'
                        }`}>
                          {param.currentResult.isCritical ? 'Critical' : 
                           param.currentResult.isAbnormal ? 'Abnormal' : 'Normal'}
                        </small>
                      )}
                    </td>
                    <td>{param.unit || '-'}</td>
                    <td>{param.referenceRange || param.reference_range || '-'}</td>
                    <td>{getStatusBadge(param.currentResult?.status || 'pending')}</td>
                    <td>
                      <small className="text-muted">{param.methodology || '-'}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {parameters?.length === 0 && (
            <div className="text-center text-muted py-4">
              <p>No parameters found for this test</p>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Results
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Authorization Modal Component
const AuthorizationModal = ({ show, onHide, order, results, onAuthorize }) => {
  const [selectedResults, setSelectedResults] = useState(new Set());
  const [authComment, setAuthComment] = useState('');
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedResults(new Set(results.map(r => r.id || r.parameterId)));
    } else {
      setSelectedResults(new Set());
    }
  };
  
  const handleSelectResult = (resultId) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId);
    } else {
      newSelected.add(resultId);
    }
    setSelectedResults(newSelected);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'saved':
        return <Badge bg="info">Saved</Badge>;
      case 'authorized':
        return <Badge bg="success">Authorized</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getInterpretationBadge = (interpretation, value, referenceRange) => {
    if (!interpretation) return null;
    
    switch (interpretation) {
      case 'normal':
        return <Badge bg="success" className="ms-2">Normal</Badge>;
      case 'abnormal':
        return <Badge bg="danger" className="ms-2">Abnormal</Badge>;
      case 'critical':
        return <Badge bg="danger" className="ms-2">Critical</Badge>;
      default:
        return <Badge bg="warning" className="ms-2">{interpretation}</Badge>;
    }
  };

  const handleAuthorize = () => {
    const authData = {
      selectedResults: Array.from(selectedResults),
      comment: authComment
    };
    onAuthorize(authData);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Authorization - {order?.accessionNo || order?.accession_no}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order && (
          <div className="mb-4 p-3 bg-light rounded">
            <Row>
              <Col md={6}>
                <strong>Patient:</strong> {order.patientName || order.patient_name}
              </Col>
              <Col md={6}>
                <strong>UHID:</strong> {order.uhid}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Accession No:</strong> {order.accessionNo || order.accession_no}
              </Col>
              <Col md={6}>
                <strong>Order Date:</strong> {order.orderDate || order.created_at}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Age/Gender:</strong> {order.ageGender}
              </Col>
              <Col md={6}>
                <strong>Status:</strong> {order.statusDisplay}
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <Form.Check
            type="checkbox"
            label="Select All Results"
            checked={selectedResults.size === results.length}
            onChange={handleSelectAll}
            className="fw-bold"
          />
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th style={{width: '40px'}}>Select</th>
                <th>Parameter</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Reference Range</th>
                <th>Status</th>
                <th>Methodology</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id || result.parameterId}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedResults.has(result.id || result.parameterId)}
                      onChange={() => handleSelectResult(result.id || result.parameterId)}
                    />
                  </td>
                  <td>
                    <strong>{result.parameterName || result.parameter_name}</strong>
                    <br />
                    <small className="text-muted">
                      Code: {result.parameterCode || result.code}
                    </small>
                  </td>
                  <td>
                    <span className="fw-bold">{result.value}</span>
                    {getInterpretationBadge(
                      result.interpretation, 
                      result.value, 
                      result.referenceRange || result.reference_range
                    )}
                  </td>
                  <td>{result.unit || '-'}</td>
                  <td>{result.referenceRange || result.reference_range || '-'}</td>
                  <td>{getStatusBadge(result.status)}</td>
                  <td>
                    <small className="text-muted">{result.methodology || '-'}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {results.length === 0 && (
          <div className="text-center text-muted py-4">
            <p>No results available for authorization</p>
          </div>
        )}

        <div className="mt-4">
          <Form.Group>
            <Form.Label>Authorization Comments (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={authComment}
              onChange={(e) => setAuthComment(e.target.value)}
              placeholder="Add any comments or remarks for this authorization..."
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="success" 
          onClick={handleAuthorize}
          disabled={selectedResults.size === 0}
        >
          Authorize Selected ({selectedResults.size})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Helper function for status badge using PathologyService utility
const getStatusBadge = status => {
  const config = PathologyService.utils.getStatusConfig(status);
  return <Badge bg={config.variant}>{config.text}</Badge>;
};

export default PathologyWorkflow;
