import { motion } from 'framer-motion';
import Button from '../common/Button';

const PageHeader = ({ title, description, action, onAction, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          </div>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {action && onAction && (
          <Button onClick={onAction} variant="primary">
            {action}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
