import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

import CommonTable from '../../../../components/Common/CommonTable';
import bedAPIService from '../../../../services/BedService';
import BedCreateAndUpdate from './BedCreateAndUpdate';

const BedListing = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
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
      .getAll(pagination.page)
      .then(res => {
        setData(res?.data?.beds);
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
    bedAPIService
      .delete(id)
      .then(response => {
        console.log('Bed deleted successfully:', response);
        // Refresh the bed list after deletion
        bedAPIService.getAll(pagination.page).then(res => {
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
      header: 'Bed Number',
      key: 'name',
      render: item => item.bedNumber || '',
    },
    {
      header: 'Ward',
      key: 'ward',
      render: item => item.ward?.name || '',
    },
    {
      header: 'Floor',
      key: 'floor',
      render: item => item.ward?.name || '',
    },
    {
      header: 'Status',
      key: 'floor',
      render: item => item.ward?.floor?.name || '',
    },
    {
      header: 'Patient',
      key: 'floor',
      render: item => item.patientId?.name || '-',
    },
    {
      header: 'Actions',
      key: 'actions',
      render: item => (
        <>
          <Button onClick={() => setUpdateOpen(true, item)}>Edit</Button>
          <Button onClick={() => handleDelete(item._id)}>Delete</Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

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
        <CommonTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={page => setPagination(prev => ({ ...prev, page }))}
        />
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
