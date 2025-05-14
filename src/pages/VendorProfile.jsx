import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from "../api/apiService";
import { Link } from 'react-router-dom';

const VendorProfile = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [vendorProfile, setVendorProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Fetch basic user profile
                const userResponse = await apiClient.get(`/users/users/${id}/profile/`);
                setUserProfile(userResponse.data);

                // Fetch detailed vendor profile
                const vendorResponse = await apiClient.get(`/users/users/${id}/vendor-profile/`);
                setVendorProfile(vendorResponse.data);

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

    // Function to format number to Rupiah
    const formatRupiah = (amount) => {
        if (!amount) return 'Rp0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

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

    if (!userProfile || !vendorProfile) {
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
                                {vendorProfile.average_rating && (
                                    <div className="flex items-center gap-1 bg-opacity-20 px-2 py-1 rounded-full">
                                        <svg className="w-7 h-7 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                        <span className="text-md font-medium">
                                            {vendorProfile.average_rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sky-300">@{userProfile.username}</p>
                            {vendorProfile.title && (
                                <p className="mt-1 text-gray-200">{vendorProfile.title}</p>
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
                                <h3 className="text-sm font-medium text-gray-500">HOURLY RATE</h3>
                                <p className="text-2xl font-bold text-gray-800">{formatRupiah(vendorProfile.hourly_rate)}/jam</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">LOCATION</h3>
                                <p className="text-gray-800">
                                    {userProfile.location || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">LANGUAGES</h3>
                                <p className="text-gray-800">
                                    {userProfile.language || "Not specified"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">BIO</h3>
                                <p className="text-gray-800">
                                    {userProfile.bio || "No bio available"}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Skills */}
                        <div className="md:w-2/3">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">SKILLS</h3>
                            <div className="flex flex-wrap gap-2">
                                {vendorProfile.skills && vendorProfile.skills.length > 0 ? (
                                    vendorProfile.skills.map(skill => (
                                        <span
                                            key={skill.id}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                                        >
                                            {skill.name}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No skills listed</p>
                                )}
                            </div>
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
                            onClick={() => setActiveTab('portfolio')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'portfolio' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Reviews ({vendorProfile.reviews ? vendorProfile.reviews.length : 0})
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Education */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Education</h3>
                                {vendorProfile.education && vendorProfile.education.length > 0 ? (
                                    <div className="space-y-6">
                                        {vendorProfile.education.map(edu => (
                                            <div key={edu.id} className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{edu.institution}</h4>
                                                    <p className="text-gray-600 text-sm">{edu.degree}, {edu.field_of_study}</p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No education history listed</p>
                                )}
                            </div>

                            {/* Certifications */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Certifications</h3>
                                {vendorProfile.certifications && vendorProfile.certifications.length > 0 ? (
                                    <div className="space-y-6">
                                        {vendorProfile.certifications.map(cert => (
                                            <div key={cert.id} className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{cert.title}</h4>
                                                    <p className="text-gray-600 text-sm">{cert.issuing_organization}</p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                                        {cert.expiry_date && ` · Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No certifications listed</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Portfolio Tab */}
                    {activeTab === 'portfolio' && (
                        <div>
                            {vendorProfile.portfolios && vendorProfile.portfolios.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vendorProfile.portfolios.map(portfolio => (
                                        <div key={portfolio.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                            {portfolio.image && (
                                                <div className="h-48 overflow-hidden">
                                                    <img
                                                        src={portfolio.image}
                                                        alt={portfolio.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-5">
                                                <h3 className="font-bold text-gray-800 mb-2">{portfolio.title}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{portfolio.description}</p>
                                                {portfolio.link && (
                                                    <a
                                                        href={portfolio.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 text-sm hover:underline flex items-center"
                                                    >
                                                        View Project
                                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No portfolio items yet</h3>
                                    <p className="mt-1 text-gray-500">This vendor hasn't added any portfolio projects.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Customer Reviews</h3>
                                    <div className="flex items-center mt-1">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-5 h-5 ${vendorProfile.average_rating && star <= Math.round(vendorProfile.average_rating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-gray-800 font-medium">
                                            {vendorProfile.average_rating ? vendorProfile.average_rating.toFixed(1) : "N/A"}
                                        </span>
                                        <span className="ml-2 text-gray-500">
                                            ({vendorProfile.reviews ? vendorProfile.reviews.length : 0} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {vendorProfile.reviews && vendorProfile.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {vendorProfile.reviews.map(review => (
                                        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <Link to={`/client/profile/${review.reviewer}`}>
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
                                    <p className="mt-1 text-gray-500">This vendor hasn't received any reviews yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;