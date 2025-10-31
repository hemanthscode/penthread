import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Save, Eye } from 'lucide-react';
import { useAuth } from '../../hooks';
import usePost from '../../hooks/usePost';
import usePostStore from '../../store/usePostStore';
import useCategories from '../../hooks/useCategories';
import useTags from '../../hooks/useTags';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import PostForm from '../../components/posts/PostForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { post, loading: postLoading } = usePost(id);
  const { updatePost } = usePostStore();
  const { categories, loading: categoriesLoading } = useCategories();
  const { tags, loading: tagsLoading } = useTags();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [],
    tags: [],
    status: 'draft',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (post) {
      // Check permissions
      const isAuthor = post.author?._id === user?.id;
      if (!isAuthor && !isAdmin()) {
        toast.error('You do not have permission to edit this post');
        navigate(ROUTES.POSTS);
        return;
      }

      // Populate form with post data
      setFormData({
        title: post.title || '',
        content: post.content || '',
        categories: post.categories?.map((cat) => cat._id) || [],
        tags: post.tags?.map((tag) => tag._id) || [],
        status: post.status || 'draft',
      });
    }
  }, [post, user, isAdmin, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    const result = await updatePost(id, formData);

    if (result.success) {
      toast.success('Post updated successfully');
      navigate(ROUTES.POST_DETAIL.replace(':id', id));
    }
    setSubmitting(false);
  };

  if (postLoading) {
    return <Loader fullScreen />;
  }

  if (!post) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Post not found
          </h2>
          <Button onClick={() => navigate(ROUTES.POSTS)} className="mt-4">
            Back to Posts
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { name: 'Dashboard', path: ROUTES.DASHBOARD },
          { name: 'Posts', path: ROUTES.POSTS },
          { name: post.title, path: ROUTES.POST_DETAIL.replace(':id', id) },
          { name: 'Edit' },
        ]}
      />

      <PageHeader
        title="Edit Post"
        description="Update your post content"
        icon={Edit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <PostForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              categories={categories}
              tags={tags}
              loading={categoriesLoading || tagsLoading}
            />
          </Card>
        </motion.div>

        {/* Sidebar Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Update Post
              </h3>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                  icon={Save}
                >
                  Update Post
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPreview(true)}
                  icon={Eye}
                >
                  Preview
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate(ROUTES.POST_DETAIL.replace(':id', id))}
                >
                  Cancel
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Post Status
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current status: <strong className="capitalize">{post.status}</strong>
              </p>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Post Preview"
        size="xl"
      >
        <div className="prose dark:prose-invert max-w-none">
          <h1>{formData.title || 'Untitled Post'}</h1>
          <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content</p>' }} />
        </div>
      </Modal>
    </Container>
  );
};

export default EditPost;
