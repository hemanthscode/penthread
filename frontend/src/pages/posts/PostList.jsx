import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, FileText } from 'lucide-react';
import { useAuth } from '../../hooks';
import useCategories from '../../hooks/useCategories';
import useTags from '../../hooks/useTags';
import useDebounce from '../../hooks/useDebounce';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import PostCard from '../../components/posts/PostCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import postService from '../../services/postService';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const PostList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isAuthor, isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { categories } = useCategories();
  const { tags } = useTags();

  useEffect(() => {
    fetchPosts();
  }, [debouncedSearch, selectedCategory, selectedTag, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedTag) params.tagId = selectedTag;

      const response = await postService.getPublicPosts(params);
      
      if (response.success) {
        setPosts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }

      // Update URL params
      const newParams = new URLSearchParams();
      if (debouncedSearch) newParams.set('search', debouncedSearch);
      if (selectedCategory) newParams.set('category', selectedCategory);
      if (selectedTag) newParams.set('tag', selectedTag);
      if (currentPage > 1) newParams.set('page', currentPage.toString());
      setSearchParams(newParams);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

  const tagOptions = [
    { value: '', label: 'All Tags' },
    ...tags.map((tag) => ({ value: tag._id, label: tag.name })),
  ];

  const canCreatePost = isAuthenticated && (isAuthor() || isAdmin());

  return (
    <Container className="py-8">
      <PageHeader
        title="Explore Posts"
        description="Discover amazing stories from our community"
        icon={FileText}
        action={canCreatePost ? 'Create Post' : null}
        onAction={canCreatePost ? () => navigate(ROUTES.CREATE_POST) : null}
      />

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <Select
              label="Category"
              name="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              options={categoryOptions}
            />
            <Select
              label="Tag"
              name="tag"
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setCurrentPage(1);
              }}
              options={tagOptions}
            />
            <div className="md:col-span-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Posts Grid */}
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts found"
          message="Try adjusting your search or filters"
          action={canCreatePost ? 'Create First Post' : null}
          onAction={canCreatePost ? () => navigate(ROUTES.CREATE_POST) : null}
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
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
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

export default PostList;
