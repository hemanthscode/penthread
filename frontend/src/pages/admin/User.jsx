import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '../../services/userService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    fetchUsers();
  };

  const handleStatusChange = async (userId, isActive) => {
    await updateUserStatus(userId, isActive);
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    fetchUsers();
  };

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td className="border p-2">
                <select
                  value={user.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleStatusChange(user._id, e.target.value === 'active')}
                  className="border rounded px-2 py-1"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td className="border p-2">
                <Button variant="danger" onClick={() => handleDelete(user._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
