import React from "react";

const ProfileHeader = ({
    profileData,
    clientData,
    editMode,
    tempImage,
    handleInputChange,
    handleImageChange,
    setEditMode,
    handleSubmit
}) => {
    const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || profileData.username;

    return (
        <div className="min-h-screen">
            {/* Header Background dengan opacity lebih rendah */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 z-0"></div>

            <div className="max-w-full mx-auto relative z-10 pt-16">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Cover Photo dengan blur */}
                    <div className="h-48 bg-gradient-to-r from-indigo-300 to-purple-400 relative overflow-hidden">
                        {/* Blurred profile picture sebagai cover */}
                        <img
                            src={profileData.profile_picture || "https://avatars.dicebear.com/api/initials/" + fullName + ".svg"}
                            alt="Cover"
                            className="w-full h-full object-cover filter blur-md opacity-60"
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
                    <div className="px-8 pb-8">
                        {/* Profile Picture and Name Section - Updated layout */}
                        <div className="flex flex-col md:flex-row gap-8 -mt-16">
                            {/* Profile Picture Section - Half in cover, half out */}
                            <div className="flex flex-col items-center md:items-start relative">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-200 bg-white">
                                        <img
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                                            src={editMode && tempImage ? tempImage : profileData.profile_picture || "https://avatars.dicebear.com/api/initials/" + fullName + ".svg"}
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

                            {/* Profile Info Section - Name and username aligned with profile picture */}
                            <div className="flex-1 flex flex-col justify-center text-center md:pt-16 lg:text-left">
                                <div className="mt-4 md:mt-0">
                                    <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                                    <p className="text-blue-500 mt-1">@{profileData.username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio dan Info Lainnya */}
                        <div className="mt-6">
                            {editMode ? (
                                <div className="space-y-6 ">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {profileData.bio && (
                                        <p className="text-gray-600 mt-4 leading-relaxed">{profileData.bio}</p>
                                    )}

                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <InfoCard
                                            icon="location-marker"
                                            label="Location"
                                            value={profileData.location || "Not specified"}
                                        />
                                        <InfoCard
                                            icon="translate"
                                            label="Language"
                                            value={profileData.language || "Not specified"}
                                        />
                                        <InfoCard
                                            icon="user-circle"
                                            label="Role"
                                            value={profileData.is_client ? "Client" : "Vendor"}
                                        />

                                        {profileData.is_client && (
                                            <>
                                                <InfoCard
                                                    icon="office-building"
                                                    label="Company"
                                                    value={clientData.company_name || "Not specified"}
                                                />
                                                <InfoCard
                                                    icon="phone"
                                                    label="Contact"
                                                    value={clientData.contact_number || "Not specified"}
                                                />
                                                <InfoCard
                                                    icon="home"
                                                    label="Address"
                                                    value={clientData.address || "Not specified"}
                                                />
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Edit Mode Additional Fields */}
                        {editMode && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Location</label>
                                    <input
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Language</label>
                                    <input
                                        name="language"
                                        value={profileData.language}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {profileData.is_client && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-2">Company Name</label>
                                            <input
                                                name="company_name"
                                                value={clientData.company_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-2">Contact Number</label>
                                            <input
                                                name="contact_number"
                                                value={clientData.contact_number}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-2">Address</label>
                                            <input
                                                name="address"
                                                value={clientData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end">
                            {editMode ? (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Save Changes
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Info Card Component
const InfoCard = ({ icon, label, value }) => {
    const icons = {
        'location-marker': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        'translate': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
        ),
        'user-circle': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        'office-building': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        'phone': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        'home': (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    };

    return (
        <div className="bg-gray-50 p-4 rounded-xl flex items-start space-x-3 hover:bg-gray-100 transition-all duration-200 cursor-default border border-gray-200 hover:border-gray-300">
            <div className="text-blue-500 mt-0.5">
                {icons[icon] || icons['user-circle']}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;