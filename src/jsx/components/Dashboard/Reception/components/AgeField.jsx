import { Field, useFormikContext } from "formik";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AgeField = ({
  name = "age",
  unitName = "ageUnit",
  label = "Age",
  required = true,
  className = "",
  ageOptions = [
    { value: "Year", label: "Year" },
    { value: "Month", label: "Month" },
    { value: "Day", label: "Day" },
  ],
}) => {
  const { errors, touched } = useFormikContext();
  const hasError = errors[name] && touched[name];
  const errorMessage = errors[name];

  const ageInput = (
    <div className="d-flex">
      <Field
        name={name}
        type="number"
        className={`form-control text-black `}
        style={{ height: "40px", width: "40%" }}
        min="0"
        max="150"
      />
      <Field
        as="select"
        name={unitName}
        className="form-control text-black"
        style={{ height: "40px", width: "60%" }}
      >
        {ageOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    </div>
  );

  return (
    <div className={className}>
      <div className="form-group">
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {hasError ? (
          <div className="position-relative">
            {ageInput}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{errorMessage}</Tooltip>}
            >
              <span
                className="position-absolute"
                style={{
                  right: "60%",
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
          ageInput
        )}
      </div>
    </div>
  );
};

export default AgeField;
