import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const AdminPage = () => {
  const users = useQuery(api.admin.getAllUsers);
  const stats = useQuery(api.admin.getAdminDashboardStats);
  const products = useQuery(api.admin.getAllProductsAdmin);
  const orders = useQuery(api.admin.getAllOrdersAdmin);
  const categories = useQuery(api.categories.getCategories);

  const updateUserRole = useMutation(api.admin.updateUserRole);
  const toggleUserActiveStatus = useMutation(api.admin.toggleUserActiveStatus);
  const updateProductAdmin = useMutation(api.admin.updateProductAdmin);
  const deleteProductAdmin = useMutation(api.admin.deleteProductAdmin);
  const createCategoryAdmin = useMutation(api.admin.createCategoryAdmin);
  const updateCategoryAdmin = useMutation(api.admin.updateCategoryAdmin);
  const deleteCategoryAdmin = useMutation(api.admin.deleteCategoryAdmin);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: 0, stock: 0, category: '', status: ''
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '', icon: '', type: '', order: 0, isActive: true
  });

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

  const handleEditProductClick = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      title: product.title, description: product.description, price: product.price,
      stock: product.stock, category: product.category, status: product.status
    });
  };

  const handleUpdateProduct = async (productId) => {
    try {
      await updateProductAdmin({ productId, updatedFields: productForm });
      alert('Product updated successfully!');
      setEditingProduct(null);
      setProductForm({ title: '', description: '', price: 0, stock: 0, category: '', status: '' });
    } catch (error) {
      alert('Failed to update product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductAdmin({ productId });
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategoryAdmin(categoryForm);
      alert('Category created successfully!');
      setCategoryForm({ name: '', icon: '', type: '', order: 0, isActive: true });
    } catch (error) {
      alert('Failed to create category: ' + error.message);
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category._id);
    setCategoryForm({
      name: category.name, icon: category.icon, type: category.type,
      order: category.order, isActive: category.isActive
    });
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      await updateCategoryAdmin({ categoryId, updatedFields: categoryForm });
      alert('Category updated successfully!');
      setEditingCategory(null);
      setCategoryForm({ name: '', icon: '', type: '', order: 0, isActive: true });
    } catch (error) {
      alert('Failed to update category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryAdmin({ categoryId });
        alert('Category deleted successfully!');
      } catch (error) {
        alert('Failed to delete category: ' + error.message);
      }
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
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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

      {/* Marketplace Product Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Marketplace Product Management</h2>
        {products ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sellerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp{product.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditProductClick(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading products or you do not have permission to view this page.</p>
        )}

        {editingProduct && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Edit Product</h3>
            <input
              type="text"
              placeholder="Title"
              value={productForm.title}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            ></textarea>
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="text"
              placeholder="Status"
              value={productForm.status}
              onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <button
              onClick={() => handleUpdateProduct(editingProduct)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Marketplace Order Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Marketplace Order Management</h2>
        {orders ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.toString().substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.productTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.buyerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp{order.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => alert(`View order ${order._id}`)}
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
          <p>Loading orders or you do not have permission to view this page.</p>
        )}
      </div>

      {/* Category Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Category Management</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
          <input
            type="text"
            placeholder="Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Icon"
            value={categoryForm.icon}
            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Type (e.g., enthusiasts, formulators)"
            value={categoryForm.type}
            onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="number"
            placeholder="Order"
            value={categoryForm.order}
            onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={categoryForm.isActive}
              onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
              className="form-checkbox h-5 w-5 text-blue-600 mr-2"
            />
            Is Active
          </label>
          {editingCategory ? (
            <button
              onClick={() => handleUpdateCategory(editingCategory)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleCreateCategory}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Create Category
            </button>
          )}
          {editingCategory && (
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', icon: '', type: '', order: 0, isActive: true });
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>

        {categories ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditCategoryClick(category)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading categories or you do not have permission to view this page.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;