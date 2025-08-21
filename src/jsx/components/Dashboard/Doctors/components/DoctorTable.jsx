import { Badge, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DoctorTable = ({
  doctors,
  loading,
  pagination,
  onEdit,
  onDelete,
  onStatusChange,
  onPageChange,
  currentPage,
}) => {
  const getStatusBadge = isActive => {
    return <Badge bg={isActive ? 'success' : 'danger'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
  };

  const getConsultantBadge = isConsultant => {
    return (
      <Badge bg={isConsultant ? 'primary' : 'secondary'}>
        {isConsultant ? 'Consultant' : 'Not Available'}
      </Badge>
    );
  };

  const formatAvailableDays = days => {
    if (!days || days.length === 0) return 'Not Set';
    return days.slice(0, 2).join(', ') + (days.length > 2 ? ` +${days.length - 2}` : '');
  };

  const formatTimings = timings => {
    if (!timings) return 'Not Set';
    const sessions = [];
    if (timings.morning?.startTime && timings.morning?.endTime) {
      sessions.push(`Morning: ${timings.morning.startTime}-${timings.morning.endTime}`);
    }
    if (timings.evening?.startTime && timings.evening?.endTime) {
      sessions.push(`Evening: ${timings.evening.startTime}-${timings.evening.endTime}`);
    }
    return sessions.length > 0 ? sessions.join(', ') : 'Not Set';
  };

  // Generate pagination array
  const paginationArray = Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1);

  return (
    <div className="card-table dataTables_wrapper no-footer">
      <div className="table-responsive">
        <table className="dataTable text-black">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Consultation Fee</th>
              <th>Available Days</th>
              <th>Timings</th>
              <th>Status</th>
              <th>Consultant</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  No doctors found
                </td>
              </tr>
            ) : (
              doctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>
                    <div>
                      <strong>{doctor.doctorName}</strong>
                      {doctor.qualification && (
                        <div className="text-muted small">{doctor.qualification}</div>
                      )}
                      {doctor.employeeId && (
                        <div className="text-muted small">ID: {doctor.employeeId}</div>
                      )}
                    </div>
                  </td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.department}</td>
                  <td>
                    <div>
                      {doctor.mobileNo && <div className="small">{doctor.mobileNo}</div>}
                      {doctor.email && <div className="small text-muted">{doctor.email}</div>}
                    </div>
                  </td>
                  <td>{doctor.consultationFee ? `₹${doctor.consultationFee}` : 'Free'}</td>
                  <td>
                    <small title={doctor.availableDays?.join(', ') || 'Not Set'}>
                      {formatAvailableDays(doctor.availableDays)}
                    </small>
                  </td>
                  <td>
                    <small title={formatTimings(doctor.consultationTimings)}>
                      {formatTimings(doctor.consultationTimings).length > 20
                        ? formatTimings(doctor.consultationTimings).substring(0, 20) + '...'
                        : formatTimings(doctor.consultationTimings)}
                    </small>
                  </td>
                  <td>{getStatusBadge(doctor.isActive)}</td>
                  <td>{getConsultantBadge(doctor.isConsultant)}</td>
                  <td className="text-end">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-primary"
                        size="sm"
                        id={`dropdown-${doctor.id}`}
                      >
                        Actions
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onEdit(doctor)}>
                          <i className="las la-edit me-2"></i>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onStatusChange(doctor.id, !doctor.isActive)}>
                          <i className={`las ${doctor.isActive ? 'la-ban' : 'la-check'} me-2`}></i>
                          {doctor.isActive ? 'Deactivate' : 'Activate'}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => onDelete(doctor.id)} className="text-danger">
                          <i className="las la-trash me-2"></i>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-sm-flex text-center justify-content-between align-items-center">
        <div className="dataTables_info">
          Showing {Math.min((currentPage - 1) * 10 + 1, pagination.total || 0)} to{' '}
          {Math.min(currentPage * 10, pagination.total || 0)} of {pagination.total || 0} entries
        </div>
        <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-center align-items-center pb-3">
          <Link
            to="#"
            className={`paginate_button previous ${!pagination.hasPrev ? 'disabled' : ''}`}
            onClick={e => {
              e.preventDefault();
              if (pagination.hasPrev) onPageChange(currentPage - 1);
            }}
          >
            Previous
          </Link>
          <span className="d-flex">
            {paginationArray.map(number => (
              <Link
                key={number}
                to="#"
                className={`paginate_button d-flex align-items-center justify-content-center ${
                  currentPage === number ? 'current' : ''
                } ${number > 1 ? 'ms-1' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  onPageChange(number);
                }}
              >
                {number}
              </Link>
            ))}
          </span>
          <Link
            to="#"
            className={`paginate_button next ${!pagination.hasNext ? 'disabled' : ''}`}
            onClick={e => {
              e.preventDefault();
              if (pagination.hasNext) onPageChange(currentPage + 1);
            }}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorTable;
