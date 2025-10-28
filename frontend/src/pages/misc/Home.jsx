import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';

const Home = () => {
  const { posts, loading, fetchPosts } = usePosts({ status: 'published' });

  useEffect(() => {
    fetchPosts({ status: 'published' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Blog Platform</h1>
      <p className="mb-8 text-lg text-gray-700">
        Discover amazing content from authors around the world.
      </p>

      {loading ? (
        <Loader />
      ) : posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">No published posts available.</p>
      )}

      <section className="mt-12 flex justify-center space-x-6">
        <Link
          to="/auth/login"
          className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className="px-6 py-3 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-100 transition"
        >
          Register
        </Link>
      </section>
    </main>
  );
};

export default Home;
