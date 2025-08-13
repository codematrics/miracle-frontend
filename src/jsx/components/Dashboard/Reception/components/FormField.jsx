import { Field, useFormikContext } from "formik";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const FormField = ({
  name,
  label,
  type = "text",
  required = false,
  placeholder = "",
  maxLength,
  options = [],
  className = "col-md-4",
  fieldClassName = "",
  style = { height: "40px", fontSize: "16px" },
  ...props
}) => {
  const { errors, touched } = useFormikContext();

  // Get nested error for address fields
  const getError = (fieldName) => {
    if (fieldName.includes(".")) {
      const keys = fieldName.split(".");
      let error = errors;
      let touch = touched;

      for (const key of keys) {
        error = error?.[key];
        touch = touch?.[key];
      }

      return { hasError: error && touch, errorMessage: error };
    }

    return {
      hasError: errors[fieldName] && touched[fieldName],
      errorMessage: errors[fieldName],
    };
  };

  const renderField = () => {
    const { hasError, errorMessage } = getError(name);
    const errorClass = hasError ? "" : "";

    const renderFieldWithIcon = (fieldElement) => {
      if (!hasError) return fieldElement;

      return (
        <div className="position-relative">
          {fieldElement}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{errorMessage}</Tooltip>}
          >
            <span
              className="position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#dc3545",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              ⓘ
            </span>
          </OverlayTrigger>
        </div>
      );
    };

    switch (type) {
      case "select":
        return renderFieldWithIcon(
          <Field
            as="select"
            name={name}
            className={`form-control text-black ${errorClass} ${fieldClassName}`}
            style={style}
            {...props}
          >
            {options.map((option, index) => (
              <option
                key={index}
                value={typeof option === "string" ? option : option.value}
              >
                {typeof option === "string" ? option : option.label}
              </option>
            ))}
          </Field>
        );

      case "radio":
        const radioElement = (
          <div className={`form-control ${errorClass}`} style={style}>
            {options.map((option, index) => (
              <div
                key={index}
                className="form-check custom-checkbox form-check-inline text-black"
              >
                <Field
                  type="radio"
                  name={name}
                  value={typeof option === "string" ? option : option.value}
                  className="form-check-input"
                  id={`${name}-${index}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${name}-${index}`}
                >
                  {typeof option === "string" ? option : option.label}
                </label>
              </div>
            ))}
          </div>
        );

        return hasError ? (
          <div className="position-relative">
            {radioElement}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{errorMessage}</Tooltip>}
            >
              <span
                className="position-absolute"
                style={{
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#dc3545",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ⓘ
              </span>
            </OverlayTrigger>
          </div>
        ) : (
          radioElement
        );

      case "textarea":
        return renderFieldWithIcon(
          <Field
            as="textarea"
            name={name}
            placeholder={placeholder}
            className={`form-control text-black ${errorClass} ${fieldClassName}`}
            style={style}
            maxLength={maxLength}
            {...props}
          />
        );

      default:
        return renderFieldWithIcon(
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`form-control text-black ${errorClass} ${fieldClassName}`}
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
      </div>
    </div>
  );
};

export default FormField;
