import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import bedAPIService from '../../../../services/BedService';
import BedCreateAndUpdate from './BedCreateAndUpdate';

const BedListing = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [bedModal, setBedModal] = useState({
    open: false,
    data: null,
  });

  const fetchData = () => {
    setLoading(true);
    bedAPIService
      .getAll()
      .then(res => {
        setData(res?.data?.beds);
        const totalPages = Math.ceil(res?.data?.total / res?.data?.limit);
        setPagination({ current: res?.data?.page, total: totalPages });
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = id => {
    bedAPIService
      .delete(id)
      .then(response => {
        console.log('Bed deleted successfully:', response);
        // Refresh the bed list after deletion
        bedAPIService.getAll().then(res => {
          setData(res?.data?.beds);
          const totalPages = Math.ceil(res?.data?.total / res?.data?.limit);
          setPagination({ current: res?.data?.page, total: totalPages });
        });
      })
      .catch(error => {
        console.error('Error deleting bed:', error);
      });
  };

  const setCreateOpen = status => {
    setBedModal({ open: status, data: null });
  };

  const setUpdateOpen = (status, data) => {
    setBedModal({ open: status, data: data });
  };

  const setClose = () => {
    setBedModal({ open: false, data: null });
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current]);

  return (
    <>
      <div
        className="form-head align-items-center d-flex mb-sm-4 mb-3"
        style={{ minHeight: '100%' }}
      >
        <div className="me-auto">
          <h2 className="text-black font-w600">Beds Management</h2>
        </div>
        <div>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="me-2" variant="primary" size="sm">
                <i className="fa fa-plus color-info" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item to="" onClick={() => setCreateOpen(true)}>
                  Bed
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          {/* <Button
            className="me-2"
            variant="primary btn-sm"
            onClick={() => setDateFilterModal(true)}
          >
            <i className="las la-calendar-plus scale5 me-2" /> Filter Date
          </Button> */}
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="table-responsive card-table">
            <div id="billing_list" className="dataTables_wrapper no-footer">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <table
                    id="example5"
                    className="table dataTable no-footer display dataTablesCard white-border table-responsive-xl"
                  >
                    <thead>
                      <tr>
                        <th>Bed Number</th>
                        <th>Ward</th>
                        <th>Floor</th>
                        <th>Status</th>
                        <th>Patient Name</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, ind) => (
                        <tr key={ind}>
                          <td>{item.bedNumber}</td>
                          <td>{item.ward?.name}</td>
                          <td>{item.ward?.floor?.name}</td>
                          <td>{item.status}</td>
                          <td>{item.patientId?.name || '-'}</td>
                          <td>
                            <Button onClick={() => setUpdateOpen(true, item)}>Edit</Button>
                            <Button onClick={() => handleDelete(item._id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-sm-flex text-center justify-content-between align-items-center">
                    <div
                      className="dataTables_info"
                      id="example5_info"
                      role="status"
                      aria-live="polite"
                    >
                      {/* Showing {activePag.current * sort + 1} to{' '}
                  {data.length > (activePag.current + 1) * sort
                    ? (activePag.current + 1) * sort
                    : data.length}{' '}
                  of {data.length} entries */}
                    </div>
                    <div className="dataTables_paginate paging_simple_numbers d-flex  justify-content-center align-items-center pb-3">
                      <Link
                        to="#"
                        className="paginate_button previous disabled"
                        aria-controls="example5"
                        data-dt-idx={0}
                        tabIndex={0}
                        id="example5_previous"
                        // onClick={() => activePag.current > 0 && onClick(activePag.current - 1)}
                      >
                        Previous
                      </Link>
                      <span className="d-flex">
                        {/* {paggination.map((number, i) => (
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
                    ))} */}
                      </span>

                      <Link
                        to="#"
                        className="paginate_button next disabled"
                        aria-controls="example5"
                        data-dt-idx={2}
                        tabIndex={0}
                        id="example5_next"
                        // onClick={() =>
                        //   activePag.current + 1 < paggination.length && onClick(activePag.current + 1)
                        // }
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <BedCreateAndUpdate
        refetch={fetchData}
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
      />
    </>
  );
};
export default BedListing;
