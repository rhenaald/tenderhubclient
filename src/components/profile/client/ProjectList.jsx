import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProjectList = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        attachment: null,
        max_duration: 30,
        min_budget: 0,
        max_budget: 0,
        deadline: "",
        category_id: "",
        tags_data: []
    });
    const [tagInput, setTagInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await apiClient.get("/users/profile");
                setCurrentUser(response.data);
                console.log("Current user profile:", response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectsRes, categoriesRes, tagsRes] = await Promise.all([
                    apiClient.get("/tenders/"),
                    apiClient.get("/categories/"),
                    apiClient.get("/tags/")
                ]);

                // Get all projects
                const allProjects = projectsRes.data?.results || projectsRes.data || [];

                const userProjects = currentUser ? allProjects.filter(project => {
                    // Gunakan kedua kondisi untuk memastikan semua proyek pengguna terambil
                    return (project.client === currentUser.id || project.created_by?.id === currentUser.id)
                        && project.status === 'open';
                }) : [];

                setProjects(userProjects);
                setCategories(categoriesRes.data?.results || categoriesRes.data || []);
                setTags(tagsRes.data?.results || tagsRes.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0] || null
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Helper function for tag format consistency
    const formatTagData = (tagInput) => {
        if (typeof tagInput === 'string') {
            return { name: tagInput };
        } else if (typeof tagInput === 'object' && tagInput !== null) {
            return { name: tagInput.name || "" };
        }
        return { name: "" };
    };

    // Helper function to extract tag name regardless of format
    const getTagName = (tag) => {
        if (typeof tag === 'object' && tag !== null) {
            return tag.name || "";
        }
        return tag || "";
    };

    // Fixed tag handling functions
    const handleTagActions = {
        add: () => {
            const trimmedTag = tagInput.trim();
            if (!trimmedTag) return;

            // Check if tag already exists using the getTagName helper
            if (!formData.tags_data.some(tag =>
                getTagName(tag).toLowerCase() === trimmedTag.toLowerCase()
            )) {
                setFormData({
                    ...formData,
                    tags_data: [...formData.tags_data, formatTagData(trimmedTag)]
                });
                setTagInput("");
            }
        },
        remove: (tagToRemove) => {
            setFormData({
                ...formData,
                tags_data: formData.tags_data.filter(tag =>
                    getTagName(tag) !== tagToRemove
                )
            });
        }
    };

    // Simplified render tag function
    const renderTag = (tag) => {
        return getTagName(tag);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            attachment: null,
            max_duration: 30,
            min_budget: 0,
            max_budget: 0,
            deadline: "",
            category_id: "",
            tags_data: []
        });
        setTagInput("");
        setEditingId(null);
        setIsFormVisible(false);
        setError("");
    };

    const validateForm = () => {
        // Validasi budget
        if (Number(formData.min_budget) > Number(formData.max_budget)) {
            setError("Budget minimal tidak boleh lebih besar dari budget maksimal");
            return false;
        }

        // Validasi kategori
        if (!formData.category_id) {
            setError("Kategori harus dipilih");
            return false;
        }

        // Validasi deadline (pastikan tidak di masa lalu)
        if (new Date(formData.deadline) < new Date()) {
            setError("Deadline tidak boleh lebih awal dari hari ini");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Clean up tags format to ensure consistency
            const preparedTags = formData.tags_data.map(tag => {
                if (typeof tag === 'object' && tag !== null) {
                    return { name: tag.name || "" };
                }
                return { name: tag || "" };
            });

            // Make sure to properly use FormData for file uploads
            const formDataToSend = new FormData();

            // Always add essential fields to FormData
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('max_duration', formData.max_duration);
            formDataToSend.append('min_budget', formData.min_budget);
            formDataToSend.append('max_budget', formData.max_budget);
            formDataToSend.append('deadline', formData.deadline);
            formDataToSend.append('category_id', formData.category_id);

            // Only append attachment if it exists
            if (formData.attachment) {
                formDataToSend.append('attachment', formData.attachment);
            }

            // Format tags for FormData
            preparedTags.forEach((tag, index) => {
                formDataToSend.append(`tags[${index}][name]`, tag.name);
            });

            // Set proper headers for multipart/form-data
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editingId) {
                // Update existing project
                await apiClient.put(`/tenders/${editingId}/`, formDataToSend, config);
            } else {
                // Create new project
                await apiClient.post("/tenders/", formDataToSend, config);
            }

            resetForm();
            await refreshProjects();

        } catch (error) {
            console.error("Error submitting project:", error);
            handleSubmitError(error);

            // Enhanced debugging
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
            }
        }
    };

    const refreshProjects = async () => {
        if (currentUser) {
            try {
                const res = await apiClient.get("/tenders/");
                const allProjects = res.data?.results || res.data || [];
                const userProjects = allProjects.filter(project =>
                    project.status === 'open' &&
                    (project.client === currentUser.id || project.created_by?.id === currentUser.id)
                );
                setProjects(userProjects);
            } catch (error) {
                console.error("Error refreshing projects:", error);
            }
        }
    };

    const handleSubmitError = (error) => {
        let errorMessage = "Gagal menyimpan proyek. Coba lagi nanti.";

        if (error.response) {
            console.error("Error response data:", error.response.data);

            if (error.response.data) {
                // Handle error validasi
                if (typeof error.response.data === 'object') {
                    const errorMessages = Object.entries(error.response.data)
                        .map(([field, errors]) => {
                            if (Array.isArray(errors)) {
                                return `${field}: ${errors.join(', ')}`;
                            }
                            return `${field}: ${errors}`;
                        })
                        .join('\n');
                    errorMessage = errorMessages;
                } else {
                    errorMessage = error.response.data.toString();
                }
            }
        }

        setError(errorMessage);
    };

    const handleEdit = async (id) => {
        try {
            const res = await apiClient.get(`/tenders/${id}/`);
            const project = res.data;

            // Ensure consistent tag structure for editing
            const formattedTags = Array.isArray(project.tags_data) ?
                project.tags_data.map(tag => formatTagData(getTagName(tag))) : [];

            setFormData({
                title: project.title,
                description: project.description,
                max_duration: project.max_duration,
                min_budget: project.min_budget,
                max_budget: project.max_budget,
                deadline: project.deadline ? project.deadline.split('T')[0] : "",
                category_id: project.category?.id || project.category_id || "",
                tags_data: formattedTags,
                attachment: null // Reset attachment on edit
            });

            setEditingId(id);
            setIsFormVisible(true);
        } catch (error) {
            console.error("Error fetching project:", error);
            setError("Gagal memuat data proyek");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus proyek ini?")) {
            try {
                await apiClient.delete(`/tenders/${id}/`);
                await refreshProjects();
            } catch (error) {
                console.error("Error deleting project:", error);
                setError("Gagal menghapus proyek");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId || cat.category_id === categoryId);
        return category ? category.name : 'Tidak ada kategori';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m2-6a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-gray-800">Anda belum login</h4>
                    <p className="text-gray-600 mb-8 max-w-md">Silakan login untuk melihat dan mengelola proyek Anda</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-6 py-3 font-medium shadow-sm"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-medium text-2xl text-gray-800">
                    {isFormVisible ? (editingId ? "Edit Proyek" : "Buat Proyek") : "Proyek Saya"}
                </h3>
                {!isFormVisible && (
                    <button
                        className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
                        onClick={() => setIsFormVisible(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Buat Proyek
                    </button>
                )}
            </div>

            {isFormVisible ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all">
                    <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border-l-4 border-red-500">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Proyek *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                required
                                placeholder="Masukkan judul proyek"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition min-h-[100px]"
                                required
                                placeholder="Jelaskan detail proyek Anda"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <div className="relative">
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none bg-white pr-8"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(category => (
                                        <option key={category.id || category.category_id} value={category.id || category.category_id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (hari) *</label>
                                <input
                                    type="number"
                                    name="max_duration"
                                    value={formData.max_duration}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    required
                                    placeholder="Contoh: 30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Min (Rp) *</label>
                                <input
                                    type="number"
                                    name="min_budget"
                                    value={formData.min_budget}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    required
                                    placeholder="Contoh: 500000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Max (Rp) *</label>
                                <input
                                    type="number"
                                    name="max_budget"
                                    value={formData.max_budget}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    required
                                    placeholder="Contoh: 1000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="attachment"
                                    id="file-upload"
                                    onChange={handleInputChange}
                                    className="absolute opacity-0 w-0 h-0"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    {formData.attachment ? formData.attachment.name : "Pilih File"}
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                            <div className="relative">
                                <select
                                    value=""
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const selectedTag = tags.find(tag => tag.id === parseInt(e.target.value) || tag.id === e.target.value);
                                            if (selectedTag && !formData.tags_data.some(t => getTagName(t) === selectedTag.name)) {
                                                setFormData({
                                                    ...formData,
                                                    tags_data: [...formData.tags_data, formatTagData(selectedTag.name)]
                                                });
                                            }
                                            e.target.value = "";
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none bg-white pr-8"
                                >
                                    <option value="">Pilih Tag</option>
                                    {tags.map(tag => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            {formData.tags_data.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags_data.map((tag, idx) => (
                                        <div key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center border border-gray-200">
                                            {renderTag(tag)}
                                            <button
                                                type="button"
                                                onClick={() => handleTagActions.remove(renderTag(tag))}
                                                className="ml-1.5 text-gray-500 hover:text-gray-800"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors rounded-md text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-md text-sm font-medium"
                            >
                                {editingId ? "Simpan Perubahan" : "Buat Proyek"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div key={project.tender_id} className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-lg text-gray-800 line-clamp-1">{project.title}</h4>
                                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-xs font-medium">
                                            Terbuka
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        {project.category_id && (
                                            <span className="text-gray-500 text-xs">
                                                {getCategoryName(project.category_id)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-between items-start">
                                        <span className="font-medium text-indigo-600 text-sm">
                                            {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                        </span>
                                        <span className="text-xs text-gray-500">Durasi: {project.max_duration} hari</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {project.deadline && (
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(project.deadline)}
                                            </div>
                                        )}

                                        {project.tags_data?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 max-w-full">
                                                {project.tags_data.slice(0, 2).map((tag, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs whitespace-nowrap">
                                                        {typeof tag === 'object' ? tag.name : tag}
                                                    </span>
                                                ))}
                                                {project.tags_data.length > 2 && (
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">
                                                        +{project.tags_data.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                        <Link
                                            to={`/ProjectDetail/${project.tender_id}`}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Detail <FiArrowRight className="ml-1.5" />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(project.tender_id)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            <FiEdit2 className="mr-1.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.tender_id)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        >
                                            <FiTrash2 className="mr-1.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2 text-gray-800">Belum ada proyek</h4>
                        <p className="text-gray-500 mb-6 max-w-md text-sm">Buat proyek pertama Anda dan mulai terima penawaran dari para freelancer</p>
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-md px-4 py-2 text-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Buat Proyek
                        </button>
                    </div>
                )
            )}
        </div>
      );
};

export default ProjectList;


