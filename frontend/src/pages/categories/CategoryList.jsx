import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks';
import useCategories from '../../hooks/useCategories';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import useForm from '../../hooks/useForm';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthor, isAdmin } = useAuth();
  const { categories, loading, createCategory, updateCategory, deleteCategory, refetch } = useCategories();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canManage = isAuthor() || isAdmin();

  // Redirect and permissions check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage categories');
      navigate(ROUTES.LOGIN);
    } else if (!canManage) {
      toast.error('You do not have permission to manage categories');
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, canManage, navigate]);

  // Validation function
  const validate = useCallback((values) => {
    const errors = {};
    if (!values.name?.trim()) {
      errors.name = 'Name is required';
    } else if (values.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    } else if (values.name.trim().length > 100) {
      errors.name = 'Category name must not exceed 100 characters';
    }
    
    if (values.description && values.description.length > 300) {
      errors.description = 'Description must not exceed 300 characters';
    }
    return errors;
  }, []);

  // Initialize forms
  const createForm = useForm({ name: '', description: '' }, validate);
  const editForm = useForm({ name: '', description: '' }, validate);

  // Create handler
  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      const result = await createCategory({
        name: values.name.trim(),
        description: values.description?.trim() || ''
      });
      
      if (result.success) {
        createForm.resetForm();
        setShowCreateModal(false);
        await refetch();
      }
    } catch (error) {
      console.error('Create category error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit handler
  const handleEdit = async (values) => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const result = await updateCategory(selectedCategory._id, {
        name: values.name.trim(),
        description: values.description?.trim() || ''
      });
      
      if (result.success) {
        setShowEditModal(false);
        setSelectedCategory(null);
        editForm.resetForm();
        await refetch();
      }
    } catch (error) {
      console.error('Update category error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const result = await deleteCategory(selectedCategory._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setSelectedCategory(null);
        await refetch();
      }
    } catch (error) {
      console.error('Delete category error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Modal helpers
  const openEditModal = (category) => {
    setSelectedCategory(category);
    editForm.setValues({ 
      name: category.name, 
      description: category.description || '' 
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    createForm.resetForm();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    editForm.resetForm();
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <Container className="py-8">
      <PageHeader
        title="Categories"
        description="Organize your content with categories"
        icon={FolderOpen}
        action={canManage ? 'Create Category' : null}
        onAction={canManage ? () => setShowCreateModal(true) : null}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories"
          message={canManage ? 'Create your first category to organize content' : 'No categories available yet'}
          action={canManage ? 'Create Category' : null}
          onAction={canManage ? () => setShowCreateModal(true) : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div 
              key={category._id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-1">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg mr-3">
                      <FolderOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category.postCount || 0} {category.postCount === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {canManage && (
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Edit} 
                      onClick={() => openEditModal(category)} 
                      fullWidth
                    >
                      Edit
                    </Button>
                    {isAdmin() && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2} 
                        onClick={() => openDeleteModal(category)} 
                        fullWidth
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={closeCreateModal} 
        title="Create Category"
        footer={
          <>
            <Button variant="secondary" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="button"
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
            label="Name"
            name="name"
            value={createForm.values.name}
            onChange={createForm.handleChange}
            onBlur={createForm.handleBlur}
            error={createForm.touched.name && createForm.errors.name}
            placeholder="e.g., Technology, Lifestyle, Travel"
            required
            autoFocus
          />
          <Textarea 
            label="Description" 
            name="description" 
            value={createForm.values.description} 
            onChange={createForm.handleChange}
            onBlur={createForm.handleBlur}
            error={createForm.touched.description && createForm.errors.description}
            placeholder="Brief description of this category..."
            rows={3} 
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={closeEditModal} 
        title="Edit Category"
        footer={
          <>
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="button"
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
            label="Name"
            name="name"
            value={editForm.values.name}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.name && editForm.errors.name}
            required
            autoFocus
          />
          <Textarea 
            label="Description" 
            name="description" 
            value={editForm.values.description} 
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.description && editForm.errors.description}
            rows={3} 
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={closeDeleteModal} 
        title="Delete Category"
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
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>?
          {selectedCategory?.postCount > 0 && (
            <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
              This category is used in {selectedCategory.postCount} post(s). 
              You must remove it from all posts before deleting.
            </span>
          )}
        </p>
      </Modal>
    </Container>
  );
};

export default CategoryList;