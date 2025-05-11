import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../../../api/apiService";
import { FiArrowLeft, FiExternalLink, FiClock, FiDollarSign, FiCalendar, FiTag, FiUser, FiCheckCircle, FiFileText } from "react-icons/fi";

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [acceptedBids, setAcceptedBids] = useState([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/tenders/${id}/`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project details:", error);
                setError("Gagal memuat detail proyek");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    useEffect(() => {
        const fetchAcceptedBids = async () => {
            if (!project) return;

            try {
                const response = await apiClient.get(`/bids/`);
                const acceptedBidsData = (response.data?.results || response.data || [])
                    .filter(bid => bid.tender == id && bid.status === "accepted");
                setAcceptedBids(acceptedBidsData);
            } catch (error) {
                console.error("Error fetching accepted bids:", error);
            }
        };

        fetchAcceptedBids();
    }, [id, project]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount).replace('Rp', 'Rp ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const getStatusBadge = () => {
        switch (project.status) {
            case 'open':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    <span className="w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                    Terbuka
                </span>;
            case 'closed':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                    <span className="w-2 h-2 mr-2 rounded-full bg-red-500"></span>
                    Ditutup
                </span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
                    Dalam Proses
                </span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5B8CFF]"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error || "Project tidak ditemukan"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link to="/profile-client" className="inline-flex items-center text-[#5B8CFF] hover:text-[#4a7cff] transition-colors">
                        <FiArrowLeft className="mr-2" />
                        Kembali ke daftar proyek
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 my-20 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <Link to="/tenders" className="inline-flex items-center text-[#5B8CFF] hover:text-[#4a7cff] transition-colors mb-6">
                    <FiArrowLeft className="mr-2" />
                    Kembali ke daftar proyek
                </Link>

                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    {project.attachment && (
                        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-blue-600">
                            <img
                                src={project.attachment}
                                alt="Lampiran Proyek"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute bottom-4 right-4">
                                <a
                                    href={project.attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-90 rounded-lg text-sm font-medium text-blue-600 hover:bg-opacity-100 transition-all shadow-md hover:shadow-lg"
                                >
                                    <FiExternalLink className="mr-2" />
                                    Lihat lampiran
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    {getStatusBadge()}
                                    {project.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {project.category.name}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

                                <div className="flex items-center bg-gray-50 rounded-lg p-3 w-fit">
                                    <div className="flex-shrink-0">
                                        {project.client_picture ? (
                                            <img
                                                src={`http://127.0.0.1:8000/${project.client_picture}`}
                                                alt={project.client_name}
                                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                                                {project.client_name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-gray-500">Dibuat oleh</p>
                                        <p className="text-sm font-semibold text-gray-900">{project.client_name || "Client"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 w-full sm:w-auto shadow-md">
                                <div className="text-lg sm:text-xl font-bold text-white">
                                    {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-blue-100">
                                    <FiClock className="mr-1.5" />
                                    <span>Maks. {project.max_duration} hari</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                                <FiFileText className="text-blue-500 mr-3 text-xl" />
                                <h2 className="text-xl font-bold text-gray-900">Detail Proyek</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi Proyek</h3>
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.description}</p>
                                </div>

                                {project.tags?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Keterampilan yang Dibutuhkan</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200">
                                                    {typeof tag === 'object' ? tag.name : tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Accepted Bids Section */}
                    {acceptedBids.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                                    <FiCheckCircle className="text-green-500 mr-3 text-xl" />
                                    <h2 className="text-xl font-bold text-gray-900">Proposal yang Diterima</h2>
                                </div>

                                <div className="space-y-5">
                                    {acceptedBids.map((bid) => (
                                        <div key={bid.bid_id} className="border border-green-100 rounded-lg p-5 bg-green-50 shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        {bid.vendor_profile?.profile_picture ? (
                                                            <img
                                                                src={`http://127.0.0.1:8000/${bid.vendor_profile.profile_picture}`}
                                                                alt={bid.vendor_name}
                                                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm">
                                                                {bid.vendor_name?.charAt(0).toUpperCase() || "V"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4 className="text-base font-semibold text-gray-900">{bid.vendor_name}</h4>
                                                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                            <FiCalendar className="mr-1.5" />
                                                            {formatDate(bid.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">{formatCurrency(bid.amount)}</p>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center justify-end">
                                                        <FiClock className="mr-1.5" />
                                                        {bid.delivery_time} hari
                                                    </p>
                                                </div>
                                            </div>

                                            {bid.proposal && (
                                                <div className="mt-4 pt-4 border-t border-green-200">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Proposal:</h5>
                                                    <p className="text-gray-700 whitespace-pre-line">{bid.proposal}</p>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-green-200 flex justify-end">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <FiCheckCircle className="mr-1.5" />
                                                    Proposal Diterima
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Information Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-6">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                                <FiCalendar className="text-blue-500 mr-3 text-xl" />
                                <h2 className="text-xl font-bold text-gray-900">Informasi Proyek</h2>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                        <FiCalendar className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Deadline Proyek</p>
                                        <p className="text-gray-900 font-medium">{formatDate(project.deadline)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                        <FiCalendar className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tanggal Dibuat</p>
                                        <p className="text-gray-900 font-medium">{formatDate(project.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                        <FiTag className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Jumlah Proposal</p>
                                        <p className="text-gray-900 font-medium">{project.bid_count || 0} proposal</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                        <FiDollarSign className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Anggaran</p>
                                        <p className="text-gray-900 font-medium">
                                            {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                        <FiClock className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Durasi Maksimum</p>
                                        <p className="text-gray-900 font-medium">{project.max_duration} hari</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;