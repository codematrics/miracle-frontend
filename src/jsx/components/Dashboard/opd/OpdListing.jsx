import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import CommonTable from '../../../../components/Common/CommonTable';
import OPDApiService from '../../../../services/opdService';

const OPD = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    OPDApiService.getAll(pagination.page)
      .then(res => {
        setData(res?.data?.opd);
        setPagination({ page: res?.data?.page, total: res?.data?.total, limit: res?.data?.limit });
      })
      .finally(() => setLoading(false));
  };

  const columns = [
    {
      header: 'OPD No.',
      key: 'billId',
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
      render: item => item.consultantDoctor?.name || '',
    },

    {
      header: 'Net Amount',
      key: 'total',
      render: item => <span>{item.billing?.netAmount}</span>,
    },
    {
      header: 'Discount',
      key: 'discount',
      render: item => <span>{item.billing?.discount}</span>,
    },
    {
      header: 'Paid Amount',
      key: 'paidAmount',
    },
    {
      header: 'Actions',
      key: 'actions',
      render: item => (
        <div>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => navigate(`/edit-opd-bill/${item._id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => OPDApiService.print(item._id)}
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
          <h2 className="text-black font-w600">OPD Management</h2>
        </div>
        <div>
          <Button
            className="me-2"
            variant="primary btn-sm"
            onClick={() => navigate(`/create-opd-bill`)}
          >
            <i className="las la-calendar-plus scale5 me-2" /> Add OPD
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
      {/* <IPDCreateAndUpdate
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
        refetch={fetchData}
      /> */}
    </>
  );
};

export default OPD;
