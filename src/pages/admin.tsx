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
  const courses = useQuery(api.admin.getAllCoursesAdmin);
  const lessons = useQuery(api.admin.getAllLessonsAdmin);
  const progress = useQuery(api.admin.getAllProgressAdmin);
  const topics = useQuery(api.admin.getAllTopicsAdmin);
  const comments = useQuery(api.admin.getAllCommentsAdmin);

  const updateUserRole = useMutation(api.admin.updateUserRole);
  const toggleUserActiveStatus = useMutation(api.admin.toggleUserActiveStatus);
  const updateProductAdmin = useMutation(api.admin.updateProductAdmin);
  const deleteProductAdmin = useMutation(api.admin.deleteProductAdmin);
  const createCategoryAdmin = useMutation(api.admin.createCategoryAdmin);
  const updateCategoryAdmin = useMutation(api.admin.updateCategoryAdmin);
  const deleteCategoryAdmin = useMutation(api.admin.deleteCategoryAdmin);
  const createCourseAdmin = useMutation(api.admin.createCourseAdmin);
  const updateCourseAdmin = useMutation(api.admin.updateCourseAdmin);
  const deleteCourseAdmin = useMutation(api.admin.deleteCourseAdmin);
  const createLessonAdmin = useMutation(api.admin.createLessonAdmin);
  const updateLessonAdmin = useMutation(api.admin.updateLessonAdmin);
  const deleteLessonAdmin = useMutation(api.admin.deleteLessonAdmin);
  const deleteProgressAdmin = useMutation(api.admin.deleteProgressAdmin);
  const deleteTopicAdmin = useMutation(api.admin.deleteTopicAdmin);
  const toggleTopicPinnedStatusAdmin = useMutation(api.admin.toggleTopicPinnedStatusAdmin);
  const deleteCommentAdmin = useMutation(api.admin.deleteCommentAdmin);
  const createForumCategoryAdmin = useMutation(api.admin.createForumCategoryAdmin);

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

  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', category: '', level: '', price: 0, image: '', instructor: ''
  });

  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    courseId: '' as Id<"courses">, title: '', videoUrl: '', order: 0
  });

  const [forumCategoryForm, setForumCategoryForm] = useState({
    name: '', description: ''
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

  const handleCreateCourse = async () => {
    try {
      await createCourseAdmin(courseForm);
      alert('Course created successfully!');
      setCourseForm({ title: '', description: '', category: '', level: '', price: 0, image: '', instructor: '' });
    } catch (error) {
      alert('Failed to create course: ' + error.message);
    }
  };

  const handleEditCourseClick = (course) => {
    setEditingCourse(course._id);
    setCourseForm({
      title: course.title, description: course.description, category: course.category,
      level: course.level, price: course.price, image: course.image || '', instructor: course.instructor
    });
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      await updateCourseAdmin({ courseId, updatedFields: courseForm });
      alert('Course updated successfully!');
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', category: '', level: '', price: 0, image: '', instructor: '' });
    } catch (error) {
      alert('Failed to update course: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourseAdmin({ courseId });
        alert('Course deleted successfully!');
      } catch (error) {
        alert('Failed to delete course: ' + error.message);
      }
    }
  };

  const handleCreateLesson = async () => {
    try {
      await createLessonAdmin(lessonForm);
      alert('Lesson created successfully!');
      setLessonForm({ courseId: '' as Id<"courses">, title: '', videoUrl: '', order: 0 });
    } catch (error) {
      alert('Failed to create lesson: ' + error.message);
    }
  };

  const handleEditLessonClick = (lesson) => {
    setEditingLesson(lesson._id);
    setLessonForm({
      courseId: lesson.courseId, title: lesson.title, videoUrl: lesson.videoUrl, order: lesson.order
    });
  };

  const handleUpdateLesson = async (lessonId) => {
    try {
      await updateLessonAdmin({ lessonId, updatedFields: lessonForm });
      alert('Lesson updated successfully!');
      setEditingLesson(null);
      setLessonForm({ courseId: '' as Id<"courses">, title: '', videoUrl: '', order: 0 });
    } catch (error) {
      alert('Failed to update lesson: ' + error.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLessonAdmin({ lessonId });
        alert('Lesson deleted successfully!');
      } catch (error) {
        alert('Failed to delete lesson: ' + error.message);
      }
    }
  };

  const handleDeleteProgress = async (progressId) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      try {
        await deleteProgressAdmin({ progressId });
        alert('Progress entry deleted successfully!');
      } catch (error) {
        alert('Failed to delete progress entry: ' + error.message);
      }
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopicAdmin({ topicId });
        alert('Topic deleted successfully!');
      } catch (error) {
        alert('Failed to delete topic: ' + error.message);
      }
    }
  };

  const handleToggleTopicPinnedStatus = async (topicId, isPinned) => {
    try {
      await toggleTopicPinnedStatusAdmin({ topicId, isPinned });
      alert('Topic pinned status updated successfully!');
    } catch (error) {
      alert('Failed to update topic pinned status: ' + error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteCommentAdmin({ commentId });
        alert('Comment deleted successfully!');
      } catch (error) {
        alert('Failed to delete comment: ' + error.message);
      }
    }
  };

  const handleCreateForumCategory = async () => {
    try {
      await createForumCategoryAdmin(forumCategoryForm);
      alert('Forum category created successfully!');
      setForumCategoryForm({ name: '', description: '' });
    } catch (error) {
      alert('Failed to create forum category: ' + error.message);
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
                        <option value="banned">Bignorant</option>
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

      {/* Course Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Management</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
          <input
            type="text"
            placeholder="Title"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <textarea
            placeholder="Description"
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          ></textarea>
          <input
            type="text"
            placeholder="Category"
            value={courseForm.category}
            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Level"
            value={courseForm.level}
            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={courseForm.price}
            onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={courseForm.image}
            onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Instructor"
            value={courseForm.instructor}
            onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          {editingCourse ? (
            <button
              onClick={() => handleUpdateCourse(editingCourse)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleCreateCourse}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Create Course
            </button>
          )}
          {editingCourse && (
            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({ title: '', description: '', category: '', level: '', price: 0, image: '', instructor: '' });
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>

        {courses ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditCourseClick(course)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
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
          <p>Loading courses or you do not have permission to view this page.</p>
        )}
      </div>

      {/* Lesson Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Lesson Management</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
          <select
            value={lessonForm.courseId}
            onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value as Id<"courses"> })}
            className="p-2 border rounded-md w-full mb-2"
          >
            <option value="">Select Course</option>
            {courses?.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Title"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="text"
            placeholder="Video URL"
            value={lessonForm.videoUrl}
            onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <input
            type="number"
            placeholder="Order"
            value={lessonForm.order}
            onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
            className="p-2 border rounded-md w-full mb-2"
          />
          {editingLesson ? (
            <button
              onClick={() => handleUpdateLesson(editingLesson)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleCreateLesson}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Create Lesson
            </button>
          )}
          {editingLesson && (
            <button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({ courseId: '' as Id<"courses">, title: '', videoUrl: '', order: 0 });
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>

        {lessons ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <tr key={lesson._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.courseId.toString().substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditLessonClick(lesson)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
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
          <p>Loading lessons or you do not have permission to view this page.</p>
        )}
      </div>

      {/* Course Progress Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Progress Management</h2>
        {progress ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {progress.map((p) => (
                  <tr key={p._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.userId.toString().substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.lessonId.toString().substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.progress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.completed ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteProgress(p._id)}
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
          <p>Loading progress data or you do not have permission to view this page.</p>
        )}
      </div>

      {/* Forum Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Forum Management</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Create New Forum Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={forumCategoryForm.name}
            onChange={(e) => setForumCategoryForm({ ...forumCategoryForm, name: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          />
          <textarea
            placeholder="Description (Optional)"
            value={forumCategoryForm.description}
            onChange={(e) => setForumCategoryForm({ ...forumCategoryForm, description: e.target.value })}
            className="p-2 border rounded-md w-full mb-2"
          ></textarea>
          <button
            onClick={handleCreateForumCategory}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Create Forum Category
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-2">Topics</h3>
        {topics ? (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pinned</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topics.map((topic) => (
                  <tr key={topic._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.authorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={topic.isPinned}
                        onChange={(e) => handleToggleTopicPinnedStatus(topic._id, e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteTopic(topic._id)}
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
          <p>Loading topics or you do not have permission to view this page.</p>
        )}

        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comment.content.substring(0, 50)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.authorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.topicId.toString().substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
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
          <p>Loading comments or you do not have permission to view this page.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;