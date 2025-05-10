import React from 'react';

const ProfileHeader = ({ profileData, editMode, tempImage, handleImageChange }) => {
    const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || profileData.username;

    return (
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
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

            <div className="flex-grow">
                <h2 className="font-semibold text-xl text-gray-900">{fullName}</h2>
                <p className="text-blue-500 font-medium text-sm mt-1">@{profileData.username}</p>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
                {profileData.bio && (
                    <p className="text-gray-600 mt-3">{profileData.bio}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;