import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Field, useFormikContext } from 'formik';

const FormField = ({
  name,
  label,
  type = 'text',
  required = false,
  placeholder = '',
  maxLength,
  options = [],
  className = 'col-md-4',
  fieldClassName = '',
  style = { height: '40px', fontSize: '16px' },
  hideEmptyOption = false,
  ...props
}) => {
  const { errors, touched } = useFormikContext();

  // ✅ Helper to safely get nested errors (e.g. address.city)
  const getError = fieldName => {
    const keys = fieldName.split('.');
    let error = errors;
    let touch = touched;

    for (const key of keys) {
      error = error?.[key];
      touch = touch?.[key];
    }

    return { hasError: !!(error && touch), errorMessage: error };
  };

  const { hasError, errorMessage } = getError(name);

  const renderWithErrorIcon = fieldElement => {
    if (!hasError) return fieldElement;

    return (
      <div className="position-relative">
        {fieldElement}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${name}`}>{errorMessage}</Tooltip>}
        >
          <span
            className="position-absolute"
            style={{
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#dc3545',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            ⓘ
          </span>
        </OverlayTrigger>
      </div>
    );
  };

  const renderField = () => {
    switch (type) {
      case 'select':
        return renderWithErrorIcon(
          <Field
            as="select"
            name={name}
            className={`form-control text-black ${fieldClassName}`}
            style={style}
            {...props}
          >
            {!hideEmptyOption && <option value="">Select {label}</option>}
            {options.map((option, index) => (
              <option key={index} value={typeof option === 'string' ? option : option.value}>
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </Field>
        );

      case 'radio': {
        const radioElement = (
          <div className="form-control" style={style}>
            {options.map((option, index) => (
              <div key={index} className="form-check custom-checkbox form-check-inline text-black">
                <Field
                  type="radio"
                  name={name}
                  value={typeof option === 'string' ? option : option.value}
                  className="form-check-input"
                  id={`${name}-${index}`}
                />
                <label className="form-check-label" htmlFor={`${name}-${index}`}>
                  {typeof option === 'string' ? option : option.label}
                </label>
              </div>
            ))}
          </div>
        );

        return renderWithErrorIcon(radioElement);
      }

      case 'textarea':
        return renderWithErrorIcon(
          <Field
            as="textarea"
            name={name}
            placeholder={placeholder}
            className={`form-control text-black ${fieldClassName}`}
            style={style}
            maxLength={maxLength}
            {...props}
          />
        );

      default:
        return renderWithErrorIcon(
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`form-control text-black ${fieldClassName}`}
            style={style}
            maxLength={maxLength}
            {...props}
          />
        );
    }
  };

  return (
    <div className={className}>
      <div className="form-group">
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {renderField()}

        {hasError && (
          <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.875rem' }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;
