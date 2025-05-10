import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";
import { useNavigate, Link } from "react-router-dom";

const ProjectList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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
        tags: []
    });
    const [tagInput, setTagInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectsRes, categoriesRes] = await Promise.all([
                    apiClient.get("/tenders/"),
                    apiClient.get("/categories/") // Assuming this is your categories endpoint
                ]);
                
                setProjects(projectsRes.data?.results || projectsRes.data || []);
                setCategories(categoriesRes.data?.results || categoriesRes.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value
        });
    };

    const handleTagActions = {
        add: () => {
            if (tagInput.trim() && !formData.tags.some(tag =>
                tag.toLowerCase() === tagInput.trim().toLowerCase()
            )) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, tagInput.trim()]
                });
                setTagInput("");
            }
        },
        remove: (tagToRemove) => {
            setFormData({
                ...formData,
                tags: formData.tags.filter(tag => tag !== tagToRemove)
            });
        }
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
            tags: []
        });
        setTagInput("");
        setEditingId(null);
        setIsFormVisible(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form data
        if (formData.min_budget > formData.max_budget) {
            setError("Budget minimal tidak boleh lebih besar dari budget maksimal");
            return;
        }

        if (!formData.category_id) {
            setError("Kategori harus dipilih");
            return;
        }

        try {
            // Format tags sesuai dengan yang diharapkan backend: array of objects dengan properti 'name'
            const formattedTags = formData.tags.map(tag => ({ name: tag }));

            let dataToSend;
            let config = {};

            // Jika ada attachment, gunakan FormData
            if (formData.attachment) {
                const formDataToSend = new FormData();

                const jsonData = {
                    ...formData,
                    tags: formattedTags, // Gunakan formattedTags
                    min_budget: Number(formData.min_budget),
                    max_budget: Number(formData.max_budget),
                    max_duration: Number(formData.max_duration),
                    category_id: formData.category_id,
                    attachment: null // Hapus attachment dari JSON karena akan dikirim terpisah
                };

                formDataToSend.append('json', JSON.stringify(jsonData));
                formDataToSend.append('attachment', formData.attachment);
                dataToSend = formDataToSend;
                config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
            } else {
                // Jika tidak ada attachment, kirim langsung sebagai JSON
                dataToSend = {
                    ...formData,
                    tags: formattedTags, // Gunakan formattedTags
                    min_budget: Number(formData.min_budget),
                    max_budget: Number(formData.max_budget),
                    max_duration: Number(formData.max_duration),
                    category_id: formData.category_id,
                    attachment: null // Explicitly set to null
                };
                config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
            }

            const url = editingId ? `/tenders/${editingId}/` : "/tenders/";
            const method = editingId ? "put" : "post";

            const response = await apiClient[method](url, dataToSend, config);

            resetForm();
            const res = await apiClient.get("/tenders/");
            setProjects(res.data?.results || res.data || []);
        } catch (error) {
            console.error("Error with project:", error);
            console.log("Error response data:", error.response?.data);

            // Handle errors better
            if (error.response?.data) {
                const errorData = error.response.data;

                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData)
                        .map(([field, errors]) => {
                            if (Array.isArray(errors)) {
                                return `${field}: ${errors[0]}`;
                            } else if (typeof errors === 'object' && errors !== null) {
                                return `${field}: ${JSON.stringify(errors)}`;
                            }
                            return `${field}: ${errors}`;
                        })
                        .join(', ');

                    setError(errorMessages || "Validation error occurred");
                } else {
                    setError(error.response.data.toString());
                }
            } else {
                setError("Gagal menyimpan proyek. Coba lagi nanti.");
            }
        }
    };

    const handleEdit = async (id) => {
        try {
            const res = await apiClient.get(`/tenders/${id}/`);
            const project = res.data;

            // Format tags dari backend ke frontend
            let formattedTags = [];
            if (project.tags && Array.isArray(project.tags)) {
                formattedTags = project.tags.map(tag => {
                    // Jika tag berupa object (dari backend), ambil property 'name'
                    // Jika berupa string langsung (fallback), gunakan string tersebut
                    return typeof tag === 'object' ? tag.name : tag;
                });
            }

            setFormData({
                ...project,
                deadline: project.deadline ? project.deadline.split('T')[0] : "",
                category_id: project.category?.id || project.category_id || "",
                tags: formattedTags, // Gunakan formattedTags
                attachment: null // Reset attachment saat edit
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
                const res = await apiClient.get("/tenders/");
                setProjects(res.data?.results || res.data || []);
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

    if (loading) {
        return <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">
                    {isFormVisible ? (editingId ? "Edit Proyek" : "Buat Proyek Baru") : "Proyek Saya"}
                </h3>
                {!isFormVisible && (
                    <button
                        className="bg-blue-500 text-white rounded-lg px-4 py-2"
                        onClick={() => setIsFormVisible(true)}
                    >
                        Buat Proyek
                    </button>
                )}
            </div>

            {isFormVisible ? (
                <div className="bg-white rounded-xl border p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>}

                        <div>
                            <label className="block text-sm font-medium mb-1">Judul Proyek *</label>
                            <input
                                type="text" name="title" value={formData.title}
                                onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                            <textarea
                                name="description" value={formData.description}
                                onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Kategori *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Durasi Maksimal (hari) *</label>
                                <input
                                    type="number" name="max_duration" value={formData.max_duration}
                                    onChange={handleInputChange} min="1" className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Budget Minimal (Rp) *</label>
                                <input
                                    type="number" name="min_budget" value={formData.min_budget}
                                    onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Budget Maksimal (Rp) *</label>
                                <input
                                    type="number" name="max_budget" value={formData.max_budget}
                                    onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Deadline *</label>
                            <input
                                type="date" name="deadline" value={formData.deadline}
                                onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Lampiran</label>
                            <input
                                type="file" name="attachment"
                                onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Tag</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text" value={tagInput} placeholder="Masukkan tag"
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagActions.add())}
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                />
                                <button type="button" onClick={handleTagActions.add}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                    Tambah
                                </button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map((tag, idx) => (
                                        <div key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                                            {typeof tag === 'object' ? tag.name : tag}
                                            <button type="button" onClick={() => handleTagActions.remove(tag)}
                                                className="ml-1 text-blue-700">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button type="button" onClick={resetForm}
                                className="px-4 py-2 border rounded-lg">
                                Batal
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                {editingId ? "Simpan Perubahan" : "Buat Proyek"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.tender_id} className="border rounded-lg p-5 bg-white">
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-semibold text-lg">{project.title}</h4>
                                        <div className="text-sm text-gray-500">
                                            <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'open' ? 'bg-green-100 text-green-600' :
                                                project.status === 'closed' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {project.status === 'open' ? 'Terbuka' :
                                                    project.status === 'closed' ? 'Ditutup' : 'Dalam proses'}
                                            </span>
                                            {project.category_id && (
                                                <span className="ml-2 text-gray-500">
                                                    {getCategoryName(project.category_id)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-blue-500">
                                        {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                    </span>
                                </div>

                                <p className="text-gray-700 my-4 line-clamp-3">{project.description}</p>

                                {project.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 my-3">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                {typeof tag === 'object' ? tag.name : tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between mt-4">
                                    <span className="text-sm">Durasi max: {project.max_duration} hari</span>
                                    <div className="space-x-3">
                                        <button onClick={() => handleEdit(project.tender_id)}
                                            className="text-blue-500 text-sm">Edit</button>
                                        <button onClick={() => handleDelete(project.tender_id)}
                                            className="text-red-500 text-sm">Hapus</button>
                                        <Link to={`/ProjectDetail/${project.tender_id}`}
                                            className="text-blue-500 text-sm">Lihat Detail</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                        <h4 className="text-lg font-medium mb-2">Belum ada proyek aktif</h4>
                        <p className="text-gray-500 mb-6">Mulai proyek baru untuk mencari vendor</p>
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-blue-500 text-white rounded-lg px-6 py-2"
                        >
                            Buat Proyek Baru
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default ProjectList;