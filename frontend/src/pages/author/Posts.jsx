import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import Loader from '../../components/common/Loader';
import PostList from '../../components/posts/PostList';

const Posts = () => {
  const { posts, loading } = usePosts();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      <PostList posts={posts} loading={loading} />
    </section>
  );
};

export default Posts;
