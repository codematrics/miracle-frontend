import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import CommonTable from '../../../../components/Common/CommonTable';
import appointmentAPIService from '../../../../services/AppointmentService';
import AppointmentCreateAndUpdate from './AppointmentCreateAndUpdate';

const AppointmentListing = () => {
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
    appointmentAPIService
      .getAll(pagination.page)
      .then(res => {
        setData(res?.data?.appointments || []);
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
      header: 'Patient No.',
      key: 'patient.patientId',
      render: item => (
        <span
          style={{ cursor: 'pointer', color: '#007bff' }}
          onClick={() => navigate(`/patient-details/${item.patient?.uhidNo}`)}
        >
          {item.patient?.uhidNo || ''}
        </span>
      ),
    },
    {
      header: 'Patient Name',
      key: 'patientName',
      render: item => item.patient?.name || '',
    },
    {
      header: 'Doctor Name',
      key: 'doctorName',
      render: item => item.doctor?.name || '',
    },
    {
      header: 'Appointment Date',
      key: 'appointmentDate',
      render: item => item.appointmentDate || '',
    },
    {
      header: 'Status',
      key: 'status',
      render: item => <span>{item.status || 'Unknown'}</span>,
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

  return (
    <>
      <div
        className="form-head align-items-center d-flex mb-sm-4 mb-3"
        style={{ minHeight: '100%' }}
      >
        <div className="me-auto">
          <h2 className="text-black font-w600">Appointment Management</h2>
        </div>
        <div>
          <Button className="me-2" variant="primary btn-sm" onClick={() => setCreateOpen(true)}>
            <i className="las la-calendar-plus scale5 me-2" /> Appointment
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

      <AppointmentCreateAndUpdate
        open={bedModal.open}
        data={bedModal.data}
        onClose={setClose}
        refetch={fetchData}
      />
    </>
  );
};

export default AppointmentListing;
