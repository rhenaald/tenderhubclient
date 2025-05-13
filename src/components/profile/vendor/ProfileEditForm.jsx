import React from 'react';

const ProfileEditForm = ({
    profileData,
    vendorData,
    handleInputChange,
    handleVendorDataChange,
    isVendor,
    skills = [],
    availableSkills = [],
    isAddingSkill,
    setIsAddingSkill,
    newSkill,
    setNewSkill,
    handleAddSkill,
    handleDeleteSkill,
    selectedSkill = "",
    setSelectedSkill,
    isLoadingSkills = false
}) => {

    console.log(availableSkills);
    return (
        <form>
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

            {/* Skills Section */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map(skill => (
                        <div key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                            <span>{skill.name}</span>
                            <button
                                type="button"
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    >
                        <option value="">Pilih Skill</option>
                        {availableSkills
                            .filter(skill => !skills.some(s => s.id === skill.id))
                            .map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={!selectedSkill || isLoadingSkills}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isLoadingSkills ? "Menambahkan..." : "Tambah"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProfileEditForm;