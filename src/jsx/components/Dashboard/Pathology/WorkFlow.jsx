import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import usePathologyAPI from '../../../../hooks/usePathologyAPI';
import WorkFlowTable from './components/WorkFlowTable';
import AuthorizeResultModal from './modals/AuthorizeResultModal';
import DateFilterModal from './modals/DateFilterModal';
import ReportTypesModal from './modals/ReportTypesModal';
import ResultEntryModal from './modals/ResultEntryModal';
import SampleCollection from './modals/SampleCollection';
import StageModal from './modals/StageModal';
import { getStageTitle, validateTestSelection } from './utils/workflowUtils';
import './workflow.css';

const WorkFlow = ({ stage = 'collection' }) => {
  const [dateFilterModal, setDateFilterModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showResultEntryModal, setShowResultEntryModal] = useState(false);
  const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);
  const [showReportTypesModal, setShowReportTypesModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTests, setOrderTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testParameters, setTestParameters] = useState([]);
  const [resultOrderData, setResultOrderData] = useState(null);
  const [authorizeOrderData, setAuthorizeOrderData] = useState(null);
  const [reportTypesData, setReportTypesData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [currentFilters, setCurrentFilters] = useState({});
  const [sampleCollection, setSampleCollection] = useState(false);
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const { loading, fetchLabOrders, fetchOrderTests, collectTests, saveResults, authorizeOrder } =
    usePathologyAPI();

  const loadLabOrders = async (page = 1, filters = currentFilters) => {
    const result = await fetchLabOrders(stage, page, filters);
    setTableData(result.data);
    setPagination(result.pagination);
  };

  useEffect(() => {
    activePag.current = 0;
    setCurrentFilters({}); // Clear filters when stage changes
    loadLabOrders(1, {});
  }, [stage]);

  const onClick = i => {
    activePag.current = i;
    loadLabOrders(i + 1, currentFilters);
    settest(i);
  };

  const handlePrevious = () => {
    if (pagination.page > 1) {
      onClick(activePag.current - 1);
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.pages) {
      onClick(activePag.current + 1);
    }
  };

  const handleAccessionClick = async order => {
    setSelectedOrder(order);
    setSelectedTests(order.collectedSamples || []);

    // Check if order is authorized - show report types modal
    if (order.status === 'authorized' || order.status === 'completed') {
      const reportTypesData = await fetchReportTypes(order._id);
      setReportTypesData(reportTypesData);
      setShowReportTypesModal(true);
      return;
    }

    if (stage === 'collection') {
      setSampleCollection(true);
    } else if (stage === 'result') {
      // Use new ResultEntryModal for result stage
      const orderTestParameter = await fetchOrderTests(order._id, stage);
      setResultOrderData(orderTestParameter);
      setShowResultEntryModal(true);
    } else if (stage === 'authorization') {
      // Use new AuthorizeResultModal for authorization stage
      const orderTestParameter = await fetchOrderTests(order._id, stage);
      setAuthorizeOrderData(orderTestParameter);
      setShowAuthorizeModal(true);
    } else {
      const orderTestParameter = await fetchOrderTests(order._id, stage);
      setShowStageModal(true);
      setOrderTests({
        ...order,
        ...orderTestParameter,
      });
    }
  };

  // Fetch report types data for authorized orders
  const fetchReportTypes = async orderId => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/printable?labTestOrderId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data.success || data.status) {
        return data.data;
      } else {
        toast.error('Failed to fetch report types');
        return null;
      }
    } catch (error) {
      console.error('Error fetching report types:', error);
      toast.error('Failed to fetch report types');
      return null;
    }
  };

  // Fetch order data for authorization modal
  const fetchAuthorizeOrderData = async orderId => {
    try {
      // This should call your API endpoint that returns the authorization data with results
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab/orders/${orderId}/authorize`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data.success || data.status) {
        setAuthorizeOrderData(data.data);
        setShowAuthorizeModal(true);
      } else {
        toast.error('Failed to fetch authorization data');
      }
    } catch (error) {
      console.error('Error fetching authorization data:', error);
      toast.error('Failed to fetch authorization data');
    }
  };

  const handleCollectTests = async () => {
    const validation = validateTestSelection(selectedTests, 'collection');
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const success = await collectTests(selectedTests, selectedOrder._id);
    if (success) {
      setShowStageModal(false);
      setSelectedTests([]);
      // Check if current page might be empty after action, go to previous page if needed
      const currentPage =
        tableData.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      if (currentPage !== pagination.page) {
        activePag.current = currentPage - 1;
      }
      await loadLabOrders(currentPage);
    }
  };

  const handleSaveResults = async e => {
    e.preventDefault();
    const success = await saveResults(selectedOrder.id, selectedTests[0], testParameters);
    if (success) {
      setShowStageModal(false);
      setSelectedTests([]);
      setTestParameters([]);
      await loadLabOrders(pagination.page);
    }
  };

  // Handle save results from new ResultEntryModal
  const handleSaveResultEntry = async resultData => {
    try {
      // Call API to save the grouped results
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lab-test-orders/save-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
        },
        body: JSON.stringify(resultData),
      });

      const data = await response.json();

      if (data.status) {
        setShowResultEntryModal(false);
        setResultOrderData(null);
        await loadLabOrders(pagination.page);
        toast.success('Results saved successfully');
      } else {
        throw new Error(data.message || 'Failed to save results');
      }
    } catch (error) {
      console.error('Error saving result entry:', error);
      toast.error(error.message || 'Failed to save results');
      throw error; // Re-throw to let the modal handle loading state
    }
  };

  // Handle authorize results from AuthorizeResultModal
  const handleAuthorizeResults = async authData => {
    try {
      // Call API to authorize the selected results
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lab-test-orders/save-authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userDetails'))?.token}`,
          },
          body: JSON.stringify(authData),
        }
      );

      const data = await response.json();

      if (data.success || data.status) {
        setShowAuthorizeModal(false);
        setAuthorizeOrderData(null);
        await loadLabOrders(pagination.page);
        toast.success('Results authorized successfully');
      } else {
        throw new Error(data.message || 'Failed to authorize results');
      }
    } catch (error) {
      console.error('Error authorizing results:', error);
      toast.error(error.message || 'Failed to authorize results');
      throw error; // Re-throw to let the modal handle loading state
    }
  };

  const handleAuthorize = async e => {
    e.preventDefault();
    const success = await authorizeOrder(selectedOrder.id, selectedTests[0], testParameters);
    if (success) {
      setShowStageModal(false);
      setSelectedTests([]);
      setTestParameters([]);
      await loadLabOrders(pagination.page);
    }
  };

  const handleFilterSubmit = async filters => {
    setCurrentFilters(filters);
    activePag.current = 0;
    settest(0);
    await loadLabOrders(1, filters);
  };

  return (
    <>
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">{getStageTitle(stage)} - Pathology Workflow</h2>
        </div>
        <div>
          <Button
            className="me-2"
            variant={Object.keys(currentFilters).length > 0 ? 'success' : 'primary'}
            size="sm"
            onClick={() => setDateFilterModal(true)}
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

      <div className="row">
        <div className="col-xl-12">
          <WorkFlowTable
            tableData={tableData}
            loading={loading}
            pagination={pagination}
            onAccessionClick={handleAccessionClick}
            stage={stage}
            activePag={activePag}
            onClick={onClick}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>

      <DateFilterModal
        show={dateFilterModal}
        onHide={() => setDateFilterModal(false)}
        initialFilters={currentFilters}
        onSubmit={handleFilterSubmit}
      />

      <StageModal
        show={showStageModal}
        onHide={() => setShowStageModal(false)}
        stage={stage}
        selectedOrder={selectedOrder}
        orderTests={orderTests}
        selectedTests={selectedTests}
        setSelectedTests={setSelectedTests}
        testParameters={testParameters}
        setTestParameters={setTestParameters}
        onCollectTests={handleCollectTests}
        onSaveResults={handleSaveResults}
        onAuthorize={handleAuthorize}
        getStageTitle={getStageTitle}
      />

      <SampleCollection
        show={sampleCollection}
        onHide={() => setSampleCollection(false)}
        selectedTestOrder={selectedOrder}
        selectedTests={selectedTests}
        setSelectedTests={setSelectedTests}
        onCollectTests={handleCollectTests}
      />

      <ResultEntryModal
        show={showResultEntryModal}
        onHide={() => setShowResultEntryModal(false)}
        orderData={resultOrderData}
        onSaveResults={handleSaveResultEntry}
      />

      <AuthorizeResultModal
        show={showAuthorizeModal}
        onHide={() => setShowAuthorizeModal(false)}
        orderData={authorizeOrderData}
        onSaveResults={handleSaveResultEntry}
        onAuthorize={handleAuthorizeResults}
      />

      <ReportTypesModal
        show={showReportTypesModal}
        onHide={() => setShowReportTypesModal(false)}
        orderData={reportTypesData}
      />
    </>
  );
};

export default WorkFlow;
