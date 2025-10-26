import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

import CommonTable from '../../../../components/Common/CommonTable';
import floorAPIService from '../../../../services/FloorService';
import FloorCreateAndUpdate from './FloorCreateAndUpdate';

const FloorListing = () => {
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
    floorAPIService
      .getAll()
      .then(res => {
        setData(res?.data?.floors);
        setPagination(prev => ({
          ...prev,
          page: res?.data?.page || prev.page,
          total: res?.data?.total || 0,
          limit: res?.data?.limit || prev.limit,
        }));
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = id => {
    floorAPIService
      .delete(id)
      .then(response => {
        console.log('Floor deleted successfully:', response);
        // Refresh the bed list after deletion
        floorAPIService.getAll().then(res => {
          setData(res?.data?.beds);
          setPagination(prev => ({
            ...prev,
            page: res?.data?.page || prev.page,
            total: res?.data?.total || 0,
            limit: res?.data?.limit || prev.limit,
          }));
        });
      })
      .catch(error => {
        console.error('Error deleting floor:', error);
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
      header: 'Floor Name',
      key: 'name',
      render: item => item.name || '',
    },
    {
      header: 'Status',
      key: 'status',
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
          <h2 className="text-black font-w600">Floors Management</h2>
        </div>
        <div>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="me-2" variant="primary" size="sm">
                <i className="fa fa-plus color-info" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item to="" onClick={() => setCreateOpen(true)}>
                  Floor
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
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

      <FloorCreateAndUpdate
        refetch={fetchData}
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
      />
    </>
  );
};
export default FloorListing;
