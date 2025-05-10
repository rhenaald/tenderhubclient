import React, { useState, useEffect } from 'react';
import { apiClient } from "../../api/apiService";

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // API functions
    const getAllCategories = () => {
        return apiClient.get('/categories/');
    };

    const createCategory = (categoryData) => {
        return apiClient.post('/categories/', categoryData);
    };

    const updateCategory = (categoryId, categoryData) => {
        return apiClient.put(`/categories/${categoryId}/`, categoryData);
    };

    const deleteCategory = (categoryId) => {
        return apiClient.delete(`/categories/${categoryId}/`);
    };

    // Fetch all categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAllCategories();
            // Check if response.data is an array or has a results property
            const categoriesData = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setCategories(categoriesData);
            console.log('Fetched categories:', categoriesData); // Debug log
        } catch (err) {
            setError('Failed to fetch categories. Please try again.');
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }
            fetchCategories();
            resetForm();
        } catch (err) {
            setError(`Failed to ${editingId ? 'update' : 'create'} category. Please try again.`);
            console.error(`Error ${editingId ? 'updating' : 'creating'} category:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setEditingId(category.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        setIsLoading(true);
        setError(null);
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category. Please try again.');
            console.error('Error deleting category:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="container my-26 mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Category Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                    {showForm ? 'Cancel' : 'Add New Category'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {showForm && (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : editingId ? 'Update Category' : 'Add Category'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {isLoading && !showForm ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!categories || categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                Array.isArray(categories) && categories.map(category => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                        <td className="px-6 py-4">{category.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;