import { Form } from 'react-bootstrap';

const ConsultationTimingForm = ({ timings, onTimingsChange, errors = {} }) => {
  const handleTimingChange = (session, field, value) => {
    onTimingsChange({
      ...timings,
      [session]: {
        ...timings[session],
        [field]: value,
      },
    });
  };

  const handleTimeValidation = (session, field, value) => {
    handleTimingChange(session, field, value);

    // Validate time ranges
    const currentSession = { ...timings[session], [field]: value };
    if (currentSession.startTime && currentSession.endTime) {
      if (currentSession.startTime >= currentSession.endTime) {
        // Handle validation error
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h6 className="text-black font-w600 mb-3">Consultation Timings</h6>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="text-black font-w500 mb-3">Morning Session</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-black font-w500">Start Time</label>
                  <Form.Control
                    type="time"
                    value={timings.morning?.startTime || ''}
                    onChange={e => handleTimeValidation('morning', 'startTime', e.target.value)}
                    style={{ height: '40px' }}
                    isInvalid={!!errors.morningStartTime}
                  />
                  {errors.morningStartTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.morningStartTime}
                    </Form.Control.Feedback>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-black font-w500">End Time</label>
                  <Form.Control
                    type="time"
                    value={timings.morning?.endTime || ''}
                    onChange={e => handleTimeValidation('morning', 'endTime', e.target.value)}
                    style={{ height: '40px' }}
                    isInvalid={!!errors.morningEndTime}
                  />
                  {errors.morningEndTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.morningEndTime}
                    </Form.Control.Feedback>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="text-black font-w500 mb-3">Evening Session</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-black font-w500">Start Time</label>
                  <Form.Control
                    type="time"
                    value={timings.evening?.startTime || ''}
                    onChange={e => handleTimeValidation('evening', 'startTime', e.target.value)}
                    style={{ height: '40px' }}
                    isInvalid={!!errors.eveningStartTime}
                  />
                  {errors.eveningStartTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.eveningStartTime}
                    </Form.Control.Feedback>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-black font-w500">End Time</label>
                  <Form.Control
                    type="time"
                    value={timings.evening?.endTime || ''}
                    onChange={e => handleTimeValidation('evening', 'endTime', e.target.value)}
                    style={{ height: '40px' }}
                    isInvalid={!!errors.eveningEndTime}
                  />
                  {errors.eveningEndTime && (
                    <Form.Control.Feedback type="invalid">
                      {errors.eveningEndTime}
                    </Form.Control.Feedback>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultationTimingForm;
