import React from 'react';

const ProfileEditForm = ({
    profileData,
    vendorData,
    handleInputChange,
    handleVendorDataChange,
    isVendor
}) => {
    return (
        <form className="space-y-3 w-full">
            <input
                name="first_name"
                value={profileData.first_name || ""}
                onChange={handleInputChange}
                placeholder="Nama Depan"
                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
            />
            <input
                name="last_name"
                value={profileData.last_name || ""}
                onChange={handleInputChange}
                placeholder="Nama Belakang"
                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
            />
            <textarea
                name="bio"
                value={profileData.bio || ""}
                onChange={handleInputChange}
                placeholder="Bio"
                className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none h-20 resize-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                        <span>Lokasi</span>
                    </div>
                    <input
                        name="location"
                        value={profileData.location || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                    />
                </div>
                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-language text-blue-500 text-sm"></i>
                        <span>Bahasa</span>
                    </div>
                    <input
                        name="language"
                        value={profileData.language || ""}
                        onChange={handleInputChange}
                        className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                    />
                </div>

                {isVendor && (
                    <div className="flex justify-between items-center text-gray-600 text-base bg-green-50 p-3 rounded-lg md:col-span-2">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-dollar-sign text-green-500 text-sm"></i>
                            <span>Hourly Rate (Rp)</span>
                        </div>
                        <input
                            name="hourly_rate"
                            type="number"
                            min="0"
                            value={vendorData.hourly_rate || ""}
                            onChange={handleVendorDataChange}
                            className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                        />
                    </div>
                )}
            </div>
        </form>
    );
};

export default ProfileEditForm;