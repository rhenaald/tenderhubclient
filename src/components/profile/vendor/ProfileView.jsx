import React from 'react';

export const ProfileHeader = ({ profileData, editMode, tempImage, handleImageChange }) => {
    const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || profileData.username;
    const profileImage = tempImage || profileData.profile_picture || `https://avatars.dicebear.com/api/initials/${fullName}.svg`;

    return (
        <div className="relative mb-8 rounded-xl overflow-hidden bg-white">
            {/* Cover Photo with blurred profile image */}
            <div className="h-48 bg-neutral-800 relative overflow-hidden">
                <img
                    src={profileImage || "https://avatars.dicebear.com/api/initials/" + fullName + ".svg"}
                    alt="Cover"
                    className="w-full h-full object-cover filter blur-md opacity-80"
                />

                {editMode && (
                    <label
                        htmlFor="cover-photo"
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md cursor-pointer transition-all duration-200 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input id="cover-photo" type="file" className="hidden" />
                    </label>
                )}
            </div>

            {/* Profile Content */}
            <div className="px-8">
                <div className="flex flex-col md:flex-row gap-8 -mt-16">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center md:items-start relative">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-200 bg-white">
                                <img
                                    alt="Profile"
                                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                                    src={editMode && tempImage ? tempImage : profileImage || "https://avatars.dicebear.com/api/initials/" + fullName + ".svg"}
                                />
                            </div>

                            {editMode && (
                                <label
                                    htmlFor="profile-picture"
                                    className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300"
                                >
                                    <div className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="profile-picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="flex-1 flex flex-col justify-center text-center md:pt-16 lg:text-left">
                        <div className="mt-4 md:mt-0">
                            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                            <p className="text-blue-500 mt-1">@{profileData.username}</p>
                            <p className="text-gray-500 mt-1">{profileData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                    {profileData.bio && (
                        <p className="text-gray-600 mt-4 leading-relaxed">{profileData.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export const ProfileEditForm = ({
    profileData,
    vendorData,
    handleInputChange,
    handleVendorDataChange,
    isVendor,
}) => {
    return (
        <div className="space-y-6 p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location Field */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Location</label>
                            <input
                                name="location"
                                value={profileData.location || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your location"
                            />
                        </div>
                    </div>
                </div>

                {/* Language Field */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Language</label>
                            <input
                                name="language"
                                value={profileData.language || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your language"
                            />
                        </div>
                    </div>
                </div>

                {/* Hourly Rate Field (Vendor Only) */}
                {isVendor && (
                    <div className="bg-green-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                            <div className="text-green-500 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Hourly Rate (Rp)</label>
                                <input
                                    name="hourly_rate"
                                    type="number"
                                    min="0"
                                    value={vendorData.hourly_rate || ""}
                                    onChange={handleVendorDataChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Enter hourly rate"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ProfileView = ({ profileData, vendorData, isVendor }) => {
    return (
        <div className="space-y-6 px-6 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-gray-900 font-medium">
                                {profileData.location || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Language */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Language</p>
                            <p className="text-gray-900 font-medium">
                                {profileData.language || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vendor Hourly Rate */}
                {isVendor && (
                    <div className="bg-green-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                            <div className="text-green-500 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                                <p className="text-gray-900 font-medium">
                                    {vendorData.hourly_rate ?
                                        `Rp${Number(vendorData.hourly_rate).toLocaleString('id-ID', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2
                                        })}/jam` :
                                        "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileComponents = {
    ProfileHeader,
    ProfileEditForm,
    ProfileView
};

export default ProfileComponents;