import React from 'react';

const Input = React.forwardRef(({ label, type = 'text', error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        type={type}
        className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400
          ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <span className="mt-1 text-red-600 text-sm">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
