// src/pages/categories/CategoryList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Edit, Trash2 } from 'lucide-react';
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
  const { isAuthenticated, isAdmin, isAuthor } = useAuth();
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated or not author/admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to manage categories');
      navigate(ROUTES.LOGIN);
    } else if (!isAuthor() && !isAdmin()) {
      toast.error('You do not have permission to manage categories');
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

  const createForm = useForm({ name: '', description: '' }, validate);
  const editForm = useForm({ name: '', description: '' }, validate);

  const handleCreate = async (values) => {
    setSubmitting(true);
    const result = await createCategory(values);
    if (result.success) {
      createForm.resetForm();
      setShowCreateModal(false);
    }
    setSubmitting(false);
  };

  const handleEdit = async (values) => {
    if (!selectedCategory) return;
    setSubmitting(true);
    const result = await updateCategory(selectedCategory._id, values);
    if (result.success) {
      setShowEditModal(false);
      setSelectedCategory(null);
      editForm.resetForm();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    const result = await deleteCategory(selectedCategory._id);
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
    setSubmitting(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    editForm.setValues({ name: category.name, description: category.description || '' });
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const canManage = isAuthor() || isAdmin();

  return (
    <Container className="py-8">
      <PageHeader
        title="Categories"
        description="Organize your content with categories"
        icon={FolderOpen}
        action={canManage ? "Create Category" : null}
        onAction={canManage ? () => setShowCreateModal(true) : null}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories"
          message={canManage ? "Create your first category to organize content" : "No categories available yet"}
          action={canManage ? "Create Category" : null}
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
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg mr-3">
                      <FolderOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
        onClose={() => setShowCreateModal(false)}
        title="Create Category"
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
            label="Name"
            name="name"
            value={createForm.values.name}
            onChange={createForm.handleChange}
            onBlur={createForm.handleBlur}
            error={createForm.touched.name && createForm.errors.name}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={createForm.values.description}
            onChange={createForm.handleChange}
            rows={3}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Category"
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
            label="Name"
            name="name"
            value={editForm.values.name}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
            error={editForm.touched.name && editForm.errors.name}
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={editForm.values.description}
            onChange={editForm.handleChange}
            rows={3}
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
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
          Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>?
        </p>
      </Modal>
    </Container>
  );
};

export default CategoryList;
