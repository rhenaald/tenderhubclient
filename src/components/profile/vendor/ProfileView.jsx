import React from 'react';

const ProfileView = ({ profileData, vendorData, isVendor }) => {
    return (
        <div>
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
                        {profileData.is_client && profileData.is_vendor
                            ? "Client & Vendor"
                            : profileData.is_client
                                ? "Client"
                                : "Vendor"}
                    </span>
                </div>
            </div>

            {isVendor && (
                <div className="mt-4 flex justify-between items-center text-gray-600 text-base bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-dollar-sign text-green-500 text-sm"></i>
                        <span>Hourly Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                        {vendorData.hourly_rate ?
                            `Rp${Number(vendorData.hourly_rate).toLocaleString('id-ID', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2
                            })}/jam` :
                            "Belum diisi"}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProfileView;