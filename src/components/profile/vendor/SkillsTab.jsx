import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../api/apiService';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const VendorSkillsManagement = () => {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [vendorSkills, setVendorSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    useEffect(() => {
        const fetchVendorId = async () => {
            try {
                const response = await apiClient.get('/users/vendors/me/');
                setVendorId(response.data.id);
            } catch (err) {
                setError('Failed to fetch vendor information');
                console.error(err);
                setLoading(false);
            }
        };

        fetchVendorId();
    }, []);

    const fetchAvailableSkills = async () => {
        try {
            const response = await apiClient.get('/users/skills/');
            const skills = Array.isArray(response.data) ?
                response.data :
                (response.data.results || []);
            setAvailableSkills(skills);
        } catch (err) {
            setError('Failed to fetch available skills');
            console.error(err);
        }
    };


    const fetchVendorSkills = async (id) => {
        if (!id) {
            setVendorSkills([]);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get(`/users/vendors/${id}/skills/`);
            const skills = Array.isArray(response.data) ?
                response.data :
                (response.data.results || []);
            setVendorSkills(skills);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch vendor skills');
            setLoading(false);
            setVendorSkills([]);
            console.error(err);
        }
    };

    // Add skill to vendor profile
    const addSkill = async () => {
        if (!selectedSkill || !vendorId) return;

        setIsAdding(true);
        try {
            await apiClient.post(`/users/vendors/${vendorId}/add_skill/`, {
                id: selectedSkill.value
            });

            // Refresh vendor skills
            await fetchVendorSkills(vendorId);
            setSelectedSkill(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add skill');
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    // Delete skill from vendor profile
    const deleteSkill = async (skillId) => {
        if (!vendorId) {
            setError('Vendor ID not found');
            return;
        }

        try {
            await apiClient.delete(`/users/vendors/${vendorId}/delete_skill/?skill_id=${skillId}`);
            setVendorSkills(prev => prev.filter(skill => skill.id !== skillId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete skill');
            console.error(err);
        }
    };

    // Initial data fetch after we have the vendorId
    useEffect(() => {
        if (vendorId) {
            fetchAvailableSkills();
            fetchVendorSkills(vendorId);
        }
    }, [vendorId]);

    // Filter out skills that are already added by the vendor and format for react-select
    const skillOptions = availableSkills
        .filter(skill => !vendorSkills.some(vendorSkill => vendorSkill.id === skill.id))
        .map(skill => ({
            value: skill.id,
            label: skill.name
        }));

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-500">
                {error}
                <button
                    onClick={() => setError(null)}
                    className="ml-2 text-red-700 font-medium"
                >
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Your Skills</h2>

            {/* Current Vendor Skills */}
            <div className="mb-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Current Skills</h3>
                {vendorSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {vendorSkills.map(skill => (
                            <div
                                key={skill.id}
                                className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-full flex items-center gap-2"
                            >
                                <span className="text-blue-800">{skill.name}</span>
                                <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
                                    aria-label={`Remove ${skill.name} skill`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">You haven't added any skills yet</p>
                )}
            </div>

            {/* Add Skill Section */}
            {/* Add Skill Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Skills</h3>
                <div className="flex gap-3 items-start">
                    <div className="flex-grow">
                        <Select
                            value={selectedSkill}
                            onChange={setSelectedSkill}
                            options={skillOptions}
                            placeholder="Search and select skills to add..."
                            isSearchable={true}
                            isClearable={true}
                            noOptionsMessage={() => "No skills available or all skills already added"}
                            components={animatedComponents}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: '42px',
                                    borderColor: '#d1d5db',
                                    '&:hover': {
                                        borderColor: '#9ca3af'
                                    }
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#eff6ff' : 'white',
                                    color: '#1e3a8a'
                                }),
                                menu: (base) => ({
                                    ...base,
                                    maxHeight: '200px', // Atur tinggi maksimal menu
                                    overflowY: 'auto',    // Aktifkan scroll vertikal
                                }),
                                menuList: (base) => ({
                                    ...base,
                                    maxHeight: '200px', // Batasi tinggi daftar
                                    padding: 0,         // Hapus padding default
                                }),
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                        {skillOptions.length === 0 && (
                            <p className="text-gray-500 text-sm mt-2">
                                No more available skills to add. You've added all skills!
                            </p>
                        )}
                    </div>
                    <button
                        onClick={addSkill}
                        disabled={!selectedSkill || isAdding}
                        className={`px-5 py-2 rounded-md transition-colors flex items-center ${selectedSkill && !isAdding
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isAdding ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </>
                        ) : 'Add Skill'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorSkillsManagement;