import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Edit, Trash2, Hash } from 'lucide-react';
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
  const { tags, loading, createTag, updateTag, deleteTag, refetch } = useTags();
  
  const [showModal, setShowModal] = useState({ 
    create: false, 
    edit: false, 
    delete: false 
  });
  const [selectedTag, setSelectedTag] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canManage = isAuthor() || isAdmin();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage tags');
      navigate(ROUTES.LOGIN);
    } else if (!canManage) {
      toast.error('You do not have permission to manage tags');
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, canManage, navigate]);

  const validate = useCallback((values) => {
    const errors = {};
    if (!values.name?.trim()) {
      errors.name = 'Name is required';
    } else if (values.name.trim().length < 2) {
      errors.name = 'Tag name must be at least 2 characters';
    } else if (values.name.trim().length > 50) {
      errors.name = 'Tag name must not exceed 50 characters';
    }
    return errors;
  }, []);

  const createForm = useForm({ name: '' }, validate);
  const editForm = useForm({ name: '' }, validate);

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      const result = await createTag({
        name: values.name.trim().toLowerCase()
      });
      
      if (result.success) {
        createForm.resetForm();
        setShowModal({ ...showModal, create: false });
        await refetch();
      }
    } catch (error) {
      console.error('Create tag error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    if (!selectedTag) return;
    setSubmitting(true);
    try {
      const result = await updateTag(selectedTag._id, {
        name: values.name.trim().toLowerCase()
      });
      
      if (result.success) {
        setShowModal({ ...showModal, edit: false });
        setSelectedTag(null);
        editForm.resetForm();
        await refetch();
      }
    } catch (error) {
      console.error('Update tag error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    setSubmitting(true);
    try {
      const result = await deleteTag(selectedTag._id);
      
      if (result.success) {
        setShowModal({ ...showModal, delete: false });
        setSelectedTag(null);
        await refetch();
      }
    } catch (error) {
      console.error('Delete tag error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (tag) => {
    setSelectedTag(tag);
    editForm.setValues({ name: tag.name });
    setShowModal({ ...showModal, edit: true });
  };

  const openDeleteModal = (tag) => {
    setSelectedTag(tag);
    setShowModal({ ...showModal, delete: true });
  };

  const closeCreateModal = () => {
    setShowModal({ ...showModal, create: false });
    createForm.resetForm();
  };

  const closeEditModal = () => {
    setShowModal({ ...showModal, edit: false });
    setSelectedTag(null);
    editForm.resetForm();
  };

  const closeDeleteModal = () => {
    setShowModal({ ...showModal, delete: false });
    setSelectedTag(null);
  };

  if (loading) return <Loader fullScreen />;

  // Sort tags by post count (descending) then by name
  const sortedTags = [...tags].sort((a, b) => {
    if (b.postCount !== a.postCount) {
      return b.postCount - a.postCount;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <Container className="py-8">
      <PageHeader
        title="Tags"
        description="Manage content tags for better discoverability"
        icon={Tag}
        action={canManage ? "Create Tag" : null}
        onAction={canManage ? () => setShowModal({ ...showModal, create: true }) : null}
      />

      {tags.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No tags"
          message={canManage ? "Create your first tag to organize content" : "No tags available yet"}
          action={canManage ? "Create Tag" : null}
          onAction={canManage ? () => setShowModal({ ...showModal, create: true }) : null}
        />
      ) : (
        <Card>
          <div className="flex flex-wrap gap-3">
            {sortedTags.map((tag, index) => (
              <motion.div
                key={tag._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="group relative"
              >
                <div className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-primary-100 dark:bg-primary-900/20 
                  text-primary-700 dark:text-primary-300
                  border border-primary-200 dark:border-primary-800
                  ${canManage ? 'pr-16' : ''}
                `}>
                  <Hash className="h-3 w-3" />
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-primary-600 dark:text-primary-400 bg-primary-200 dark:bg-primary-800 px-1.5 py-0.5 rounded-full">
                    {tag.postCount || 0}
                  </span>
                </div>
                
                {canManage && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(tag)}
                      className="p-1 hover:bg-primary-200 dark:hover:bg-primary-700 rounded transition-colors"
                      aria-label="Edit tag"
                      title="Edit tag"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => openDeleteModal(tag)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 transition-colors"
                        aria-label="Delete tag"
                        title="Delete tag"
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
        isOpen={showModal.create}
        onClose={closeCreateModal}
        title="Create Tag"
        footer={
          <>
            <Button variant="secondary" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              loading={submitting} 
              onClick={() => createForm.handleSubmit(handleCreate)()}
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
            helperText="Tag names are automatically converted to lowercase"
            required
            autoFocus
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showModal.edit}
        onClose={closeEditModal}
        title="Edit Tag"
        footer={
          <>
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              loading={submitting} 
              onClick={() => editForm.handleSubmit(handleEdit)()}
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
            helperText="Tag names are automatically converted to lowercase"
            required
            autoFocus
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showModal.delete}
        onClose={closeDeleteModal}
        title="Delete Tag"
        footer={
          <>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              loading={submitting} 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>#{selectedTag?.name}</strong>?
          </p>
          {selectedTag?.postCount > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                This tag is used in {selectedTag.postCount} post(s). 
                You must remove it from all posts before deleting.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </Container>
  );
};

export default TagList;