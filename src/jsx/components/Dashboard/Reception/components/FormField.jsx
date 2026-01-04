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

  // ✅ Helper to safely get nested errors
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

      case 'radio':
        return renderWithErrorIcon(
          <div>
            {options.map((option, index) => (
              <div key={index} className="form-check form-check-inline text-black">
                <Field
                  type="radio"
                  name={name}
                  value={typeof option === 'string' ? option : option.value}
                  className={`form-check-input ${fieldClassName}`}
                  id={`${name}-${index}`}
                />
                <label className="form-check-label" htmlFor={`${name}-${index}`}>
                  {typeof option === 'string' ? option : option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return renderWithErrorIcon(
          <div className="form-check text-black">
            <Field
              type="checkbox"
              name={name}
              id={name}
              className={`form-check-input ${fieldClassName}`}
              {...props}
            />
            <label className="form-check-label" htmlFor={name}>
              {label}
            </label>
          </div>
        );

      case 'textarea':
        return renderWithErrorIcon(
          <Field
            as="textarea"
            name={name}
            placeholder={placeholder}
            className={`form-control text-black ${fieldClassName}`}
            style={{ ...style, minHeight: '80px' }}
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
        {/* ✅ Don’t render external label for single checkbox, it has its own inline label */}
        {!(type === 'checkbox') && label && (
          <label className="text-black">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}

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
