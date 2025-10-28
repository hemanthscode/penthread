import React from 'react';

const TagBadge = ({ tag }) => {
  if (!tag) return null;

  return (
    <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
      {tag.name}
    </span>
  );
};

export default TagBadge;
