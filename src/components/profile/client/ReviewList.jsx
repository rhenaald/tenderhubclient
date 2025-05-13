import React, { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp, MessageSquare, User } from "lucide-react";
import { apiClient } from "../../../api/apiService";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState({});
    const [expandedReview, setExpandedReview] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/users/reviews/");

                const reviewsData = response.data.results || [];
                setReviews(reviewsData);

                const userIds = [...new Set(reviewsData.map(review => review.reviewee))];
                await fetchUserDetails(userIds);

                const projectIds = [...new Set(reviewsData.map(review => review.project))];
                await fetchProjectDetails(projectIds);

            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const fetchUserDetails = async (userIds) => {
        const userDetailsObj = {};

        for (const userId of userIds) {
            try {
                const response = await apiClient.get(`/users/${userId}/`);
                userDetailsObj[userId] = response.data;
            } catch (err) {
                console.error(`Failed to fetch details for user ${userId}:`, err);
            }
        }

        setUserDetails(userDetailsObj);
    };

    const fetchProjectDetails = async (projectIds) => {
        const projectDetailsObj = {};

        for (const projectId of projectIds) {
            try {
                const response = await apiClient.get(`/projects/${projectId}/`);
                projectDetailsObj[projectId] = response.data;
            } catch (err) {
                console.error(`Failed to fetch details for project ${projectId}:`, err);
                try {
                    const altResponse = await apiClient.get(`/projects/details/${projectId}/`);
                    projectDetailsObj[projectId] = altResponse.data;
                } catch (altErr) {
                    console.error(`Failed to fetch project details from alternative endpoint for ${projectId}:`, altErr);
                }
            }
        }

        setProjectDetails(projectDetailsObj);
    };

    const getRevieweeName = (review) => {
        if (review.reviewee_name) return review.reviewee_name;
        if (userDetails[review.reviewee]?.name) return userDetails[review.reviewee].name;

        const project = projectDetails[review.project];
        if (project) {
            if (project.client && project.client.toString() === review.reviewee.toString() && project.client_name) {
                return project.client_name;
            }
            if (project.vendor && project.vendor.toString() === review.reviewee.toString() && project.vendor_name) {
                return project.vendor_name;
            }
        }
        return `User #${review.reviewee}`;
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={18}
                className={`transition-colors ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
            />
        ));
    };

    const toggleExpandReview = (id) => {
        setExpandedReview(expandedReview === id ? null : id);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-blue-500 font-semibold animate-pulse">Loading...</div>
                </div>
            </div>
        </div>
    );


    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="inline-flex items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-red-500">⚠️ Error: {error}</span>
                </div>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="p-10 text-center">
                <div className="inline-flex flex-col items-center p-6 bg-gray-50 rounded-xl max-w-md mx-auto">
                    <MessageSquare className="w-10 h-10 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">You haven't reviewed anyone yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review, index) => (
                    <div
                        key={review.id || index}
                        className={`bg-white p-5 rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-all ${expandedReview === (review.id || index) ? "ring-1 ring-blue-200 col-span-1 md:col-span-2 lg:col-span-3" : ""
                            }`}
                    >
                        <div
                            className="flex justify-between items-start cursor-pointer"
                            onClick={() => toggleExpandReview(review.id || index)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="bg-blue-50 p-2 rounded-full">
                                    <User className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 line-clamp-1">
                                        {getRevieweeName(review)}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {projectDetails[review.project]?.tender_title ||
                                            projectDetails[review.project]?.title ||
                                            `Project #${review.project}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex mr-3">
                                    {renderStars(review.rating)}
                                </div>
                                {expandedReview === (review.id || index) ? (
                                    <ChevronUp className="text-gray-400" />
                                ) : (
                                    <ChevronDown className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        {expandedReview === (review.id || index) && (
                            <div className="mt-4 pl-11 space-y-3 animate-fadeIn">
                                <p className="text-gray-700 leading-relaxed">
                                    {review.comment || "No review comment provided."}
                                </p>

                                <div className="flex justify-between items-center pt-2">
                                    {review.created_at && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    )}

                                    {projectDetails[review.project]?.status && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${projectDetails[review.project]?.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : projectDetails[review.project]?.status === 'in_progress'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {projectDetails[review.project]?.status === 'completed'
                                                ? 'Completed'
                                                : projectDetails[review.project]?.status === 'in_progress'
                                                    ? 'In Progress'
                                                    : projectDetails[review.project]?.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;