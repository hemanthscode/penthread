import { classNames, getInitials } from '../../utils/helpers';

const Avatar = ({ src, alt, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={classNames('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  const initials = getInitials(name || 'User');

  return (
    <div
      className={classNames(
        'rounded-full bg-primary-600 text-white font-medium flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
