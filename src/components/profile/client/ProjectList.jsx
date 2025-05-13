import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";
import { useNavigate, Link } from "react-router-dom";

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

    console.log(projects);

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
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value
        });
    };

    // Helper function untuk konsistensi format tag
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
        if (formData.min_budget > formData.max_budget) {
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

    const prepareFormData = (preparedTags) => {
        if (formData.attachment) {
            const formDataToSend = new FormData();

            // Menambahkan field-field dasar
            Object.entries({
                'title': formData.title,
                'description': formData.description,
                'max_duration': formData.max_duration,
                'min_budget': formData.min_budget,
                'max_budget': formData.max_budget,
                'deadline': formData.deadline,
                'category_id': formData.category_id
            }).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Menambahkan tags dalam format JSON dengan key "tags" bukan "tags_data"
            formDataToSend.append('tags', JSON.stringify(preparedTags));

            // Menambahkan attachment jika ada
            formDataToSend.append('attachment', formData.attachment);

            return formDataToSend;
        } else {
            return {
                title: formData.title,
                description: formData.description,
                max_duration: Number(formData.max_duration),
                min_budget: Number(formData.min_budget),
                max_budget: Number(formData.max_budget),
                deadline: formData.deadline,
                category_id: formData.category_id,
                tags: preparedTags  // Ubah dari tags_data menjadi tags
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form
        if (!validateForm()) {
            return;
        }

        try {
            // Format tags data sesuai format yang diharapkan API [{"name": "string"}]
            const preparedTags = formData.tags_data.map(tag => ({
                name: typeof tag === 'object' ? tag.name : tag
            }));

            const dataToSend = prepareFormData(preparedTags);
            const headers = {
                'Content-Type': formData.attachment ? 'multipart/form-data' : 'application/json'
            };

            if (editingId) {
                await apiClient.put(`/tenders/${editingId}/`, dataToSend, { headers });
            } else {
                await apiClient.post("/tenders/", dataToSend, { headers });
            }

            resetForm();
            await refreshProjects();

        } catch (error) {
            console.error("Error submitting project:", error);
            handleSubmitError(error);
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
                attachment: null
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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-2xl text-gray-800">
                    {isFormVisible ? (editingId ? "Edit Proyek" : "Buat Proyek Baru") : "Proyek Saya"}
                </h3>
                {!isFormVisible && (
                    <button
                        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-5 py-2.5 font-medium shadow-sm"
                        onClick={() => setIsFormVisible(true)}
                    >
                        + Buat Proyek
                    </button>
                )}
            </div>

            {isFormVisible ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 whitespace-pre-line">
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(category => (
                                    <option key={category.id || category.category_id} value={category.id || category.category_id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi Maksimal (hari) *</label>
                                <input
                                    type="number"
                                    name="max_duration"
                                    value={formData.max_duration}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Minimal (Rp) *</label>
                                <input
                                    type="number"
                                    name="min_budget"
                                    value={formData.min_budget}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Maksimal (Rp) *</label>
                                <input
                                    type="number"
                                    name="max_budget"
                                    value={formData.max_budget}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lampiran</label>
                            <input
                                type="file"
                                name="attachment"
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            {formData.attachment && (
                                <p className="text-sm mt-1 text-gray-600">File terpilih: {formData.attachment.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                            <div className="flex space-x-2">
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
                                            e.target.value = ""; // Reset selection after adding
                                        }
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="">Pilih Tag</option>
                                    {tags.map(tag => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.tags_data.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags_data.map((tag, idx) => (
                                        <div key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center border border-blue-100">
                                            {renderTag(tag)}
                                            <button
                                                type="button"
                                                onClick={() => handleTagActions.remove(renderTag(tag))}
                                                className="ml-1.5 text-blue-700 hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-medium shadow-sm"
                            >
                                {editingId ? "Simpan Perubahan" : "Buat Proyek"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                projects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((project) => (
                            <div key={project.tender_id} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                                    <div className="mb-3 md:mb-0">
                                        <h4 className="font-bold text-xl text-gray-800 mb-1">{project.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Terbuka
                                            </span>
                                            {project.category_id && (
                                                <span className="text-gray-600 flex items-center">
                                                    <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                    {getCategoryName(project.category_id)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-lg text-blue-600">
                                            {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">Durasi: {project.max_duration} hari</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 my-4 line-clamp-3">{project.description}</p>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        {project.deadline && (
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Deadline: {formatDate(project.deadline)}
                                            </div>
                                        )}

                                        {project.tags_data?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags_data.map((tag, idx) => (
                                                    <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                                                        {typeof tag === 'object' ? tag.name : tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Link
                                            to={`/ProjectDetail/${project.tender_id}`}
                                            className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors rounded-lg text-sm font-medium"
                                        >
                                            Detail
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(project.tender_id)}
                                            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-lg text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.tender_id)}
                                            className="px-4 py-1.5 bg-red-50 hover:bg-red-100 transition-colors text-red-600 rounded-lg text-sm font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-gray-800">Belum ada proyek</h4>
                        <p className="text-gray-600 mb-8 max-w-md">Buat proyek pertama Anda dan mulai terima penawaran dari para freelancer</p>
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-6 py-3 font-medium shadow-sm"
                        >
                            + Buat Proyek
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default ProjectList;