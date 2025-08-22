import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

const VisitFilterModal = ({ show, onHide, onSubmit, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    mobileNo: '',
    uhid: '',
    patientName: '',
    status: '',
    doctorName: '',
  });

  // Initialize filters when modal opens
  useEffect(() => {
    if (show) {
      setFilters({
        fromDate: initialFilters.from || '',
        toDate: initialFilters.to || '',
        mobileNo: initialFilters.mobileNo || '',
        uhid: initialFilters.uhid || '',
        patientName: initialFilters.patientName || '',
        status: initialFilters.status || '',
        doctorName: initialFilters.doctorName || '',
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
    if (filters.uhid) filterParams.uhid = filters.uhid;
    if (filters.patientName) filterParams.patientName = filters.patientName;
    if (filters.status) filterParams.status = filters.status;
    if (filters.doctorName) filterParams.doctorName = filters.doctorName;

    onSubmit(filterParams);
    onHide();
  };

  const handleClear = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      mobileNo: '',
      uhid: '',
      patientName: '',
      status: '',
      doctorName: '',
    });
    onSubmit({});
    onHide();
  };

  return (
    <Modal className="fade" show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Visit Filters</Modal.Title>
        <Button
          variant=""
          className="btn-close"
          onClick={onHide}
        ></Button>
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
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
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
                onChange={(e) => handleInputChange('toDate', e.target.value)}
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
                onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                placeholder="Enter mobile number"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">UHID</label>
              <input
                type="text"
                id="uhid"
                name="uhid"
                value={filters.uhid}
                onChange={(e) => handleInputChange('uhid', e.target.value)}
                placeholder="Enter UHID"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Patient Name</label>
              <input
                type="text"
                id="patientname"
                name="patientname"
                value={filters.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                placeholder="Enter patient name"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="text-black font-w500">Doctor Name</label>
              <input
                type="text"
                id="doctorname"
                name="doctorname"
                value={filters.doctorName}
                onChange={(e) => handleInputChange('doctorName', e.target.value)}
                placeholder="Enter doctor name"
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="text-black font-w500">Visit Status</label>
              <select
                className="form-control text-black"
                style={{ height: '35px' }}
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
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

export default VisitFilterModal;