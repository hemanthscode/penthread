// src/components/common/Card.jsx
import { motion } from 'framer-motion';
import { classNames } from '../../utils/helpers';

const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // If hover is true, use motion.div, otherwise use regular div
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        onClick={onClick}
        className={classNames(
          'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
          paddings[padding],
          'cursor-pointer transition-shadow hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={classNames(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
