import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { apiClient } from "../../../api/apiService";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState({});

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/users/reviews/");

                // Extract results from the paginated response
                const reviewsData = response.data.results || [];
                setReviews(reviewsData);

                // Fetch user details for reviewees (if needed)
                const userIds = [...new Set(reviewsData.map(review => review.reviewee))];
                await fetchUserDetails(userIds);

                // Fetch project details
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

                // Try alternative endpoint if the first one fails
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
        // First check if reviewee_name is already available in the review
        if (review.reviewee_name) {
            return review.reviewee_name;
        }

        // Check if we have user details for this reviewee
        if (userDetails[review.reviewee]?.name) {
            return userDetails[review.reviewee].name;
        }

        // Check project details to see if reviewee matches client or vendor
        const project = projectDetails[review.project];
        if (project) {
            // Check if reviewee is the client
            if (project.client && project.client.toString() === review.reviewee.toString() && project.client_name) {
                return project.client_name;
            }

            // Check if reviewee is the vendor
            if (project.vendor && project.vendor.toString() === review.reviewee.toString() && project.vendor_name) {
                return project.vendor_name;
            }
        }

        // Fallback to user ID if no name is found
        return `User #${review.reviewee}`;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Anda belum memberikan review kepada siapapun.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Review yang Anda Berikan</h2>
            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <div
                        key={review.id || index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-medium">
                                    {getRevieweeName(review)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Proyek: {projectDetails[review.project]?.tender_title ||
                                        projectDetails[review.project]?.title ||
                                        `#${review.project}`}
                                </p>
                                {projectDetails[review.project]?.status && (
                                    <span className={`inline-block px-2 py-1 text-xs rounded mt-1 
                    ${projectDetails[review.project]?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            projectDetails[review.project]?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {projectDetails[review.project]?.status === 'completed' ? 'Selesai' :
                                            projectDetails[review.project]?.status === 'in_progress' ? 'Sedang Berjalan' :
                                                projectDetails[review.project]?.status}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                            </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        {review.created_at && (
                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(review.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;