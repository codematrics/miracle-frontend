import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import CommonTable from '../../../../components/Common/CommonTable';
import IPDApiService from '../../../../services/ipdService';
import IPDCreateAndUpdate from './IPDCreateAndUpdate';

const IPD = () => {
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
    IPDApiService.getAll(pagination.page)
      .then(res => {
        setData(res?.data?.ipd);
        setPagination({ page: res?.data?.page, total: res?.data?.total, limit: res?.data?.limit });
      })
      .finally(() => setLoading(false));
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
      header: 'IPD No.',
      key: 'billNumber',
    },
    {
      header: 'Patient No.',
      key: 'patient.patientId',
      render: item => item.patient?.uhidNo || '',
    },
    {
      header: 'Patient Name',
      key: 'patientName',
      render: item => item.patient?.name || '',
    },
    {
      header: 'Doctor Name',
      key: 'doctorName',
      render: item => item.referringDoctor?.name || '',
    },
    {
      header: 'Bed Ward',
      key: 'bed',
      render: item => item.bed?.ward?.name || '',
    },
    {
      header: 'Ward Type',
      key: 'bed',
      render: item => item.bed?.ward?.type || '',
    },
    {
      header: 'Bed No',
      key: 'bed',
      render: item => item.bed?.bedNumber || '',
    },

    {
      header: 'Status',
      key: 'patientStatus',
      render: item => <span>{item.patientStatus || 'Unknown'}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: item => (
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={() => setUpdateOpen(true, item)}>
            Edit
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => IPDApiService.print(item._id)}
          >
            Print
          </button>
        </div>
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
          <h2 className="text-black font-w600">IPD Management</h2>
        </div>
        <div>
          <Button className="me-2" variant="primary btn-sm" onClick={() => setCreateOpen(true)}>
            <i className="las la-calendar-plus scale5 me-2" /> Add IPD
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
      <IPDCreateAndUpdate
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
        refetch={fetchData}
      />
    </>
  );
};

export default IPD;
