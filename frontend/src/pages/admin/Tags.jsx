import React from 'react';
import { useTags } from '../../hooks/useTags';
import Loader from '../../components/common/Loader';
import TagBadge from '../../components/tags/TagBadge';

const Tags = () => {
  const { tags, loading } = useTags();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Tags Management</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <TagBadge key={tag._id} tag={tag} />
        ))}
      </div>
      {/* Add create/edit/delete UI logic here */}
    </section>
  );
};

export default Tags;
