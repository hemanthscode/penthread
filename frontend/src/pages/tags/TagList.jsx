// src/pages/tags/TagList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks';
import useTags from '../../hooks/useTags';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import useForm from '../../hooks/useForm';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const TagList = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isAuthor } = useAuth();
  const { tags, loading, createTag, updateTag, deleteTag } = useTags();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated or not author/admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage tags');
      navigate(ROUTES.LOGIN);
    } else if (!isAuthor() && !isAdmin()) {
      toast.error('You do not have permission to manage tags');
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, isAuthor, isAdmin, navigate]);

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    return errors;
  };

  const createForm = useForm({ name: '' }, validate);
  const editForm = useForm({ name: '' }, validate);

  const handleCreate = async (values) => {
    setSubmitting(true);
    const result = await createTag(values);
    if (result.success) {
      createForm.resetForm();
      setShowCreateModal(false);
    }
    setSubmitting(false);
  };

  const handleEdit = async (values) => {
    if (!selectedTag) return;
    setSubmitting(true);
    const result = await updateTag(selectedTag._id, values);
    if (result.success) {
      setShowEditModal(false);
      setSelectedTag(null);
      editForm.resetForm();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    setSubmitting(true);
    const result = await deleteTag(selectedTag._id);
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedTag(null);
    }
    setSubmitting(false);
  };

  const openEditModal = (tag) => {
    setSelectedTag(tag);
    editForm.setValues({ name: tag.name });
    setShowEditModal(true);
  };

  const openDeleteModal = (tag) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const canManage = isAuthor() || isAdmin();

  return (
    <Container className="py-8">
      <PageHeader
        title="Tags"
        description="Manage content tags for better discoverability"
        icon={Tag}
        action={canManage ? "Create Tag" : null}
        onAction={canManage ? () => setShowCreateModal(true) : null}
      />

      {tags.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No tags"
          message={canManage ? "Create your first tag to organize content" : "No tags available yet"}
          action={canManage ? "Create Tag" : null}
          onAction={canManage ? () => setShowCreateModal(true) : null}
        />
      ) : (
        <Card>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <motion.div
                key={tag._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="group relative"
              >
                <Badge variant="default" size="lg" className={canManage ? "pr-20" : ""}>
                  #{tag.name}
                </Badge>
                {canManage && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(tag)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => openDeleteModal(tag)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Tag"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={createForm.handleSubmit(handleCreate)}
            >
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tag Name"
            name="name"
            value={createForm.values.name}
            onChange={createForm.handleChange}
            onBlur={createForm.handleBlur}
            error={createForm.touched.name && createForm.errors.name}
            placeholder="e.g., javascript, react, tutorial"
            required
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Tag"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={editForm.handleSubmit(handleEdit)}
            >
              Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tag Name"
            name="name"
            value={editForm.values.name}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.name && editForm.errors.name}
            required
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Tag"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the tag <strong>#{selectedTag?.name}</strong>?
        </p>
      </Modal>
    </Container>
  );
};

export default TagList;
