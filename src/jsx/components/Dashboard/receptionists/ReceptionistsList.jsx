import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import CommonTable from '../../../../components/Common/CommonTable';
import usersAPIService from '../../../../services/UsersService';
import ReceptionistCreateAndUpdate from './ReceptionistCreateAndUpdateModal';

const ReceptionistListing = () => {
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

  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    usersAPIService
      .getAll(pagination.page, 'Receptionist')
      .then(res => {
        setData(res?.data?.users || []);
        setPagination(prev => ({
          ...prev,
          page: res?.data?.page || prev.page,
          total: res?.data?.total || 0,
          limit: res?.data?.limit || prev.limit,
        }));
      })
      .finally(() => setLoading(false));
  };

  const setCreateOpen = status => {
    setBedModal({ open: status, data: null });
  };

  const setUpdateOpen = (status, data) => {
    setBedModal({ open: status, data });
  };

  const setClose = () => {
    setBedModal({ open: false, data: null });
  };

  const columns = [
    {
      header: 'Fist Name.',
      key: 'firstName',
    },
    {
      header: 'Last Name',
      key: 'lastName',
    },
    // {
    //   header: 'Mobile Number',
    //   key: 'mobileNumber',
    // },
    {
      header: 'Email',
      key: 'email',
    },
    {
      header: 'Password',
      key: 'password',
    },
    {
      header: 'Actions',
      key: 'actions',
      render: item => (
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={() => setUpdateOpen(true, item)}>
            Edit
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  console.log(data, 'data,');

  return (
    <>
      <div
        className="form-head align-items-center d-flex mb-sm-4 mb-3"
        style={{ minHeight: '100%' }}
      >
        <div className="me-auto">
          <h2 className="text-black font-w600">Receptionist Management</h2>
        </div>
        <div>
          <Button className="me-2" variant="primary btn-sm" onClick={() => setCreateOpen(true)}>
            Create Receptionist
          </Button>
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

      <ReceptionistCreateAndUpdate
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
        refetch={fetchData}
      />
    </>
  );
};

export default ReceptionistListing;
