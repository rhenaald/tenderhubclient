import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/apiService";

// Custom hook for user data

const useUserData = () => {
    const getUserData = () => {
        try {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    };

    const userData = getUserData();
    return {
        userData,
        isClient: userData?.user_type === 'client',
        isVendor: userData?.user_type === 'vendor',
        userId: userData?.user_id
    };
};

// Review Form Component with comprehensive fixes
const ReviewForm = ({ project, revieweeId, projectStatus, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        if (!revieweeId) {
            setError("No reviewee specified");
            return;
        }

        if (!project) {
            setError("No project specified");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log("Submitting review with data:", {
                reviewee: revieweeId,
                rating,
                comment,
                project: project
            });

            const reviewData = {
                reviewee: String(revieweeId),
                rating: rating,
                comment: comment,
                project: String(project)
            };

            const response = await apiClient.post('/users/reviews/', reviewData);

            setRating(0);
            setComment("");
            onReviewSubmit();
        } catch (err) {
            console.error("Error submitting review:", err);

            if (err.response?.data) {
                console.log("Error response data:", err.response.data);

                if (typeof err.response.data === 'object') {
                
                    const errorMessage = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join(', ');
                    setError(errorMessage || "Failed to submit review");
                } else if (typeof err.response.data === 'string') {
                    // Handle case where API returns error as string
                    setError(err.response.data);
                } else {
                    setError("Failed to submit review: " + err.message);
                }
            } else {
                setError("Failed to submit review. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Leave a Review</h3>
            {error && (
                <div className="mb-2 text-sm text-red-600 p-2 bg-red-50 rounded">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows="3"
                        placeholder="Share your experience working on this project"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || projectStatus !== 'completed'}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${projectStatus !== 'completed' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                {projectStatus !== 'completed' && (
                    <p className="text-xs text-gray-500 mt-2">You can only submit a review after project completion.</p>
                )}
            </form>
        </div>
    );
};
// Activity item component
const ActivityItem = ({ activity, formatDate }) => {
    // Helper to render activity icon based on type
    const getActivityIcon = (type) => {
        const iconClass = "w-6 h-6 flex items-center justify-center rounded-full";
        switch (type) {
            case 'deadline_change':
            case 'update_deadline':
                return <div className={`${iconClass} bg-blue-100 text-blue-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>;
            case 'price_change':
            case 'update_price':
                return <div className={`${iconClass} bg-green-100 text-green-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>;
            case 'project_completion':
                return <div className={`${iconClass} bg-purple-100 text-purple-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>;
            case 'delivery':
                return <div className={`${iconClass} bg-yellow-100 text-yellow-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>;
            case 'revision_request':
            case 'request_revision':
                return <div className={`${iconClass} bg-red-100 text-red-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>;
            default:
                return <div className={`${iconClass} bg-gray-100 text-gray-600`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>;
        }
    };

    // Helper to get a user-friendly activity title
    const getActivityTitle = (activity) => {
        if (!activity.activity_type) return 'Activity';

        const titles = {
            'deadline_change': 'Deadline Updated',
            'price_change': 'Price Updated',
            'delivery': 'Project Delivered',
            'revision_request': 'Revision Requested',
            'comment': 'Comment Added',
            'project_completion': 'Project Completed',
        };

        return titles[activity.activity_type] || 'Activity';
    };

    // Prepare the user picture URL
    const userPicture = activity.user_picture || null;

    return (
        <div className="border-l-2 border-gray-200 pl-4 py-3 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start space-x-3">
                <div className="mt-1">
                    {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900">{getActivityTitle(activity)}</p>
                        <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(activity.created_at)}
                        </p>
                    </div>
                    <p className="text-gray-700 text-sm">{activity.description}</p>
                    {activity.attachment && (
                        <a
                            href={activity.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            View Attachment
                        </a>
                    )}
                    {(activity.activity_type === 'price_change' || activity.activity_type === 'update_price') && activity.new_price && (
                        <div className="mt-1 flex items-center text-xs">
                            <span className="text-gray-500 mr-1">New price:</span>
                            <span className="font-medium text-green-600">
                                ${parseFloat(activity.new_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            {activity.old_price && (
                                <>
                                    <span className="text-gray-500 mx-1">from</span>
                                    <span className="font-medium text-gray-600 line-through">
                                        ${parseFloat(activity.old_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    {(activity.activity_type === 'deadline_change' || activity.activity_type === 'update_deadline') && activity.new_deadline && (
                        <div className="mt-1 flex items-center text-xs">
                            <span className="text-gray-500 mr-1">New deadline:</span>
                            <span className="font-medium text-blue-600">
                                {formatDate(activity.new_deadline)}
                            </span>
                            {activity.old_deadline && (
                                <>
                                    <span className="text-gray-500 mx-1">from</span>
                                    <span className="font-medium text-gray-600 line-through">
                                        {formatDate(activity.old_deadline)}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                        <div className="flex items-center">
                            {userPicture && (
                                <img
                                    src={userPicture}
                                    alt={activity.user_name}
                                    className="w-4 h-4 rounded-full mr-1 object-cover"
                                />
                            )}
                            <span>By: {activity.user_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Action form component
const ActionForm = ({
    project,
    projectStatus,
    isClient,
    isVendor,
    onActionComplete
}) => {
    const [selectedAction, setSelectedAction] = useState("comment");
    const [actionDescription, setActionDescription] = useState("");
    const [actionAttachment, setActionAttachment] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAvailableActions = () => {
        const actions = [{ value: 'comment', label: 'Add Comment' }];

        if (isClient) {
            if (projectStatus === "in_progress" || projectStatus === "delivered") {
                actions.push({ value: 'request_revision', label: 'Request Revision' });
            }

            if (projectStatus === "delivered") {
            }
            actions.push({ value: 'complete_project', label: 'Mark as Complete' });

            actions.push({ value: 'update_price', label: 'Update Price' });
            actions.push({ value: 'update_deadline', label: 'Update Deadline' });
        }

        if (isVendor) {
            if (projectStatus === "in_progress" || projectStatus === "revision_requested") {
                actions.push({ value: 'deliver_project', label: 'Deliver Project' });
            }
        }

        return actions;
    };

    const resetForm = () => {
        setActionDescription("");
        setActionAttachment(null);
        setNewPrice("");
        setNewDeadline("");
        setError(null);
        const fileInput = document.getElementById('activity-file-input');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmitAction = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate inputs
        if (selectedAction === 'update_price' && !newPrice) {
            setError("Please enter a new price");
            return;
        }

        if (selectedAction === 'update_deadline' && !newDeadline) {
            setError("Please select a new deadline");
            return;
        }

        if (selectedAction === 'deliver_project' && !actionAttachment) {
            setError("Please attach project files");
            return;
        }

        if (selectedAction !== 'update_price' && selectedAction !== 'update_deadline' && !actionDescription.trim()) {
            setError("Please enter a description");
            return;
        }

        setActionLoading(true);

        try {
            let endpoint, data, config = {};

            switch (selectedAction) {
                case 'comment':
                    endpoint = `/projects/${project}/activities/`;
                    data = new FormData();
                    data.append("activity_type", "comment");
                    data.append("description", actionDescription);
                    if (actionAttachment) {
                        data.append("attachment", actionAttachment);
                    }
                    break;

                case 'request_revision':
                    endpoint = `/projects/${project}/request_revision/`;
                    data = { description: actionDescription };
                    break;

                case 'deliver_project':
                    endpoint = `/projects/${project}/deliver_project/`;
                    data = new FormData();
                    data.append("description", actionDescription);
                    data.append("attachment", actionAttachment);
                    break;

                case 'complete_project':
                    endpoint = `/projects/${project}/complete_project/`;
                    data = { description: actionDescription };
                    break;

                case 'update_price':
                    endpoint = `/projects/${project}/update_price/`;
                    data = { new_price: parseFloat(newPrice) };
                    break;

                case 'update_deadline':
                    endpoint = `/projects/${project}/update_deadline/`;
                    data = { new_deadline: newDeadline };
                    break;

                default:
                    throw new Error("Invalid action type");
            }

            // Make API request
            const response = await apiClient.post(
                endpoint,
                data,
                selectedAction === 'comment' || selectedAction === 'deliver_project'
                    ? { headers: { 'Content-Type': 'multipart/form-data' } }
                    : {}
            );

            resetForm();
            onActionComplete();

        } catch (err) {
            console.error(`Error performing ${selectedAction}:`, err);
            let errorMessage = "Failed to complete action. Please try again.";

            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    errorMessage = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join(', ');
                } else {
                    errorMessage = err.response.data;
                }
            }

            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const availableActions = getAvailableActions();
    const isSubmitDisabled = actionLoading ||
        (selectedAction !== 'update_price' && selectedAction !== 'update_deadline' && !actionDescription.trim()) ||
        (selectedAction === 'update_price' && !newPrice) ||
        (selectedAction === 'update_deadline' && !newDeadline) ||
        (selectedAction === 'deliver_project' && !actionAttachment);

    const getButtonText = () => {
        if (actionLoading) return "Processing...";
        switch (selectedAction) {
            case 'comment': return "Post Comment";
            case 'deliver_project': return "Deliver Project";
            case 'request_revision': return "Request Revision";
            case 'complete_project': return "Complete Project";
            case 'update_price': return "Update Price";
            case 'update_deadline': return "Update Deadline";
            default: return "Submit";
        }
    };

    return (
        <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            {error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-100">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmitAction}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Action</label>
                    <select
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        {availableActions.map(action => (
                            <option key={action.value} value={action.value}>
                                {action.label}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedAction !== 'update_price' && selectedAction !== 'update_deadline' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {selectedAction === 'deliver_project' ? 'Delivery Description' :
                                selectedAction === 'request_revision' ? 'Revision Details' :
                                    selectedAction === 'complete_project' ? 'Completion Notes' :
                                        'Comment'}
                        </label>
                        <textarea
                            value={actionDescription}
                            onChange={(e) => setActionDescription(e.target.value)}
                            placeholder="Enter your details here"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows="3"
                        />
                    </div>
                )}

                {(selectedAction === 'deliver_project' || selectedAction === 'comment') && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachment {selectedAction === 'deliver_project' && '(Required)'}
                        </label>
                        <input
                            id="activity-file-input"
                            type="file"
                            onChange={(e) => setActionAttachment(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required={selectedAction === 'deliver_project'}
                        />
                    </div>
                )}

                {selectedAction === 'update_price' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Price ($)</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md text-sm"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                )}

                {selectedAction === 'update_deadline' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Deadline</label>
                        <input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {getButtonText()}
                </button>
            </form>
        </div>
    );
};

// Project details component with fixes
// Improved ProjectDetails component with better reviewee handling
const ProjectDetails = ({ project, formatDate, isClient, isVendor, userId, fetchProjectData }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);


    const fetchReviews = useCallback(async () => {
        try {
            setLoadingReviews(true);
            const response = await apiClient.get(`/users/reviews/?project=${project.project_id}`);
            setReviews(response.data.results || response.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            console.log('Error details:', err.response);
        } finally {
            setLoadingReviews(false);
        }
    }, [project.project_id]);

    useEffect(() => {
        if (project.status === 'completed') {
            fetchReviews();
        }
    }, [project.status, fetchReviews]);

    const handleReviewSubmit = () => {
        setShowReviewForm(false);
        fetchReviews();
    };

    const getRevieweeId = () => {
        if (isClient) {
            const vendorId = project.vendor_id || project.vendor;
            return vendorId;
        }

        if (isVendor) {
            const clientId = project.client_id || project.client;
            return clientId;
        }

        console.log("Could not determine reviewee - user is neither client nor vendor");
        return null;
    };

    // Check if the current user has already submitted a review
    const hasReviewed = reviews.some(review => review.reviewer === userId || review.reviewer === String(userId));

    return (
        <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'delivered' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'revision_requested' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'}`}
                >
                    {project.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
                <p className="text-sm text-gray-900">{project.client_name}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Vendor</p>
                <p className="text-sm text-gray-900">{project.vendor_name}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Agreed Amount</p>
                <p className="text-sm text-gray-900">
                    ${project.agreed_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-sm text-gray-900">{formatDate(project.start_date)}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Deadline</p>
                <p className="text-sm text-gray-900">{formatDate(project.deadline)}</p>
            </div>

            {/* Reviews Section */}
            {project.status === 'completed' && (
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Reviews</h3>

                    {loadingReviews ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-gray-100 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-xs text-gray-500">
                                            by {review.reviewer_name}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Review Form Toggle - Only show if user hasn't reviewed and project is completed */}
                    {!hasReviewed && project.status === 'completed' && (isClient || isVendor) && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                        </button>
                    )}

                    {/* Review Form */}
                    {showReviewForm && !hasReviewed && project.status === 'completed' && (
                        <ReviewForm
                            project={project.project_id} // Ensure we use the correct project ID
                            revieweeId={getRevieweeId()}
                            projectStatus={project.status}
                            onReviewSubmit={handleReviewSubmit}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

// Main component
const ActiveProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isClient, isVendor, userId } = useUserData();

    const [project, setProject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to format date in a more readable way
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchProjectData = useCallback(async () => {
        try {
            const [projectRes, activitiesRes] = await Promise.all([
                apiClient.get(`/projects/${id}/`),
                apiClient.get(`/projects/${id}/activities/`)
            ]);

            setProject(projectRes.data);

            // Handle activities data format - ensure we're working with a consistent array format
            let activitiesData;
            if (Array.isArray(activitiesRes.data)) {
                activitiesData = activitiesRes.data;
            } else if (activitiesRes.data.results && Array.isArray(activitiesRes.data.results)) {
                activitiesData = activitiesRes.data.results;
            } else if (typeof activitiesRes.data === 'object') {
                // If it's an object with numeric keys, convert to array
                activitiesData = Object.values(activitiesRes.data).filter(item => typeof item === 'object');
            } else {
                activitiesData = [];
            }

            setActivities(activitiesData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching project data:", err);
            setError(err.message || "Failed to load project data");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    if (loading) return (
        <div className="p-4 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
    );

    if (error) return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
                Error: {error}
            </div>
        </div>
    );

    if (!project) return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto p-4 text-yellow-700 bg-yellow-50 rounded-lg border border-yellow-200">
                Project not found.
            </div>
        </div>
    );

    return (
        <div className="p-4 my-20 max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
            </button>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-900">{project.tender_title}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
                            <ProjectDetails
                                project={project}
                                formatDate={formatDate}
                                isClient={isClient}
                                isVendor={isVendor}
                                userId={userId}
                                fetchProjectData={fetchProjectData}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Actions</h2>
                            <ActionForm
                                project={id}
                                projectStatus={project.status}
                                isClient={isClient}
                                isVendor={isVendor}
                                onActionComplete={fetchProjectData}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h2>
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No activities recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {activities
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map((activity, index) => (
                                        <ActivityItem
                                            key={activity.id || index}
                                            activity={activity}
                                            formatDate={formatDate}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveProjectDetail;