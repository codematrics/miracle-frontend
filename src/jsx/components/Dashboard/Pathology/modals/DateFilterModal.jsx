import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { ORDER_STATUS, REPORT_TYPE } from '../../../../../constants/enums';

const DateFilterModal = ({ show, onHide, onSubmit, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    mobileNo: '',
    patientId: '',
    patientName: '',
    reportType: '',
    status: '',
  });

  // Initialize filters when modal opens
  useEffect(() => {
    if (show) {
      setFilters({
        fromDate: initialFilters.from || '',
        toDate: initialFilters.to || '',
        mobileNo: initialFilters.mobileNo || '',
        patientId: initialFilters.uhid || '',
        patientName: initialFilters.patientName || '',
        reportType: initialFilters.reportType || '',
        status: initialFilters.status || '',
      });
    }
  }, [show, initialFilters]);

  const handleInputChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Convert form data to API format
    const filterParams = {};

    if (filters.fromDate) filterParams.from = filters.fromDate;
    if (filters.toDate) filterParams.to = filters.toDate;
    if (filters.mobileNo) filterParams.mobileNo = filters.mobileNo;
    if (filters.patientId) filterParams.uhid = filters.patientId;
    if (filters.patientName) filterParams.patientName = filters.patientName;
    if (filters.reportType) filterParams.reportType = filters.reportType;
    if (filters.status) filterParams.status = filters.status;

    onSubmit(filterParams);
    onHide();
  };

  const handleClear = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      mobileNo: '',
      patientId: '',
      patientName: '',
      reportType: '',
      status: '',
    });
    onSubmit({});
    onHide();
  };
  return (
    <Modal className="fade" show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Filter Options</Modal.Title>
        <Button variant="" className="btn-close" onClick={onHide}></Button>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">From Date</label>
              <input
                type="date"
                id="fromdate"
                name="fromdate"
                value={filters.fromDate}
                onChange={e => handleInputChange('fromDate', e.target.value)}
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">To Date</label>
              <input
                type="date"
                id="todate"
                name="todate"
                value={filters.toDate}
                onChange={e => handleInputChange('toDate', e.target.value)}
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Mobile No</label>
              <input
                type="text"
                id="mobileno"
                name="mobileno"
                value={filters.mobileNo}
                onChange={e => handleInputChange('mobileNo', e.target.value)}
                placeholder="Enter mobile number"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Patient ID</label>
              <input
                type="text"
                id="patientid"
                name="patientid"
                value={filters.patientId}
                onChange={e => handleInputChange('patientId', e.target.value)}
                placeholder="Enter UHID"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="text-black font-w500">Patient Name</label>
              <input
                type="text"
                id="patientname"
                name="patientname"
                value={filters.patientName}
                onChange={e => handleInputChange('patientName', e.target.value)}
                placeholder="Enter patient name"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Report Type</label>
              <select
                id="reporttype"
                name="reporttype"
                value={filters.reportType}
                onChange={e => handleInputChange('reportType', e.target.value)}
                className="form-control text-black"
                style={{ height: '35px' }}
              >
                <option value="">All Report Types</option>
                {Object.entries(REPORT_TYPE).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={e => handleInputChange('status', e.target.value)}
                className="form-control text-black"
                style={{ height: '35px' }}
              >
                <option value="">All Status</option>
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="dark btn-sm">
          Close
        </Button>
        <Button onClick={handleClear} variant="outline-secondary btn-sm" className="me-2">
          Clear Filters
        </Button>
        <Button variant="primary btn-sm" onClick={handleSubmit}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DateFilterModal;
