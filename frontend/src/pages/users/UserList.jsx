import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Trash2, Edit } from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import useDebounce from '../../hooks/useDebounce';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newRole, setNewRole] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      if (response.success) {
        let filteredUsers = response.data;

        if (debouncedSearch) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        if (roleFilter) {
          filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
        }

        setUsers(filteredUsers);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      const response = await userService.deleteUser(selectedUser._id);
      if (response.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    try {
      const response = await userService.updateUserRole(selectedUser._id, newRole);
      if (response.success) {
        toast.success('User role updated successfully');
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        setNewRole('');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'author', label: 'Author' },
    { value: 'admin', label: 'Admin' },
  ];

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'author':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="User Management"
        description="Manage platform users and their roles"
        icon={Users}
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
          <Select
            name="role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={roleOptions}
          />
        </div>
      </Card>

      {/* Users List */}
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" message="Try adjusting your filters" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar name={user.name} size="lg" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                        {user.isActive === false && <Badge variant="warning">Inactive</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Shield}
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                        setShowEditModal(true);
                      }}
                    >
                      Change Role
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDeleteUser}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot
          be undone.
        </p>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Change User Role"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Change role for <strong>{selectedUser?.name}</strong>
          </p>
          <Select
            label="New Role"
            name="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              { value: 'user', label: 'User' },
              { value: 'author', label: 'Author' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>
      </Modal>
    </Container>
  );
};

export default UserList;
