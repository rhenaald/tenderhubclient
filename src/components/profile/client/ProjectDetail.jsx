import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../../../api/apiService";
import { FiArrowLeft, FiExternalLink, FiClock, FiDollarSign, FiHash, FiCalendar, FiTag, FiUser, FiCheckCircle, FiEdit2, FiTrash2, FiMessageCircle, FiSend } from "react-icons/fi";

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [proposals, setProposals] = useState([]);
    const [acceptingBid, setAcceptingBid] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState("");
    const commentInputRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user_data'));
        setCurrentUser(userData);
    }, []);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await apiClient.get(`/tenders/${id}/`);
                console.log(response.data);
                setProject(response.data);
            } catch (error) {
                setError("Gagal memuat detail proyek");
            }
        };

        fetchProjectData();
    }, [id]);

    useEffect(() => {
        const fetchProposals = async () => {
            if (!project) return;

            try {
                const response = await apiClient.get(`/bids/`);
                const filteredBids = (response.data?.results || response.data || [])
                    .filter(bid => bid.tender == id);
                setProposals(filteredBids);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        };

        fetchProposals();
    }, [id, project]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/comments/`, {
                    params: { tender_id: id }
                });
                const commentsData = response.data?.results || response.data || [];
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (id) {
            fetchComments();
        }
    }, [id]);

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

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const handleAcceptBid = async (bidId) => {
        if (!window.confirm("Apakah Anda yakin ingin menerima proposal ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }

        try {
            setAcceptingBid(true);
            await apiClient.post(`/tenders/${id}/accept_bid/`, {
                bid_id: bidId
            });

            const updatedProject = { ...project, status: 'closed' };
            setProject(updatedProject);

            const updatedProposals = proposals.map(prop =>
                prop.bid_id === bidId
                    ? { ...prop, status: 'accepted' }
                    : prop
            );
            setProposals(updatedProposals);

            setSuccessMessage("Proposal berhasil diterima dan proyek telah dibuat");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error accepting bid:", error);
        } finally {
            setAcceptingBid(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await apiClient.post(`/comments/`, {
                tender_id: parseInt(id),
                content: newComment.trim()
            });

            setComments([...comments, response.data]);
            setNewComment("");
            setSuccessMessage("Komentar berhasil ditambahkan");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;

        try {
            await apiClient.put(`/comments/${commentId}/`, {
                content: editContent
            });

            const updatedComments = comments.map(comment =>
                comment.comment_id === commentId ? { ...comment, content: editContent } : comment
            );

            setComments(updatedComments);
            setEditingComment(null);
            setEditContent("");
            setSuccessMessage("Komentar berhasil diperbarui");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
            return;
        }

        try {
            await apiClient.delete(`/comments/${commentId}/`);
            const updatedComments = comments.filter(comment => comment.comment_id !== commentId);
            setComments(updatedComments);
            setSuccessMessage("Komentar berhasil dihapus");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment.comment_id);
        setEditContent(comment.content);
        setTimeout(() => {
            if (commentInputRef.current) {
                commentInputRef.current.focus();
            }
        }, 0);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditContent("");
    };

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
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Detail Proyek</h2>
                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi Proyek</h3>
                                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                            </div>
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
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <FiMessageCircle className="mr-2" />
                                        <span>Jumlah Komentar</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{comments.length} komentar</p>
                                </div>
                                {project.tags_data && project.tags_data.length > 0 && (
                                    <div>
                                        <div className="flex items-center text-sm text-gray-500 mb-1">
                                            <FiHash className="mr-2" />
                                            <span>Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.tags_data
                                                .filter(tag => tag?.id && tag?.name) // Filter hanya tag yang valid
                                                .map(tag => (
                                                    <span
                                                        key={`tag-${tag.id}`}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        <FiHash className="mr-1" size={12} />
                                                        {tag.name}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
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
                                        <div className="mt-4">
                                            <p className="text-gray-700 whitespace-pre-line">{proposal.cover_letter}</p>
                                        </div>
                                        {proposal.status === 'accepted' ? (
                                            <div className="mt-4 bg-green-50 text-green-700 rounded-lg py-3 px-4 flex items-center">
                                                <FiCheckCircle className="mr-2" />
                                                <span>Proposal ini telah diterima</span>
                                            </div>
                                        ) : project.status === 'open' && (
                                            <div className="mt-4 text-right">
                                                <button
                                                    onClick={() => handleAcceptBid(proposal.bid_id)}
                                                    disabled={acceptingBid}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    <FiCheckCircle className="mr-2" />
                                                    <span>Terima Proposal</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center">
                            <FiMessageCircle className="mr-2" />
                            Komentar ({comments.length})
                        </h2>
                        <div className="mb-6">
                            <form onSubmit={handleAddComment} className="flex">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Tulis komentar Anda..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <FiSend className="mr-2" />
                                    Kirim
                                </button>
                            </form>
                        </div>
                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.comment_id}
                                        className="border border-gray-100 rounded-lg p-4 hover:border-blue-100 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    {comment.user_picture ? (
                                                        <img
                                                            src={`http://127.0.0.1:8000${comment.user_picture}`}
                                                            alt={comment.user_name}
                                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                                            {comment.user_name?.charAt(0).toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-gray-900">{comment.user_name}</p>
                                                    <p className="text-xs text-gray-500">{formatDateTime(comment.created_at)}</p>
                                                </div>
                                            </div>
                                            {currentUser && Number(currentUser.user_id) === Number(comment.user) && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(comment)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.comment_id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            {editingComment === comment.comment_id ? (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        ref={commentInputRef}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <div className="mt-2 flex justify-end space-x-2">
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditComment(comment.comment_id)}
                                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <FiMessageCircle className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-2 text-gray-500">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;