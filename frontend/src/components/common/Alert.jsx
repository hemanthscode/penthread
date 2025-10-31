import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: Info,
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={classNames(
          'flex items-start p-4 rounded-lg border',
          config.bg,
          config.border,
          className
        )}
      >
        <Icon className={classNames('h-5 w-5 mt-0.5 flex-shrink-0', config.text)} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={classNames('text-sm font-medium', config.text)}>{title}</h3>
          )}
          {message && (
            <p className={classNames('text-sm mt-1', config.text)}>{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={classNames('ml-3 flex-shrink-0', config.text, 'hover:opacity-70')}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
