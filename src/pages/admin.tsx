import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AdminPage = () => {
  const users = useQuery(api.admin.getAllUsers);
  const stats = useQuery(api.admin.getAdminDashboardStats);
  const updateUserRole = useMutation(api.admin.updateUserRole);
  const toggleUserActiveStatus = useMutation(api.admin.toggleUserActiveStatus);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, newRole });
      alert('User role updated successfully!');
    } catch (error) {
      alert('Failed to update user role: ' + error.message);
    }
  };

  const handleActiveStatusChange = async (userId, isActive) => {
    try {
      await toggleUserActiveStatus({ userId, isActive });
      alert('User active status updated successfully!');
    } catch (error) {
      alert('Failed to update user active status: ' + error.message);
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers ?? 'Loading...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
          <p className="text-3xl font-bold text-green-600">{stats?.totalProducts ?? 'Loading...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Courses</h2>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalCourses ?? 'Loading...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Forum Posts Today</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats?.totalForumPostsToday ?? 'Loading...'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-600">Total Sales (Paid)</h2>
          <p className="text-3xl font-bold text-red-600">{stats?.totalSales ? `Rp${stats.totalSales.toLocaleString('id-ID')}` : 'Loading...'}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="p-2 border border-gray-300 rounded-md flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {filteredUsers ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                        <option value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={user.active}
                        onChange={(e) => handleActiveStatusChange(user._id, e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Additional actions can be added here */}
                      <button
                        onClick={() => alert(`View details for ${user.name}`)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading users or you do not have permission to view this page.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;