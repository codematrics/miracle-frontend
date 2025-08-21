import { Form } from 'react-bootstrap';

const AddressForm = ({ address, onAddressChange, errors = {} }) => {
  const handleChange = (field, value) => {
    onAddressChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="text-black font-w500">Street Address</label>
            <Form.Control
              type="text"
              value={address.street || ''}
              onChange={e => handleChange('street', e.target.value)}
              placeholder="Enter street address"
              style={{ height: '40px' }}
              isInvalid={!!errors.street}
            />
            {errors.street && (
              <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-black font-w500">City</label>
            <Form.Control
              type="text"
              value={address.city || ''}
              onChange={e => handleChange('city', e.target.value)}
              placeholder="Enter city"
              style={{ height: '40px' }}
              isInvalid={!!errors.city}
            />
            {errors.city && (
              <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="text-black font-w500">State</label>
            <Form.Select
              value={address.state || ''}
              onChange={e => handleChange('state', e.target.value)}
              style={{ height: '40px' }}
              isInvalid={!!errors.state}
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Delhi">Delhi</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Other">Other</option>
            </Form.Select>
            {errors.state && (
              <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="text-black font-w500">Pincode</label>
            <Form.Control
              type="text"
              value={address.pincode || ''}
              onChange={e => handleChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              style={{ height: '40px' }}
              maxLength={6}
              isInvalid={!!errors.pincode}
            />
            {errors.pincode && (
              <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="text-black font-w500">Country</label>
            <Form.Select
              value={address.country || 'India'}
              onChange={e => handleChange('country', e.target.value)}
              style={{ height: '40px' }}
              isInvalid={!!errors.country}
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </Form.Select>
            {errors.country && (
              <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressForm;
