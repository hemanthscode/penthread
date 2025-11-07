import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Bookmark,
  Share2,
  Edit,
  Trash2,
  Calendar,
  Eye,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks';
import Container from '../../components/layout/Container';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import CommentSection from '../../components/posts/CommentSection';
import postService from '../../services/postService';
import interactionService from '../../services/interactionService';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPost();
    recordView();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await postService.getPost(id);
      if (response.success) setPost(response.data);
    } catch {
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await interactionService.recordView(id);
    } catch {
      // silent fail
    }
  };

  // Check if current user is the post author
  const isPostAuthor = post?.author?.id === user?.id || post?.author?._id === user?.id;
  const canEdit = isAuthenticated && (isPostAuthor || isAdmin());
  const canDelete = canEdit;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }
    setActionLoading('like');
    const previousState = { ...post };
    const wasLiked = post.userInteractions?.liked;
    setPost((prev) => ({
      ...prev,
      userInteractions: { ...prev.userInteractions, liked: !wasLiked },
      likesCount: wasLiked ? prev.likesCount - 1 : prev.likesCount + 1,
    }));

    try {
      const response = await interactionService.toggleLike(id);
      if (response.success) {
        setPost((prev) => ({
          ...prev,
          userInteractions: { ...prev.userInteractions, liked: response.data.liked },
        }));
      }
    } catch {
      setPost(previousState);
      toast.error('Failed to update like');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save posts');
      return;
    }
    setActionLoading('favorite');
    const previousState = { ...post };
    const wasFavorited = post.userInteractions?.favorited;
    setPost((prev) => ({
      ...prev,
      userInteractions: { ...prev.userInteractions, favorited: !wasFavorited },
      favoritesCount: wasFavorited ? prev.favoritesCount - 1 : prev.favoritesCount + 1,
    }));

    try {
      const response = await interactionService.toggleFavorite(id);
      if (response.success) {
        setPost((prev) => ({
          ...prev,
          userInteractions: { ...prev.userInteractions, favorited: response.data.favorited },
        }));
      }
    } catch {
      setPost(previousState);
      toast.error('Failed to update favorite');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {
        // no-op
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await postService.deletePost(id);
      if (response.success) {
        toast.success('Post deleted successfully');
        navigate(ROUTES.POSTS);
      }
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!post) {
    return (
      <Container className="py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Post not found</h2>
        <Button onClick={() => navigate(ROUTES.POSTS)} className="mt-4">
          Back to Posts
        </Button>
      </Container>
    );
  }

  const isLiked = post.userInteractions?.liked || false;
  const isFavorited = post.userInteractions?.favorited || false;

  return (
    <Container size="default" className="py-8">
      <Breadcrumbs items={[{ name: 'Posts', path: ROUTES.POSTS }, { name: post.title }]} />

      <Button
        variant="ghost"
        size="sm"
        icon={ArrowLeft}
        onClick={() => navigate(ROUTES.POSTS)}
        className="mb-6"
      >
        Back to Posts
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-8">
              {post.categories?.map((category) => (
                <Badge key={category._id} variant="primary">{category.name}</Badge>
              ))}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{post.title}</h1>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Avatar name={post.author?.name} size="lg" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{post.author?.name}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />{formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" icon={Edit} onClick={() => navigate(ROUTES.EDIT_POST.replace(':id', post._id))}>Edit</Button>
                    {canDelete && <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDeleteModal(true)}>Delete</Button>}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />{post.viewsCount || 0} views
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />{post.likesCount || 0} likes
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />{post.commentsCount || 0} comments
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

              {post.tags?.map(tag => <Badge key={tag._id} variant="default">#{tag.name}</Badge>)}

              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant={isLiked ? 'primary' : 'outline'} size="sm" icon={Heart} onClick={handleLike} loading={actionLoading === 'like'} disabled={actionLoading === 'like'}>
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant={isFavorited ? 'primary' : 'outline'} size="sm" icon={Bookmark} onClick={handleFavorite} loading={actionLoading === 'favorite'} disabled={actionLoading === 'favorite'}>
                  {isFavorited ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" icon={Share2} onClick={handleShare}>Share</Button>
              </div>
            </div>
          </motion.article>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
            {/* Pass post author ID and user for comparison */}
            <CommentSection 
              postId={id} 
              postAuthorId={post.author?.id || post.author?._id}
              showModeration={isAdmin() || isPostAuthor} 
            />
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About the Author</h3>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar name={post.author?.name} size="lg" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{post.author?.name}</p>
                  <Badge variant="primary" size="sm" className="capitalize">{post.author?.role}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{post.author?.bio || 'No bio available'}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Post" footer={
        <>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </>
      }>
        <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete this post? This action cannot be undone.</p>
      </Modal>
    </Container>
  );
};

export default PostDetail;