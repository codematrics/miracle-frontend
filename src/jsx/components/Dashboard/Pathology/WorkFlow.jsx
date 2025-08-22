import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import usePathologyAPI from '../../../../hooks/usePathologyAPI';
import DateFilterModal from './modals/DateFilterModal';
import StageModal from './modals/StageModal';
import WorkFlowTable from './components/WorkFlowTable';
import { getStageTitle, validateTestSelection, prepareTestParameters } from './utils/workflowUtils';
import './workflow.css';

const WorkFlow = ({ stage = 'collection' }) => {
  const [dateFilterModal, setDateFilterModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTests, setOrderTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testParameters, setTestParameters] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [currentFilters, setCurrentFilters] = useState({});
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const { loading, fetchLabOrders, fetchOrderTests, collectTests, saveResults, authorizeOrder } = usePathologyAPI();

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
    setShowStageModal(true);
    const orderData = await fetchOrderTests(order.id, stage);
    // Merge order info with test data
    setOrderTests({
      ...order,
      ...orderData
    });
  };



  const handleCollectTests = async () => {
    const validation = validateTestSelection(selectedTests, 'collection');
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const success = await collectTests(selectedTests);
    if (success) {
      setShowStageModal(false);
      setSelectedTests([]);
      // Check if current page might be empty after action, go to previous page if needed
      const currentPage = tableData.length === 1 && pagination.page > 1 
        ? pagination.page - 1 
        : pagination.page;
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

  const handleFilterSubmit = async (filters) => {
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
            variant={Object.keys(currentFilters).length > 0 ? "success" : "primary"}
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

    </>
  );
};

export default WorkFlow;
