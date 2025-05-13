import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../../../api/apiService";
import {
    FiArrowLeft, FiExternalLink, FiClock, FiDollarSign,
    FiHash, FiCalendar, FiTag, FiUser, FiCheckCircle,
    FiEdit2, FiTrash2, FiMessageCircle, FiSend, FiX
} from "react-icons/fi";

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
                setProject(response.data);
            } catch (error) {
                setError("Failed to load project details");
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
        if (id) fetchComments();
    }, [id]);

    // Helper functions remain the same
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
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Open
                </span>;
            case 'closed':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
                    Closed
                </span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                    In Progress
                </span>;
        }
    };

    // Handler functions remain the same
    const handleAcceptBid = async (bidId) => {
        if (!window.confirm("Are you sure you want to accept this proposal? This action cannot be undone.")) return;
        try {
            setAcceptingBid(true);
            await apiClient.post(`/tenders/${id}/accept_bid/`, { bid_id: bidId });
            const updatedProject = { ...project, status: 'closed' };
            setProject(updatedProject);
            const updatedProposals = proposals.map(prop =>
                prop.bid_id === bidId ? { ...prop, status: 'accepted' } : prop
            );
            setProposals(updatedProposals);
            setSuccessMessage("Proposal accepted successfully");
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
            setSuccessMessage("Comment added successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await apiClient.put(`/comments/${commentId}/`, { content: editContent });
            const updatedComments = comments.map(comment =>
                comment.comment_id === commentId ? { ...comment, content: editContent } : comment
            );
            setComments(updatedComments);
            setEditingComment(null);
            setEditContent("");
            setSuccessMessage("Comment updated successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await apiClient.delete(`/comments/${commentId}/`);
            const updatedComments = comments.filter(comment => comment.comment_id !== commentId);
            setComments(updatedComments);
            setSuccessMessage("Comment deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment.comment_id);
        setEditContent(comment.content);
        setTimeout(() => commentInputRef.current?.focus(), 0);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditContent("");
    };

    if (error || !project) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
                            <FiX className="h-6 w-6 text-rose-600" />
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">{error || "Project not found"}</h3>
                        <div className="mt-6">
                            <Link
                                to="/tenders"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back to projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 my-20 sm:px-6 lg:px-8 py-8">
            {/* Success Notification */}
            {successMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center z-50 shadow-lg animate-slide-down-then-fade">
                    <FiCheckCircle className="mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{successMessage}</span>
                    <button
                        onClick={() => setSuccessMessage('')}
                        className="ml-4 p-1 rounded-full hover:bg-green-50 transition-colors"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Back Button */}
            <div className="mb-8">
                <Link
                    to="/profile-client"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group text-sm font-medium"
                >
                    <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to projects
                </Link>
            </div>

            {/* Project Header */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Project Image */}
                    {project.attachment && (
                        <div className="w-full md:w-1/3 lg:w-2/5 rounded-xl overflow-hidden bg-gray-50 aspect-video">
                            <img
                                src={project.attachment}
                                alt="Project attachment"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}

                    {/* Project Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            {getStatusBadge()}
                            {project.category && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                    {project.category.name}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-shrink-0">
                                {project.client_picture ? (
                                    <img
                                        src={`http://127.0.0.1:8000/${project.client_picture}`}
                                        alt={project.client_name}
                                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                        {project.client_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Posted by</p>
                                <p className="text-sm font-semibold text-gray-900">{project.client_name || "Client"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Budget</p>
                                <p className="font-semibold text-gray-900">
                                    {formatCurrency(project.min_budget)} - {formatCurrency(project.max_budget)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Duration</p>
                                <p className="font-semibold text-gray-900">Max {project.max_duration} days</p>
                            </div>
                        </div>

                        {project.attachment && (
                            <a
                                href={project.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                <FiExternalLink className="mr-2" />
                                View attachment
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Project Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Project Description */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
                        <div className="prose prose-sm max-w-none text-gray-700">
                            <p className="whitespace-pre-line">{project.description}</p>
                        </div>
                    </div>

                    {/* Proposals Section */}
                    {proposals.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Proposals ({proposals.length})</h2>
                            <div className="space-y-4">
                                {proposals.map((proposal) => (
                                    <div
                                        key={proposal.bid_id}
                                        className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group relative"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-shrink-0">
                                                {proposal.vendor_profile?.profile_picture ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/${proposal.vendor_profile.profile_picture}`}
                                                        alt={proposal.vendor_name}
                                                        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                        {proposal.vendor_name?.charAt(0).toUpperCase() || "V"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div>
                                                        <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {proposal.vendor_name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Submitted on {formatDate(proposal.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-blue-600">{formatCurrency(proposal.amount)}</p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Delivery in {proposal.delivery_time} days
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-gray-700 text-sm">{proposal.cover_letter}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {proposal.status === 'accepted' ? (
                                            <div className="mt-4 bg-emerald-50 text-emerald-600 rounded-lg py-2 px-3 flex items-center text-sm">
                                                <FiCheckCircle className="mr-2 flex-shrink-0" />
                                                <span>This proposal has been accepted</span>
                                            </div>
                                        ) : project.status === 'open' && (
                                            <div className="mt-4 text-right">
                                                <button
                                                    onClick={() => handleAcceptBid(proposal.bid_id)}
                                                    disabled={acceptingBid}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <FiCheckCircle className="mr-2" />
                                                    <span>Accept Proposal</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Project Info */}
                <div className="lg:col-span-1 space-y-6 sticky top-6 h-fit">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Project Deadline</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(project.deadline)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Posted Date</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(project.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Proposals Count</p>
                                <p className="text-sm font-medium text-gray-900">{project.bid_count || 0} proposals</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Comments Count</p>
                                <p className="text-sm font-medium text-gray-900">{comments.length} comments</p>
                            </div>
                            {project.tags_data && project.tags_data.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags_data
                                            .filter(tag => tag?.id && tag?.name)
                                            .map(tag => (
                                                <span
                                                    key={`tag-${tag.id}`}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <FiMessageCircle className="mr-2" />
                            Comments ({comments.length})
                        </h2>

                        <form onSubmit={handleAddComment} className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <FiSend className="mr-2" />
                                    Post
                                </button>
                            </div>
                        </form>

                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.comment_id}
                                        className="p-4 rounded-lg border border-gray-100 hover:shadow-xs transition-all"
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
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
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
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.comment_id)}
                                                        className="text-gray-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-50"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            {editingComment === comment.comment_id ? (
                                                <div className="mt-2 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        ref={commentInputRef}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditComment(comment.comment_id)}
                                                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 text-sm">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <FiMessageCircle className="mx-auto h-8 w-8 text-gray-300" />
                                <p className="mt-2 text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;