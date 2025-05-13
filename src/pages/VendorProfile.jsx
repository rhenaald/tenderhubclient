import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from "../api/apiService";

const VendorProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch user profile data
                const userResponse = await apiClient.get(`/users/profile/${id}`);
                const username = userResponse.data.username;

                // Fetch vendor data by filtering with the username
                const vendorsResponse = await apiClient.get('/users/vendors');
                const vendor = vendorsResponse.data.results.find(v => v.user === username);

                setUserData(userResponse.data);
                setVendorData(vendor || {});
                setError(null);
            } catch (err) {
                setError('Failed to fetch vendor data');
                console.error('Error fetching vendor data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!userData || !vendorData) {
        return <div className="flex justify-center items-center h-screen">Vendor not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gray-100 p-6 flex flex-col md:flex-row items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mr-6">
                        <img
                            src={userData.profile_picture || 'https://via.placeholder.com/150'}
                            alt={`${userData.first_name} ${userData.last_name}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {userData.first_name} {userData.last_name}
                        </h1>
                        <p className="text-gray-600">{userData.email}</p>
                        <p className="text-gray-600 mt-2">
                            <i className="fas fa-map-marker-alt mr-2"></i>
                            {userData.location}
                        </p>
                        {vendorData.hourly_rate && (
                            <div className="mt-2">
                                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                                    ${vendorData.hourly_rate}/hour
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio Section */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
                    <p className="text-gray-600">{userData.bio || 'No bio provided'}</p>
                </div>

                {/* Skills Section */}
                {vendorData.skills && vendorData.skills.length > 0 && (
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {vendorData.skills.map((skill, index) => (
                                <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating Section */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Rating</h2>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(vendorData.average_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                            {vendorData.average_rating.toFixed(1)} ({vendorData.reviews?.length || 0} reviews)
                        </span>
                    </div>
                </div>

                {/* Portfolio Section */}
                {vendorData.portfolios && vendorData.portfolios.length > 0 && (
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Portfolio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendorData.portfolios.map((portfolio, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <img
                                        src={portfolio.image || 'https://via.placeholder.com/300'}
                                        alt={portfolio.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="font-medium text-gray-800">{portfolio.title}</h3>
                                        <p className="text-sm text-gray-600">{portfolio.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Section */}
                {vendorData.education && vendorData.education.length > 0 && (
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
                        <div className="space-y-4">
                            {vendorData.education.map((edu, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-1">
                                    <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    <p className="text-sm text-gray-500">
                                        {edu.start_year} - {edu.end_year || 'Present'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications Section */}
                {vendorData.certifications && vendorData.certifications.length > 0 && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Certifications</h2>
                        <div className="space-y-3">
                            {vendorData.certifications.map((cert, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <i className="fas fa-certificate text-blue-500"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{cert.name}</h3>
                                        <p className="text-gray-600">{cert.issuing_organization}</p>
                                        <p className="text-sm text-gray-500">
                                            Issued {cert.issue_date} {cert.expiration_date && `• Expires ${cert.expiration_date}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorProfile;