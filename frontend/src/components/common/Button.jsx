import React from 'react';

const Button = ({ children, type = 'button', onClick, disabled, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    disabled: 'opacity-50 cursor-not-allowed',
  };

  const appliedClass = disabled ? variants.disabled : variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${appliedClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
