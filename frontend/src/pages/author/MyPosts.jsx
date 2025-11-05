import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Eye, Edit, Trash2, MoreVertical, Upload, Download } from 'lucide-react';
import { useAuth } from '../../hooks';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';
import useDebounce from '../../hooks/useDebounce';
import postService from '../../services/postService';
import { ROUTES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchMyPosts();
  }, [debouncedSearch, statusFilter, currentPage]);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;

      const response = await postService.getMyPosts(params);
      if (response.success) {
        setPosts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (postId) => {
    setActionLoading(postId);
    try {
      const response = await postService.publishPost(postId);
      if (response.success) {
        toast.success('Post published successfully');
        fetchMyPosts();
      }
    } catch (error) {
      toast.error('Failed to publish post');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (postId) => {
    setActionLoading(postId);
    try {
      const response = await postService.unpublishPost(postId);
      if (response.success) {
        toast.success('Post unpublished successfully');
        fetchMyPosts();
      }
    } catch (error) {
      toast.error('Failed to unpublish post');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setActionLoading(selectedPost._id);
    try {
      const response = await postService.deletePost(selectedPost._id);
      if (response.success) {
        toast.success('Post deleted successfully');
        setShowDeleteModal(false);
        setSelectedPost(null);
        fetchMyPosts();
      }
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'default',
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      published: 'primary',
      unpublished: 'default',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'published', label: 'Published' },
    { value: 'unpublished', label: 'Unpublished' },
  ];

  const canPublish = (status) => ['draft', 'approved', 'unpublished'].includes(status);
  const canUnpublish = (status) => status === 'published';

  return (
    <Container className="py-8">
      <PageHeader
        title="My Posts"
        description="Manage your blog posts"
        icon={FileText}
        action="Create New Post"
        onAction={() => navigate(ROUTES.CREATE_POST)}
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
          <Select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Posts List */}
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          message="Start writing your first post"
          action="Create Post"
          onAction={() => navigate(ROUTES.CREATE_POST)}
        />
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        {getStatusBadge(post.status)}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.content?.substring(0, 150)}...
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{post.likesCount || 0} likes</span>
                        <span>•</span>
                        <span>{post.commentsCount || 0} comments</span>
                        <span>•</span>
                        <span>{post.viewsCount || 0} views</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => navigate(ROUTES.POST_DETAIL.replace(':id', post._id))}
                      >
                        View
                      </Button>

                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm" icon={MoreVertical}>
                            Actions
                          </Button>
                        }
                        align="right"
                      >
                        <DropdownItem
                          icon={Edit}
                          onClick={() => navigate(ROUTES.EDIT_POST.replace(':id', post._id))}
                        >
                          Edit Post
                        </DropdownItem>

                        {canPublish(post.status) && (
                          <DropdownItem
                            icon={Upload}
                            onClick={() => handlePublish(post._id)}
                            disabled={actionLoading === post._id}
                          >
                            Publish
                          </DropdownItem>
                        )}

                        {canUnpublish(post.status) && (
                          <DropdownItem
                            icon={Download}
                            onClick={() => handleUnpublish(post._id)}
                            disabled={actionLoading === post._id}
                          >
                            Unpublish
                          </DropdownItem>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                        <DropdownItem
                          icon={Trash2}
                          onClick={() => {
                            setSelectedPost(post);
                            setShowDeleteModal(true);
                          }}
                          danger
                        >
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </Card>
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

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPost(null);
        }}
        title="Delete Post"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedPost(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={actionLoading === selectedPost?._id}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>{selectedPost?.title}</strong>? This action
          cannot be undone.
        </p>
      </Modal>
    </Container>
  );
};

export default MyPosts;
