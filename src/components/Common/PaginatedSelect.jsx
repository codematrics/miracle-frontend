import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

import { useField, useFormikContext } from 'formik';

const PaginatedSelect = ({
  name,
  label,
  loadOptions,
  placeholder = 'Select...',
  isClearable = true,
  required = false,
  className = '',
  selectCallback,
  ...props
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [inputValue, setInputValue] = useState('');

  // ✅ Always save the full option object
  const handleChange = selectedOption => {
    if (props?.isMulti) {
      setFieldValue(name, selectedOption?.map(s => s.value) || null);
    } else {
      setFieldValue(name, selectedOption?.value || null);
    }

    if (selectCallback) {
      selectCallback(selectedOption);
    }
  };

  // ✅ Return the same object back for controlled value

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <AsyncPaginate
        debounceTimeout={300}
        loadOptions={loadOptions}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isClearable={isClearable}
        placeholder={placeholder}
        {...props}
      />

      {meta.touched && meta.error && (
        <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default PaginatedSelect;
