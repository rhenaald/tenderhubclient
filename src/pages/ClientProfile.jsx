import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from "../api/apiService";
import { Link } from 'react-router-dom';

const ClientProfile = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [clientProfile, setClientProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Fetch basic user profile
                const userResponse = await apiClient.get(`/users/users/${id}/profile/`);
                setUserProfile(userResponse.data);

                // Fetch detailed client profile
                const clientResponse = await apiClient.get(`/users/users/${id}/client-profile/`);
                setClientProfile(clientResponse.data);

                setLoading(false);
            } catch (err) {
                setError("Failed to load profile data");
                setLoading(false);
                console.error("Error fetching profile:", err);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-lg text-red-700">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!userProfile || !clientProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">No profile data available</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section with Blurred Background */}
            <div className="relative h-64 w-full overflow-hidden">
                {userProfile.profile_picture ? (
                    <div className="absolute inset-0">
                        <img
                            src={userProfile.profile_picture}
                            alt="Cover"
                            className="w-full h-full object-cover filter blur-md scale-105"
                        />
                        <div className="absolute inset-0 bg-grey-900 bg-opacity-20"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                )}

                <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
                    <div className="flex items-end gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                            {userProfile.profile_picture ? (
                                <img
                                    src={userProfile.profile_picture}
                                    alt={userProfile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-4xl font-bold">
                                    {userProfile.first_name ? userProfile.first_name.charAt(0).toUpperCase() : userProfile.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="text-white mb-2">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {userProfile.first_name} {userProfile.last_name}
                                </h1>
                            </div>
                            <p className="text-sky-400">@{userProfile.username}</p>
                            {clientProfile.company_name && (
                                <p className="mt-1 inline-block rounded-full bg-blue-400 text-white px-4 py-1 text-sm">
                                    {clientProfile.company_name}
                            </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 -mt-12 relative z-10">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="md:w-1/3 space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">COMPANY</h3>
                                <p className="text-xl font-bold text-gray-800">
                                    {clientProfile.company_name || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">CONTACT NUMBER</h3>
                                <p className="text-gray-800">
                                    {clientProfile.contact_number || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">ADDRESS</h3>
                                <p className="text-gray-800">
                                    {clientProfile.address || "Not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="md:w-2/3">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">ABOUT</h3>
                            <p className="text-gray-800">
                                {userProfile.bio || "No bio available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Reviews ({clientProfile.reviews ? clientProfile.reviews.length : 0})
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Client Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Company Name</h4>
                                    <p className="text-gray-800">{clientProfile.company_name || "Not specified"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Number</h4>
                                    <p className="text-gray-800">{clientProfile.contact_number || "Not specified"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                                    <p className="text-gray-800">{clientProfile.address || "Not specified"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
                                    <p className="text-gray-800">
                                        {new Date(userProfile.date_joined).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Vendor Reviews</h3>
                                    <div className="flex items-center mt-1">
                                        <span className="text-gray-500">
                                            ({clientProfile.reviews ? clientProfile.reviews.length : 0} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {clientProfile.reviews && clientProfile.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {clientProfile.reviews.map(review => (
                                        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <Link to={`/vendor/profile/${review.reviewer}`}>
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                                                            {review.reviewer_photo ? (
                                                                <img src={review.reviewer_photo} alt={review.reviewer_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-gray-500 text-sm">
                                                                    {review.reviewer_name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{review.reviewer_name}</h4>
                                                        
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-gray-400 text-sm">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 pl-13">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
                                    <p className="mt-1 text-gray-500">This client hasn't received any reviews yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;