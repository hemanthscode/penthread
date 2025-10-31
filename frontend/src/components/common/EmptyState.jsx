import { FileQuestion } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ icon: Icon = FileQuestion, title, message, action, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {message && <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{message}</p>}
      {action && onAction && (
        <Button onClick={onAction} variant="primary">
          {action}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
