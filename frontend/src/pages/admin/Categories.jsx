import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import Loader from '../../components/common/Loader';
import CategoryBadge from '../../components/categories/CategoryBadge';

const Categories = () => {
  const { categories, loading } = useCategories();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryBadge key={cat._id} category={cat} />
        ))}
      </div>
      {/* Add create, edit, delete logic here to extend */}
    </section>
  );
};

export default Categories;
