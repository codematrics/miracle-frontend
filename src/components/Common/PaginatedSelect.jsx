import { useEffect, useState } from 'react';
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
  dependentFetch, // 👈 { key: 'floor', value: { value, label } }
  ...props
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [inputValue, setInputValue] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]); // 👈 use defaultOptions instead of options
  const [componentKey, setComponentKey] = useState(Date.now()); // 👈 force re-render

  const handleChange = selectedOption => {
    if (props?.isMulti) {
      setFieldValue(name, selectedOption || null);
    } else {
      setFieldValue(name, selectedOption || null);
    }
    if (selectCallback) selectCallback(selectedOption);
  };

  const value = field.value || (props?.isMulti ? [] : null);

  // 👇 Refetch when dependent value changes
  useEffect(() => {
    const fetchDependentOptions = async () => {
      if (dependentFetch?.key && dependentFetch?.value?.value) {
        const res = await loadOptions('', [], {
          [dependentFetch.key]: dependentFetch.value.value,
        });

        setDefaultOptions(res.options || []);
        handleChange(null); // reset current selection
      } else {
        setDefaultOptions([]);
      }

      // Force re-render to clear AsyncPaginate internal cache
      setComponentKey(Date.now());
    };

    fetchDependentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependentFetch?.value]);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <AsyncPaginate
        key={componentKey} // 👈 ensures re-render
        debounceTimeout={300}
        loadOptions={loadOptions}
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isClearable={isClearable}
        placeholder={placeholder}
        additional={{
          ...(dependentFetch?.value ? { [dependentFetch.key]: dependentFetch.value.value } : {}),
          page: 1,
        }}
        defaultOptions={defaultOptions}
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
