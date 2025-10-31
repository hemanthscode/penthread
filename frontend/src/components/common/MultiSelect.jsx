import { useState } from 'react';
import { X } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import useClickOutside from '../../hooks/useClickOutside';

const MultiSelect = ({ label, options = [], selected = [], onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useClickOutside(() => setIsOpen(false));

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));
  const availableOptions = options.filter(
    (opt) =>
      !selected.includes(opt.value) &&
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setSearchQuery('');
  };

  const handleRemove = (value) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(true)}
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 cursor-text"
      >
        {/* Selected Items */}
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.value);
                }}
                className="ml-1 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Search Input */}
          {isOpen && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedOptions.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-gray-100"
              autoFocus
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && availableOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {availableOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
