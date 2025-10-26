import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

import CommonTable from '../../../../components/Common/CommonTable';
import wardAPIService from '../../../../services/WardService';
import WardCreateAndUpdate from './WardCreateAndUpdate';

const WardListing = () => {
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
    wardAPIService
      .getAll()
      .then(res => {
        setData(res?.data?.wards);
        const totalPages = Math.ceil(res?.data?.total / res?.data?.limit);
        setPagination({ current: res?.data?.page, total: totalPages });
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = id => {
    wardAPIService
      .delete(id)
      .then(response => {
        console.log('ward deleted successfully:', response);
        // Refresh the ward list after deletion
        wardAPIService.getAll().then(res => {
          setData(res?.data?.wards);
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

  const columns = [
    {
      header: 'Ward Name',
      key: 'name',
      render: item => item.name || '',
    },
    {
      header: 'Status',
      key: 'status',
    },
    {
      header: 'Floor',
      key: 'floor',
      render: item => item.floor?.name || '',
    },
    {
      header: 'Actions',
      key: 'actions',
      render: item => (
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={() => setUpdateOpen(true, item)}>
            Edit
          </button>
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleDelete(item._id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

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
          <h2 className="text-black font-w600">Wards Management</h2>
        </div>
        <div>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="me-2" variant="primary" size="sm">
                <i className="fa fa-plus color-info" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item to="" onClick={() => setCreateOpen(true)}>
                  Ward
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
        <CommonTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={page => setPagination(prev => ({ ...prev, page }))}
        />
      </div>

      <WardCreateAndUpdate
        refetch={fetchData}
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
      />
    </>
  );
};
export default WardListing;
