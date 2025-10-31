import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      disabled = false,
      required = false,
      icon: Icon,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={classNames('w-full', className)}>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={classNames(
              'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200',
              Icon && 'pl-10',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
              disabled && 'bg-gray-100 cursor-not-allowed dark:bg-gray-800',
              'dark:bg-gray-800 dark:text-gray-100'
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
