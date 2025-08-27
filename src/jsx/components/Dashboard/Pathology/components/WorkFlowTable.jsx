import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PathologyService, { TEST_STATUS } from '../../../../../services/PathologyService';

const WorkFlowTable = ({
  tableData,
  loading,
  pagination,
  onAccessionClick,
  stage,
  activePag,
  onClick,
  onPrevious,
  onNext,
}) => {
  const getStatusClass = status => {
    if (stage === 'collection') {
      const statusClasses = {
        [TEST_STATUS.PENDING]: 'bg-white',
        [TEST_STATUS.COLLECTED]: 'bg-red',
        [TEST_STATUS.SAVED]: 'bg-blue',
        [TEST_STATUS.AUTHORIZED]: 'bg-green',
      };
      return statusClasses[status] || '';
    }
    return '';
  };

  const getStatusBadge = status => {
    const config = PathologyService.utils.getStatusConfig(status);
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const paggination = Array(Math.ceil(pagination.total / pagination.limit))
    .fill()
    .map((_, i) => i + 1);

  return (
    <div className="card-table dataTables_wrapper no-footer">
      <div id="workflow_list" className="table-responsive">
        <table id="example5" className="dataTable text-black">
          <thead>
            <tr>
              <th style={{ wordWrap: 'break-word', paddingRight: '15px' }}>Sr No</th>
              <th style={{ wordWrap: 'break-word' }}>Accession</th>
              <th style={{ wordWrap: 'break-word' }}>Order Date</th>
              <th style={{ wordWrap: 'break-word' }}>Head Type</th>
              <th style={{ wordWrap: 'break-word' }}>Service Name</th>
              <th style={{ wordWrap: 'break-word' }}>Cons.Dr / Ref.Dr.</th>
              <th style={{ wordWrap: 'break-word' }}>UHID</th>
              <th style={{ wordWrap: 'break-word' }}>Patient Name</th>
              <th style={{ wordWrap: 'break-word' }}>Age/Sex</th>
              <th style={{ wordWrap: 'break-word' }}>Visit No</th>
              <th style={{ wordWrap: 'break-word' }}>Status</th>
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
                      onClick={() => onAccessionClick(item)}
                      style={{ cursor: 'pointer', color: '#007bff' }}
                      role="button"
                      tabIndex={0}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          onAccessionClick(item);
                        }
                      }}
                    >
                      {item.labOrder.accessionNo}
                    </span>
                  </td>
                  <td className={getStatusClass(item.status)}>
                    {new Date(item.labOrder.orderDate).toLocaleDateString()}{' '}
                    {new Date(item.labOrder.orderDate).toLocaleTimeString()}
                  </td>
                  <td className={getStatusClass(item.status)}>
                    {item.service.headType || 'Lab Report'}
                  </td>
                  <td
                    className={getStatusClass(item.status)}
                    style={{ width: '20%', wordWrap: 'break-word' }}
                  >
                    {item.service.serviceName}
                  </td>
                  <td className={getStatusClass(item.status)}>
                    {item.doctor?.name || 'N/A'} / {item.referredBy || 'Self'}
                  </td>
                  <td className={getStatusClass(item.status)}>{item.patient?.uhidNo}</td>
                  <td className={getStatusClass(item.status)}>{item.patient?.name}</td>
                  <td className={getStatusClass(item.status)}>
                    {item.patient?.age}/{item.patient?.gender}
                  </td>
                  <td className={getStatusClass(item.status)}>{item.visit.code || 'N/A'}</td>
                  <td className={getStatusClass(item.status)}>{getStatusBadge(item.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-sm-flex text-center justify-content-between align-items-center">
        <div className="dataTables_info" id="example5_info" role="status" aria-live="polite">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
          entries
        </div>
        <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-center align-items-center pb-3">
          <Link
            to="#"
            className={`paginate_button previous ${pagination.page <= 1 ? 'disabled' : ''}`}
            aria-controls="example5"
            data-dt-idx={0}
            tabIndex={0}
            id="example5_previous"
            onClick={onPrevious}
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
            className={`paginate_button next ${pagination.page >= pagination.pages ? 'disabled' : ''}`}
            aria-controls="example5"
            data-dt-idx={2}
            tabIndex={0}
            id="example5_next"
            onClick={onNext}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkFlowTable;
