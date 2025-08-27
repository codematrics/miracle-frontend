import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Field, useFormikContext } from 'formik';

const CkEditorField = ({
  name,
  label,
  required = false,
  className = 'col-md-12',
  fieldClassName = '',
  style = { minHeight: '150px' },
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  // ✅ Helper to get nested error
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
              top: '10px',
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

  return (
    <div className={className}>
      <div className="form-group">
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>

        {renderWithErrorIcon(
          <Field name={name}>
            {() => (
              <div
                className={`border rounded bg-white p-2 ${fieldClassName} ${
                  hasError ? 'is-invalid' : ''
                }`}
                style={style}
              >
                <CKEditor
                  config={{
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                    },
                  }}
                  editor={ClassicEditor}
                  data={values[name] || ''}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFieldValue(name, data);
                  }}
                />
              </div>
            )}
          </Field>
        )}

        {hasError && (
          <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.875rem' }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CkEditorField;
