import React from 'react';

const CategorySelector = ({ categories, selected = [], onChange }) => {
  const toggleCategory = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((catId) => catId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`px-3 py-1 rounded-full border ${
            selected.includes(cat._id)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}
          type="button"
          onClick={() => toggleCategory(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
