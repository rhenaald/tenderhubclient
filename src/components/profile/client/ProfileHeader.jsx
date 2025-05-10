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
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                {/* Left side - Profile Picture */}
                <div className="flex-shrink-0 flex flex-col items-center">
                    {editMode ? (
                        <label htmlFor="profile-picture" className="cursor-pointer">
                            <div className="relative">
                                <img
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
                                    src={tempImage || profileData.profile_picture || "https://via.placeholder.com/160"}
                                />
                                <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
                                    <i className="fas fa-camera"></i>
                                </div>
                            </div>
                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <img
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-md"
                            src={profileData.profile_picture || "https://via.placeholder.com/160"}
                        />
                    )}
                </div>

                {/* Right side - Profile Information */}
                <div className="flex-grow">
                    {editMode ? (
                        <div className="space-y-3 w-full">
                            <input
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                            />
                            <input
                                name="last_name"
                                value={profileData.last_name}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                            />
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                placeholder="Bio"
                                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none h-20 resize-none"
                            />
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-semibold text-xl text-gray-900">{fullName}</h2>
                            <p className="text-blue-500 font-medium text-sm mt-1">@{profileData.username}</p>
                            <p className="text-gray-500 text-sm">{profileData.email}</p>
                            {profileData.bio && (
                                <p className="text-gray-600 mt-3">{profileData.bio}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                                        <span>Lokasi</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {profileData.location || "Belum diisi"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <i className="fas fa-language text-blue-500 text-sm"></i>
                                        <span>Bahasa</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {profileData.language || "Belum diisi"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <i className="fas fa-user-tag text-blue-500 text-sm"></i>
                                        <span>Role</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {profileData.is_client ? "Client" : "Vendor"}
                                    </span>
                                </div>
                            </div>

                            {profileData.is_client && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <i className="fas fa-building text-blue-500 text-sm"></i>
                                            <span>Perusahaan</span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="font-semibold text-gray-900 break-words">
                                                {clientData.company_name || "Belum diisi"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <i className="fas fa-phone text-blue-500 text-sm"></i>
                                            <span>Kontak</span>
                                        </div>
                                        <div className="flex-grow mx-2">
                                            <span className="font-semibold text-gray-900 block text-right truncate max-w-full">
                                                {clientData.contact_number || "Belum diisi"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <i className="fas fa-home text-blue-500 text-sm"></i>
                                            <span>Alamat</span>
                                        </div>
                                        <div className="flex-grow mx-2">
                                            <span className="font-semibold text-gray-900 block text-right truncate max-w-full" title={clientData.address || "Belum diisi"}>
                                                {clientData.address || "Belum diisi"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {editMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                            <span>Lokasi</span>
                        </div>
                        <div className="flex-grow mx-2">
                            <input
                                name="location"
                                value={profileData.location}
                                onChange={handleInputChange}
                                className="w-full border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none text-right"
                            />
                        </div>
                    </div>
                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <i className="fas fa-language text-blue-500 text-sm"></i>
                            <span>Bahasa</span>
                        </div>
                        <div className="flex-grow mx-2">
                            <input
                                name="language"
                                value={profileData.language}
                                onChange={handleInputChange}
                                className="w-full border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none text-right"
                            />
                        </div>
                    </div>

                    {profileData.is_client && (
                        <>
                            <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-building text-blue-500 text-sm"></i>
                                    <span>Perusahaan</span>
                                </div>
                                <input
                                    name="company_name"
                                    value={clientData.company_name}
                                    onChange={handleInputChange}
                                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                                />
                            </div>
                            <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-phone text-blue-500 text-sm"></i>
                                    <span>Kontak</span>
                                </div>
                                <input
                                    name="contact_number"
                                    value={clientData.contact_number}
                                    onChange={handleInputChange}
                                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                                />
                            </div>
                            <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-home text-blue-500 text-sm"></i>
                                    <span>Alamat</span>
                                </div>
                                <input
                                    name="address"
                                    value={clientData.address}
                                    onChange={handleInputChange}
                                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-center">
                {editMode ? (
                    <div className="flex space-x-4 w-full max-w-md">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => {
                                setEditMode(false);
                                setTempImage(null);
                                setSelectedFile(null);
                            }}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200"
                        >
                            Batal
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200 flex items-center justify-center"
                        type="button"
                    >
                        <i className="fas fa-edit mr-2"></i>
                        Edit Profil
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;