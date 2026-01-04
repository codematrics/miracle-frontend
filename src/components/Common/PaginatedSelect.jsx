import { useEffect, useRef, useState } from 'react';
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
  dependentFetch,
  ...props
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [inputValue, setInputValue] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [componentKey, setComponentKey] = useState(Date.now());

  const prevDependentValue = useRef(null);

  const handleChange = option => {
    setFieldValue(name, option || null);
    selectCallback?.(option);
  };

  const value = field.value || null;

  // ✅ Runs ONLY when serviceHead actually changes
  useEffect(() => {
    if (prevDependentValue.current === dependentFetch?.value) return;

    prevDependentValue.current = dependentFetch?.value;

    const fetchOptions = async () => {
      if (dependentFetch?.key && dependentFetch?.value) {
        const res = await loadOptions('', [], {
          [dependentFetch.key]: dependentFetch.value,
          page: 1,
        });

        setDefaultOptions(res?.options || []);
      } else {
        setDefaultOptions([]);
      }

      // ✅ reset serviceType when serviceHead changes
      setFieldValue(name, null);

      // ✅ clear AsyncPaginate internal cache
      setComponentKey(Date.now());
    };

    fetchOptions();
  }, [dependentFetch?.value, loadOptions, name, setFieldValue]);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <AsyncPaginate
        key={componentKey}
        loadOptions={loadOptions}
        debounceTimeout={300}
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isClearable={isClearable}
        placeholder={placeholder}
        additional={{
          ...(dependentFetch?.value ? { [dependentFetch.key]: dependentFetch.value } : {}),
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
