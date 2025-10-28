import React from 'react';

const CategoryBadge = ({ category }) => {
  if (!category) return null;

  return (
    <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
      {category.name}
    </span>
  );
};

export default CategoryBadge;
