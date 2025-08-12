import React from 'react';

const FormRow = ({ children, className = "row" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default FormRow;