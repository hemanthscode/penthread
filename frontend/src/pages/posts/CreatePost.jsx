import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, Save, Eye } from 'lucide-react';
import { useAuth } from '../../hooks';
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
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user, isAuthor, isAdmin } = useAuth();
  const { createPost } = usePostStore();
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
    if (!isAuthor() && !isAdmin()) {
      toast.error('You do not have permission to create posts');
      navigate(ROUTES.HOME);
    }
  }, [isAuthor, isAdmin, navigate]);

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

  const handleSubmit = async (status = 'draft') => {
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    const postData = { ...formData, status };
    const result = await createPost(postData);

    if (result.success) {
      toast.success(
        status === 'draft'
          ? 'Draft saved successfully'
          : 'Post submitted for review'
      );
      navigate(ROUTES.DASHBOARD);
    }
    setSubmitting(false);
  };

  const handleSaveDraft = () => handleSubmit('draft');
  const handlePublish = () => handleSubmit('pending');

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { name: 'Dashboard', path: ROUTES.DASHBOARD },
          { name: 'Create Post' },
        ]}
      />

      <PageHeader
        title="Create New Post"
        description="Share your thoughts with the community"
        icon={PenTool}
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
                Publish
              </h3>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handlePublish}
                  loading={submitting}
                  disabled={submitting}
                >
                  Submit for Review
                </Button>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleSaveDraft}
                  loading={submitting}
                  disabled={submitting}
                  icon={Save}
                >
                  Save as Draft
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPreview(true)}
                  icon={Eye}
                >
                  Preview
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> Posts need admin approval before being published.
                </p>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Write a compelling title (10-200 characters)</li>
                <li>• Add relevant categories and tags</li>
                <li>• Include engaging content (minimum 50 characters)</li>
                <li>• Preview before submitting</li>
              </ul>
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

export default CreatePost;
