import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";
import { useNavigate, useParams } from "react-router-dom";

const TenderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(isEditing);
    const [categories, setCategories] = useState([]);
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
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesRes = await apiClient.get("/categories/");
                setCategories(categoriesRes.data?.results || categoriesRes.data || []);

                // If editing, fetch tender data
                if (isEditing) {
                    const tenderRes = await apiClient.get(`/tenders/${id}/`);
                    const project = tenderRes.data;

                    setFormData({
                        title: project.title,
                        description: project.description,
                        attachment: null, // Cannot pre-fill file input
                        max_duration: project.max_duration,
                        min_budget: project.min_budget,
                        max_budget: project.max_budget,
                        deadline: project.deadline.split('T')[0],
                        category_id: project.category_id,
                        tags: project.tags || []
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Gagal memuat data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value
        });
    };

    const handleTagActions = {
        add: () => {
            if (tagInput.trim() && !formData.tags.some(tag => tag.name === tagInput.trim())) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, { name: tagInput.trim() }]
                });
                setTagInput("");
            }
        },
        remove: (tagName) => {
            setFormData({
                ...formData,
                tags: formData.tags.filter(tag => tag.name !== tagName)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (formData.min_budget > formData.max_budget) {
            setError("Budget minimal tidak boleh lebih besar dari budget maksimal");
            return;
        }

        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'tags') {
                    formDataToSend.append('tags', JSON.stringify(value));
                } else if (key === 'attachment' && value) {
                    formDataToSend.append('attachment', value);
                } else if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value);
                }
            });

            if (isEditing) {
                await apiClient.put(`/tenders/${id}/`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await apiClient.post("/profile-client/", formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // Redirect back to project list
            navigate('/profile-client');
        } catch (error) {
            console.error("Error with project:", error);
            setError(error.response?.data?.message || "Gagal menyimpan proyek");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    ← Kembali
                </button>
                <h1 className="text-2xl font-semibold">
                    {isEditing ? "Edit Proyek" : "Buat Proyek Baru"}
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Judul Proyek *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Deskripsi *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg min-h-[150px]"
                            required
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Kategori *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Durasi Maksimal (hari) *</label>
                            <input
                                type="number"
                                name="max_duration"
                                value={formData.max_duration}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Budget Minimal (Rp) *</label>
                            <input
                                type="number"
                                name="min_budget"
                                value={formData.min_budget}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Budget Maksimal (Rp) *</label>
                            <input
                                type="number"
                                name="max_budget"
                                value={formData.max_budget}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Deadline *</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Lampiran</label>
                        <input
                            type="file"
                            name="attachment"
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        {isEditing && (
                            <p className="text-sm text-gray-500 mt-1">
                                Biarkan kosong jika tidak ingin mengubah file lampiran.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tag</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={tagInput}
                                placeholder="Masukkan tag"
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagActions.add())}
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleTagActions.add}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Tambah
                            </button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map((tag, idx) => (
                                    <div key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                                        {tag.name}
                                        <button
                                            type="button"
                                            onClick={() => handleTagActions.remove(tag.name)}
                                            className="ml-2 text-blue-700 hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 bg-blue-500 text-white rounded-lg ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                        >
                            {submitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Proyek'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenderForm;