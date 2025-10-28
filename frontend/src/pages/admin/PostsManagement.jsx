import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import Loader from '../../components/common/Loader';
import PostList from '../../components/posts/PostList';

const PostsManagement = () => {
  const { posts, loading } = usePosts();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Posts Management</h1>
      <PostList posts={posts} loading={loading} />
    </section>
  );
};

export default PostsManagement;
