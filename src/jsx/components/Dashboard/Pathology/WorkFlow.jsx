import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Form, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ORDER_STATUS } from '../../../../constants/enums';
import PathologyService, { TEST_STATUS } from '../../../../services/PathologyService';
import './workflow.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const WorkFlow = ({ stage = 'collection' }) => {
  const [openAddPatientModel, setOpenAddPatientModal] = useState();
  const [dateFilterModal, setDateFilterModal] = useState(false);

  // Modal states for different stages
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTests, setOrderTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testParameters, setTestParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const sort = 10;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Fetch lab orders based on stage
  const fetchLabOrders = async (page = 1) => {
    setLoading(true);
    try {
      let endpoint = '';
      const params = new URLSearchParams({
        category: 'pathology',
        page: page.toString(),
        limit: '10',
      });

      switch (stage) {
        case 'collection':
          endpoint = `${API_URL}/lab/orders?${params}`;
          break;
        case 'result':
          endpoint = `${API_URL}/lab/entry-orders?page=${page}`;
          break;
        case 'authorization':
          endpoint = `${API_URL}/lab/authorization?page=${page}`;
          break;
        default:
          endpoint = `${API_URL}/lab/orders?page=${page}`;
      }

      // Get auth token
      const userDetails = localStorage.getItem('userDetails');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (userDetails) {
        const { token } = JSON.parse(userDetails);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(endpoint, { headers });
      const result = await response.json();

      if (result.success) {
        setTableData(result.data || []);
        setPagination(result.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      } else {
        toast.error('Failed to fetch lab orders');
      }
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      toast.error('Failed to fetch lab orders');
    } finally {
      setLoading(false);
    }
  };

  // Active data - updated for dynamic data
  const chageData = (frist, sec) => {
    // This function is now handled by pagination from API
    // Keep for compatibility with existing pagination UI
  };

  const getStatusClass = status => {
    if (stage === 'collection') {
      switch (status) {
        case TEST_STATUS.PENDING:
          return 'bg-white';
        case TEST_STATUS.COLLECTED:
          return 'bg-red';
        case TEST_STATUS.SAVED:
          return 'bg-blue';
        case TEST_STATUS.AUTHORIZED:
          return 'bg-green';
        default:
          return '';
      }
    }
  };

  // use effect
  useEffect(() => {
    fetchLabOrders(1); // Fetch data when component mounts or stage changes
  }, [stage]);

  useEffect(() => {
    setData(document.querySelectorAll('#workflow_list tbody tr'));
  }, [tableData, test]);

  activePag.current === 0 && chageData(0, sort);

  let paggination = Array(Math.ceil(pagination.total / pagination.limit))
    .fill()
    .map((_, i) => i + 1);

  const onClick = i => {
    activePag.current = i;
    fetchLabOrders(i + 1); // API pagination starts from 1
    settest(i);
  };

  // Handle accession number click based on stage
  const handleAccessionClick = async order => {
    setSelectedOrder(order);
    setShowStageModal(true);

    if (stage === 'collection') {
      await fetchOrderTests(order.id);
    } else if (stage === 'result') {
      await fetchOrderTests(order.id); // Need tests for result entry
    } else if (stage === 'authorization') {
      await fetchOrderTests(order.id);
    }
  };

  // Fetch lab order tests based on stage
  const fetchOrderTests = async orderId => {
    try {
      let endpoint = '';
      switch (stage) {
        case 'collection': {
          const params = `?category=pathology`;
          endpoint = `${API_URL}/lab/orders/${orderId}/details${params}`;
          break;
        }
        case 'result': {
          const params = `?category=pathology`;
          endpoint = `${API_URL}/lab/orders/${orderId}/details${params}`;
          break;
        }
        case 'authorization': {
          const params = `?category=pathology`;
          endpoint = `${API_URL}/lab/orders/${orderId}/details${params}`;
          break;
        }
        default:
          endpoint = `${API_URL}/lab/orders/${orderId}`;
      }

      // Get auth token
      const userDetails = localStorage.getItem('userDetails');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (userDetails) {
        const { token } = JSON.parse(userDetails);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(endpoint, { headers });
      const result = await response.json();

      if (result.success) {
        setOrderTests(result.data || []);
        if (stage === 'authorization') {
          setTestResults(result.data || []);
        }
        setSelectedTests([]);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  const fetchTestParameters = async params => {
    setTestParameters(
      params?.map(params => ({
        ...params,
        value: params?.value || params?.currentResult?.value || '',
      })) || []
    );
    const initialValues = {};
    params.forEach(param => {
      initialValues[param.id] = param.default_value || '';
    });
    setParameterValues(initialValues);
  };

  // Handle test collection
  const handleCollectTests = async () => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test to collect');
      return;
    }

    try {
      // Get auth token
      const userDetails = localStorage.getItem('userDetails');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (userDetails) {
        const { token } = JSON.parse(userDetails);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_URL}/lab/reports/bulk-update-status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reportIds: selectedTests,
          status: ORDER_STATUS.COLLECTED,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Tests collected successfully');
        setShowStageModal(false);
        fetchLabOrders(pagination.page); // Refresh current page
      } else {
        toast.error(result.message || 'Failed to collect tests');
      }
    } catch (error) {
      console.error('Error collecting tests:', error);
      toast.error('Failed to collect tests');
    }
  };

  // Handle result entry save
  const handleSaveResults = async e => {
    try {
      e.preventDefault();

      // Get auth token
      const userDetails = localStorage.getItem('userDetails');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (userDetails) {
        const { token } = JSON.parse(userDetails);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const resultsData = {
        orderId: selectedOrder.id,
        labOrderTestId: selectedTests[0],
        results: testParameters.filter(params => params?.value),
      };

      const response = await fetch(`${API_URL}/lab/entry/save`, {
        method: 'POST',
        headers, // ✅ include headers
        body: JSON.stringify(resultsData), // ✅ stringify payload
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Results saved successfully');
        setShowStageModal(false);
        // fetchLabOrders(pagination.page); // Refresh current page
      } else {
        toast.error(result.message || 'Failed to save results');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
    }
  };

  // Handle authorization
  const handleAuthorize = async e => {
    e.preventDefault();
    try {
      // Get auth token
      const userDetails = localStorage.getItem('userDetails');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (userDetails) {
        const { token } = JSON.parse(userDetails);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      const resultsData = {
        orderId: selectedOrder.id,
        labOrderTestId: selectedTests[0],
        results: testParameters.filter(params => params?.value),
      };

      const response = await fetch(`${API_URL}/lab/authorization/update-and-authorize`, {
        method: 'POST',
        headers,
        body: JSON.stringify(resultsData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order authorized successfully');
        setShowStageModal(false);
        fetchLabOrders(pagination.page); // Refresh current page
      } else {
        toast.error(result.message || 'Failed to authorize order');
      }
    } catch (error) {
      console.error('Error authorizing order:', error);
      toast.error('Failed to authorize order');
    }
  };

  // Get status badge
  const getStatusBadge = status => {
    const config = PathologyService.utils.getStatusConfig(status);
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // Get stage title
  const getStageTitle = () => {
    switch (stage) {
      case 'collection':
        return 'Collection';
      case 'result':
        return 'Result Entry';
      case 'authorization':
        return 'Authorization';
      default:
        return 'Workflow';
    }
  };

  return (
    <>
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">{getStageTitle()} - Pathology Workflow</h2>
        </div>
        <div>
          <Button
            className="me-2"
            variant="primary btn-sm"
            onClick={() => setDateFilterModal(true)}
          >
            <i className="las la-calendar-plus scale5 me-2" /> Filter Date
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card-table  dataTables_wrapper no-footer  ">
            <div id="workflow_list" className="table-responsive">
              <table id="example5" className="dataTable text-black">
                <thead>
                  <tr>
                    <th style={{ wordWrap: 'break-word', paddingRight: '15px' }}>Sr No</th>
                    <th style={{ wordWrap: 'break-word' }}>Accession</th>
                    <th style={{ wordWrap: 'break-word' }}>Order Date</th>
                    <th style={{ wordWrap: 'break-word' }}>Report Name</th>
                    <th style={{ wordWrap: 'break-word' }}>Service Name</th>
                    <th style={{ wordWrap: 'break-word' }}>Cons.Dr / Ref.Dr.</th>
                    <th style={{ wordWrap: 'break-word' }}>UHID</th>
                    <th style={{ wordWrap: 'break-word' }}>Patient Name</th>
                    <th style={{ wordWrap: 'break-word' }}>Age/Sex</th>
                    <th style={{ wordWrap: 'break-word' }}>Visit No</th>
                    <th style={{ wordWrap: 'break-word' }} className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    tableData.map((item, ind) => (
                      <tr key={item.id} className={getStatusClass(item.status)}>
                        <td className={getStatusClass(item.status)}>
                          {(pagination.page - 1) * pagination.limit + ind + 1}
                        </td>
                        <td className={getStatusClass(item.status)}>
                          <span
                            onClick={() => handleAccessionClick(item)}
                            style={{ cursor: 'pointer', color: '#007bff' }}
                            role="button"
                            tabIndex={0}
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                handleAccessionClick(item);
                              }
                            }}
                          >
                            {item.formattedAccession || item.accessionNo}
                          </span>
                        </td>
                        <td className={getStatusClass(item.status)}>
                          {new Date(item.orderDate).toLocaleDateString()}{' '}
                          {new Date(item.orderDate).toLocaleTimeString()}
                        </td>
                        <td className={getStatusClass(item.status)}>
                          {item.reportName || 'Lab Report'}
                        </td>
                        <td
                          className={getStatusClass(item.status)}
                          style={{ width: '20%', wordWrap: 'break-word' }}
                        >
                          {item.serviceName || `${item.totalTests} Tests`}
                        </td>
                        <td className={getStatusClass(item.status)}>
                          {item.doctorInfo?.name || 'N/A'} / {item.referredBy || 'Self'}
                        </td>
                        <td className={getStatusClass(item.status)}>{item.uhid}</td>
                        <td className={getStatusClass(item.status)}>{item.patientName}</td>
                        <td className={getStatusClass(item.status)}>{item.ageGender}</td>
                        <td className={getStatusClass(item.status)}>{item.visitNo || 'N/A'}</td>
                        <td className={getStatusClass(item.status)}>
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-sm-flex text-center justify-content-between align-items-center">
              <div className="dataTables_info" id="example5_info" role="status" aria-live="polite">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} entries
              </div>
              <div className="dataTables_paginate paging_simple_numbers d-flex  justify-content-center align-items-center pb-3">
                <Link
                  to="#"
                  className="paginate_button previous disabled"
                  aria-controls="example5"
                  data-dt-idx={0}
                  tabIndex={0}
                  id="example5_previous"
                  onClick={() => pagination.page > 1 && onClick(activePag.current - 1)}
                >
                  Previous
                </Link>
                <span className="d-flex">
                  {paggination.map((number, i) => (
                    <Link
                      key={i}
                      to="#"
                      className={`paginate_button d-flex align-items-center justify-content-center ${
                        activePag.current === i ? 'current' : ''
                      } ${i > 0 ? 'ms-1' : ''}`}
                      aria-controls="example5"
                      data-dt-idx={1}
                      tabIndex={0}
                      onClick={() => onClick(i)}
                    >
                      {number}
                    </Link>
                  ))}
                </span>

                <Link
                  to="#"
                  className="paginate_button next disabled"
                  aria-controls="example5"
                  data-dt-idx={2}
                  tabIndex={0}
                  id="example5_next"
                  onClick={() =>
                    pagination.page < pagination.pages && onClick(activePag.current + 1)
                  }
                >
                  Next
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Date Filter Modal --> */}
      <Modal className="fade" show={dateFilterModal} onHide={setDateFilterModal} centered>
        <Modal.Header>
          <Modal.Title>Date Filter</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setDateFilterModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">From Date</label>
                <input
                  type="date"
                  id="fromdate"
                  name="fromdate"
                  className="form-control text-black"
                  style={{ height: '35px' }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">To Date</label>
                <input
                  type="date"
                  id="todate"
                  name="todate"
                  className="form-control text-black"
                  style={{ height: '35px' }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">Mobile No</label>
                <input
                  type="number"
                  id="mobileno"
                  name="mobileno"
                  className="form-control text-black"
                  style={{ height: '35px' }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">Patient ID</label>
                <input
                  type="text"
                  id="patientid"
                  name="patientid"
                  className="form-control text-black"
                  style={{ height: '35px' }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="text-black font-w500">Patient Name</label>
                <input
                  type="text"
                  id="patientname"
                  name="patientname"
                  className="form-control text-black"
                  style={{ height: '35px' }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setDateFilterModal(false)} variant="dark btn-sm">
            Close
          </Button>
          <Button variant="primary btn-sm">Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Stage Modal - Collection/Result Entry/Authorization */}
      <Modal show={showStageModal} onHide={() => setShowStageModal(false)} size="lg" centered>
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

          {stage === 'collection' && (
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
                          test.status === ORDER_STATUS.COLLECTED
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
          )}

          {stage === 'result' && (
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
                          setTestParameters(test.parameters);
                          fetchTestParameters(test.parameters);
                        }
                      }}
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
                  <Form onSubmit={handleSaveResults}>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Code</th>
                          <th>Unit</th>
                          <th>Reference Range</th>
                          <th>Result</th>
                          {/* <th>Remarks</th> */}
                          {/* <th>Flags</th> */}
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
                                      value: e.target.value, // ✅ only change value key
                                    };
                                    return updated;
                                  })
                                }
                              />
                            </td>
                            {/* <td>
                              <Form.Control
                                type="text"
                                value={parameterValues[param.id] || ''}
                                onChange={e =>
                                  setParameterValues(prev => ({
                                    ...prev,
                                    [param.id]: e.target.value,
                                  }))
                                }
                                placeholder="Enter value"
                              />
                            </td> */}
                            {/* <td>
                              {Object.keys(testResults[index].flags).map(flag => (
                                <Form.Check
                                  key={flag}
                                  type="checkbox"
                                  label={flag}
                                  checked={testResults[index].flags[flag]}
                                  onChange={() => handleFlagChange(index, flag)}
                                />
                              ))}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setTestParameters([]);
                          setTestResults([]);
                        }}
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
          )}

          {stage === 'authorization' && (
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
                        if (test.status === TEST_STATUS.SAVED) {
                          setSelectedTests([test.testId]);
                          setTestParameters(test.parameters);
                          fetchTestParameters(test.parameters);
                        }
                      }}
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
                  <Form onSubmit={handleAuthorize}>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Code</th>
                          <th>Unit</th>
                          <th>Reference Range</th>
                          <th>Result</th>
                          {/* <th>Remarks</th> */}
                          {/* <th>Flags</th> */}
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
                            {/* <td>
                              <Form.Control
                                type="text"
                                value={parameterValues[param.id] || ''}
                                onChange={e =>
                                  setParameterValues(prev => ({
                                    ...prev,
                                    [param.id]: e.target.value,
                                  }))
                                }
                                placeholder="Enter value"
                              />
                            </td> */}
                            {/* <td>
                              {Object.keys(testResults[index].flags).map(flag => (
                                <Form.Check
                                  key={flag}
                                  type="checkbox"
                                  label={flag}
                                  checked={testResults[index].flags[flag]}
                                  onChange={() => handleFlagChange(index, flag)}
                                />
                              ))}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setTestParameters([]);
                          setTestResults([]);
                        }}
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
          )}
        </Modal.Body>
        <Modal.Footer>
          {stage === 'collection' && (
            <Button variant="secondary" onClick={() => setShowStageModal(false)}>
              Close
            </Button>
          )}
          {stage === 'collection' && (
            <Button
              variant="primary"
              onClick={handleCollectTests}
              disabled={selectedTests.length === 0}
            >
              Collect Selected
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* <!-- Add New Patient Modal --> */}
      <Modal
        className="modal fade"
        id="addNewPatientModal"
        show={openAddPatientModel}
        onHide={setOpenAddPatientModal}
        centered={true}
        size={'xl'}
        backdropClassName={'role'}
        backdrop={'static'}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Patient </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setOpenAddPatientModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="text-black">
                      Patient Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">
                      Relation <span className="text-danger">*</span>
                    </label>
                    <select className="form-control text-black" style={{ height: '40px' }}>
                      <option value="1">S/O</option>
                      <option value="2">W/O</option>
                      <option value="3">D/O</option>
                      <option value="4">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="text-black">
                      F/H Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">
                      Age <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <input
                        type="number"
                        className="form-control text-black"
                        style={{ height: '40px', width: '40%' }}
                      />
                      <select
                        className="form-control text-black"
                        style={{ height: '40px', width: '60%' }}
                      >
                        <option value="1">Year</option>
                        <option value="2">Month</option>
                        <option value="3">Day</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="text-black">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <div className="form-control" style={{ height: '40px' }}>
                      <div className="form-check custom-checkbox form-check-inline text-black">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="gendermale"
                          name="gender"
                        />
                        <label className="form-check-label" htmlFor="gendermale">
                          Male
                        </label>
                      </div>
                      <div className="form-check custom-checkbox form-check-inline text-black">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="genderfemale"
                          name="gender"
                        />
                        <label className="form-check-label" htmlFor="genderfemale">
                          Female
                        </label>
                      </div>
                      <div className="form-check custom-checkbox form-check-inline text-black">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="genderother"
                          name="gender"
                        />
                        <label className="form-check-label" htmlFor="genderother">
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">Marital Status</label>
                    <select
                      name="marital_status"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="">Select Marital</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Married">Married</option>
                      <option value="Separated">Separated</option>
                      <option value="Unmarried">Unmarried</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">Religion</label>
                    <select
                      name="religion"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="Hindu">Hindu</option>
                      <option value="Buddhist">Buddhist</option>
                      <option value="Christian">Christian</option>
                      <option value="Jain">Jain</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Parsi">Parsi</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="text-black">Occupation</label>
                    <select
                      name="occupation"
                      id="occupation"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="1">SELF EMPLOYED</option>
                      <option value="2">GOVT. SERVICE</option>
                      <option value="3">PVT. SERVICE</option>
                      <option value="4">BUSINESS</option>
                      <option value="5">HOUSE WORK</option>
                      <option value="6">STUDY</option>
                      <option value="7">UN-EMPLOYED</option>
                      <option value="8">OTHER</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">
                      Mobile No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobileno"
                      id="mobileno"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label className="text-black">Email Id</label>
                    <input
                      type="text"
                      name="emailid"
                      id="emailid"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">
                      ID Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="idtype"
                      name="idtype"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="1">Aadhar Card</option>
                      <option value="2">Pancard</option>
                      <option value="3">Driving license</option>
                      <option value="4">Voter ID</option>
                      <option value="5">Passport</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">
                      ID No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="idno"
                      id="idno"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">Patient Type</label>
                    <select
                      id="patienttype"
                      name="patienttype"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="1">General</option>
                      <option value="2">VIP</option>
                      <option value="3">Staff</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="text-black">
                      Village/Colony <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="village"
                      id="village"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">
                      State <span className="text-danger">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="1">Madhya Pradesh</option>
                      <option value="2">Rajasthan</option>
                      <option value="3">Gujarat</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">
                      District <span className="text-danger">*</span>
                    </label>
                    <select
                      id="district"
                      name="district"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    >
                      <option value="1">Mandsaur</option>
                      <option value="2">Ratlam</option>
                      <option value="3">Neemuch</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">
                      Tehsil <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="tehsil"
                      id="tehsil"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="text-black">
                      Post <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="postoffice"
                      id="postoffice"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="text-black">
                      Pincode <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      id="pincode"
                      className="form-control text-black"
                      style={{ height: '40px' }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger btn-sm light"
              onClick={() => setOpenAddPatientModal(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-sm btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WorkFlow;
