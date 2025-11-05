import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import interactionService from '../../services/interactionService';
import toast from 'react-hot-toast';

const FavoritedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFavoritedPosts();
  }, [currentPage]);

  const fetchFavoritedPosts = async () => {
    setLoading(true);
    try {
      const response = await interactionService.getFavoritedPosts({
        page: currentPage,
        limit: 9,
      });

      if (response.success) {
        setPosts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load favorited posts');
      console.error('Fetch favorited posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Saved Posts"
        description="Posts you've saved to favorites"
        icon={Bookmark}
      />

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved posts"
          message="Posts you save will appear here"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} onUpdate={fetchFavoritedPosts} />
              </motion.div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Container>
  );
};

export default FavoritedPosts;
