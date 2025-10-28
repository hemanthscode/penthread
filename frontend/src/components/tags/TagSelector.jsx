import React from 'react';

const TagSelector = ({ tags, selected = [], onChange }) => {
  const toggleTag = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((tagId) => tagId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <button
          key={tag._id}
          className={`px-3 py-1 rounded-full border ${
            selected.includes(tag._id)
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}
          type="button"
          onClick={() => toggleTag(tag._id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
