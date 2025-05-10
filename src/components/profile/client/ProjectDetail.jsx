import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../../../api/apiService";
import { FiArrowLeft, FiExternalLink, FiClock, FiDollarSign, FiCalendar, FiTag, FiUser, FiMessageCircle, FiCheckCircle } from "react-icons/fi";

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [acceptingBid, setAcceptingBid] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
        const fetchProposals = async () => {
            if (!project) return;

            try {
                setLoadingProposals(true);
                const response = await apiClient.get(`/bids/`);
                // Filter bids for this tender
                const filteredBids = (response.data?.results || response.data || [])
                    .filter(bid => bid.tender == id);
                setProposals(filteredBids);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoadingProposals(false);
            }
        };

        fetchProposals();
    }, [id, project]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!project) return;

            try {
                setLoadingComments(true);
                const response = await apiClient.get(`/tenders/${id}/comments/`);
                setComments(response.data?.results || response.data || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoadingComments(false);
            }
        };

        fetchComments();
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
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                    Terbuka
                </span>;
            case 'closed':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <span className="w-2 h-2 mr-2 rounded-full bg-red-500"></span>
                    Ditutup
                </span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
                    Dalam Proses
                </span>;
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            setSubmittingComment(true);
            await apiClient.post(`tenders/${id}/add_comment/`, {
                comment: comment.trim()
            });

            // Refresh comments
            const response = await apiClient.get(`/tenders/${id}/comments/`);
            setComments(response.data?.results || response.data || []);
            setComment("");

            // Show temporary success message
            setSuccessMessage("Komentar berhasil ditambahkan");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleAcceptBid = async (bidId) => {
        if (!window.confirm("Apakah Anda yakin ingin menerima proposal ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        try {
            setAcceptingBid(true);
            await apiClient.post(`/tenders/${id}/accept_bid/`, {
                bid_id: bidId
            });

            // Update project status
            const updatedProject = { ...project, status: 'closed' };
            setProject(updatedProject);

            // Update the bid status in the proposals array
            const updatedProposals = proposals.map(prop =>
                prop.bid_id === bidId
                    ? { ...prop, status: 'accepted' }
                    : prop
            );
            setProposals(updatedProposals);

            // Show temporary success message
            setSuccessMessage("Proposal berhasil diterima dan proyek telah dibuat");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error accepting bid:", error);
        } finally {
            setAcceptingBid(false);
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
                    <Link to="/tenders" className="inline-flex items-center text-[#5B8CFF] hover:text-[#4a7cff] transition-colors">
                        <FiArrowLeft className="mr-2" />
                        Kembali ke daftar proyek
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 my-20 sm:px-6 lg:px-8 py-8">
            {successMessage && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center z-50 shadow-lg">
                    <FiCheckCircle className="mr-2" />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="mb-6">
                <Link to="/profile-client" className="inline-flex items-center text-[#5B8CFF] hover:text-[#4a7cff] transition-colors mb-6">
                    <FiArrowLeft className="mr-2" />
                    Kembali ke daftar proyek
                </Link>

                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    className="inline-flex items-center px-3 py-2 bg-white bg-opacity-90 rounded-lg text-sm font-medium text-blue-600 hover:bg-opacity-100 transition-all shadow-sm"
                                >
                                    <FiExternalLink className="mr-1" />
                                    Lihat lampiran
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    {getStatusBadge()}
                                    {project.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {project.category.name}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{project.title}</h1>
                                <div className="mt-4 flex items-center">
                                    <div className="flex-shrink-0">
                                        {project.client_picture ? (
                                            <img
                                                src={`http://127.0.0.1:8000/${project.client_picture}`}
                                                alt={project.client_name}
                                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                                                {project.client_name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">Dibuat oleh</p>
                                        <p className="text-sm font-semibold text-gray-900">{project.client_name || "Client"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 sm:p-5 w-full sm:w-auto">
                                <div className="text-lg sm:text-xl font-bold text-blue-600">
                                    {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-600">
                                    <FiClock className="mr-1.5" />
                                    <span>Maks. {project.max_duration} hari</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Detail Proyek</h2>

                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi Proyek</h3>
                                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                            </div>

                            {project.tags?.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Keterampilan yang Dibutuhkan</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {typeof tag === 'object' ? tag.name : tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <FiMessageCircle className="mr-2" />
                                    <span>Komentar</span>
                                </div>
                            </h2>

                            {loadingComments ? (
                                <div className="flex justify-center py-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5B8CFF]"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {comments.length > 0 ? (
                                        comments.map((comment, idx) => (
                                            <div key={idx} className="flex space-x-4">
                                                <div className="flex-shrink-0">
                                                    {comment.user_picture ? (
                                                        <img
                                                            src={comment.user_picture}
                                                            alt={comment.user_name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                                            {comment.user_name?.charAt(0).toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium text-gray-900">{comment.user_name}</h4>
                                                            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                                                        </div>
                                                        <p className="mt-2 text-gray-700">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">Belum ada komentar</p>
                                    )}
                                </div>
                            )}

                            {/* Add Comment Form */}
                            <form onSubmit={handleSubmitComment} className="mt-6 pt-6 border-t border-gray-100">
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tambahkan komentar
                                </label>
                                <div className="flex">
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows="3"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        placeholder="Tulis komentar Anda di sini..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={submittingComment}
                                    ></textarea>
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        disabled={!comment.trim() || submittingComment}
                                    >
                                        {submittingComment ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Mengirim...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiMessageCircle className="mr-2" />
                                                <span>Kirim Komentar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Informasi</h2>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <FiCalendar className="mr-2" />
                                        <span>Deadline Proyek</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{formatDate(project.deadline)}</p>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <FiCalendar className="mr-2" />
                                        <span>Tanggal Dibuat</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{formatDate(project.created_at)}</p>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <FiTag className="mr-2" />
                                        <span>Jumlah Proposal</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{project.bid_count || 0} proposal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {proposals.length > 0 && (
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                Proposal ({proposals.length})
                            </h2>

                            <div className="space-y-6">
                                {proposals.map((proposal) => (
                                    <div key={proposal.bid_id} className="border border-gray-100 rounded-lg p-5 hover:border-blue-200 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    {proposal.vendor_profile?.profile_picture ? (
                                                        <img
                                                            src={`http://127.0.0.1:8000/${proposal.vendor_profile.profile_picture}`}
                                                            alt={proposal.vendor_name}
                                                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                                                            {proposal.vendor_name?.charAt(0).toUpperCase() || "V"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-base font-semibold text-gray-900">{proposal.vendor_name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                        <FiCalendar className="mr-1.5" />
                                                        {formatDate(proposal.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">{formatCurrency(proposal.amount)}</p>
                                                <p className="text-sm text-gray-600 mt-1 flex items-center justify-end">
                                                    <FiClock className="mr-1.5" />
                                                    {proposal.delivery_time} hari
                                                </p>
                                            </div>
                                        </div>
                                        {proposal.proposal && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-gray-700 whitespace-pre-line">{proposal.proposal}</p>
                                            </div>
                                        )}

                                        {/* Accept Bid Button - Only show for clients and when project is open AND proposal is pending */}
                                        {
                                            project.status === 'open' &&
                                            proposal.status === 'pending' && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                                    <button
                                                        onClick={() => handleAcceptBid(proposal.bid_id)}
                                                        disabled={acceptingBid}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        {acceptingBid ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Memproses...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiCheckCircle className="mr-2" />
                                                                <span>Terima Proposal</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                        {/* Show accepted status badge if this bid is accepted */}
                                        {proposal.status === 'accepted' && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FiCheckCircle className="mr-1.5" />
                                                    Proposal Diterima
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;