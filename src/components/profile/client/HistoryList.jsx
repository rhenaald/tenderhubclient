import React, { useState, useEffect } from "react";
import { apiClient } from "../../../api/apiService";
import { useNavigate, Link } from "react-router-dom";

const HistoryList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all"); // Filter view: all, in_progress, completed, closed
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectsRes, categoriesRes] = await Promise.all([
                    apiClient.get("/tenders/"),
                    apiClient.get("/categories/")
                ]);

                // Filter untuk hanya menampilkan proyek dengan status in_progress, completed, closed
                const allProjects = projectsRes.data?.results || projectsRes.data || [];
                const historyProjects = allProjects.filter(project =>
                    ["in_progress", "completed", "closed"].includes(project.status)
                );
                setProjects(historyProjects);

                setCategories(categoriesRes.data?.results || categoriesRes.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Gagal memuat data riwayat proyek");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function untuk mendapatkan nama tag
    const getTagName = (tag) => {
        if (typeof tag === 'object' && tag !== null) {
            return tag.name || "";
        }
        return tag || "";
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

    const getStatusLabel = (status) => {
        switch (status) {
            case "in_progress":
                return {
                    text: "Dalam Pengerjaan",
                    classes: "bg-blue-100 text-blue-700"
                };
            case "completed":
                return {
                    text: "Selesai",
                    classes: "bg-green-100 text-green-700"
                };
            case "closed":
                return {
                    text: "Ditutup",
                    classes: "bg-gray-100 text-gray-700"
                };
            default:
                return {
                    text: status,
                    classes: "bg-gray-100 text-gray-700"
                };
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // Filter projects based on active filter
    const filteredProjects = activeFilter === "all"
        ? projects
        : projects.filter(project => project.status === activeFilter);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-2xl text-gray-800">Riwayat Proyek</h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex mb-6 space-x-2 overflow-x-auto pb-2">
                <button
                    onClick={() => handleFilterChange("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => handleFilterChange("in_progress")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "in_progress"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Dalam Pengerjaan
                </button>
                <button
                    onClick={() => handleFilterChange("completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "completed"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Selesai
                </button>
                <button
                    onClick={() => handleFilterChange("closed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "closed"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Ditutup
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredProjects.map((project) => {
                        const statusInfo = getStatusLabel(project.status);

                        return (
                            <div key={project.tender_id} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                                    <div className="mb-3 md:mb-0">
                                        <h4 className="font-bold text-xl text-gray-800 mb-1">{project.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <span className={`${statusInfo.classes} px-3 py-1 rounded-full text-xs font-medium`}>
                                                {statusInfo.text}
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

                                        {project.completed_date && project.status === "completed" && (
                                            <div className="text-sm text-green-600 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Selesai: {formatDate(project.completed_date)}
                                            </div>
                                        )}

                                        {project.tags_data?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags_data.map((tag, idx) => (
                                                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
                                                        {getTagName(tag)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {project.vendor && (
                                            <div className="text-sm text-gray-700 mr-3">
                                                <span className="font-medium">Vendor:</span> {project.vendor.username || project.vendor.name || "Vendor"}
                                            </div>
                                        )}
                                        <Link
                                            to={`/History/${project.tender_id}`}
                                            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-gray-800">Belum ada riwayat proyek</h4>
                    <p className="text-gray-600 mb-8 max-w-md">
                        {activeFilter === "all"
                            ? "Proyek yang dalam pengerjaan, selesai, atau ditutup akan muncul di sini"
                            : `Belum ada proyek dengan status "${getStatusLabel(activeFilter).text}"`
                        }
                    </p>
                    <Link
                        to="/profile-client"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Kembali ke Proyek Saya
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HistoryList;