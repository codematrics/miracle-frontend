import { Button, Modal } from 'react-bootstrap';

const DateFilterModal = ({ show, onHide, onSubmit }) => {
  return (
    <Modal className="fade" show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Date Filter</Modal.Title>
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
                type="number"
                id="mobileno"
                name="mobileno"
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
                className="form-control text-black"
                style={{ height: '35px' }}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="dark btn-sm">
          Close
        </Button>
        <Button variant="primary btn-sm" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DateFilterModal;