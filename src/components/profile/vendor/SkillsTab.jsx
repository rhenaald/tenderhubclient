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

    const addSkill = async () => {
        if (!selectedSkill || !vendorId) return;

        setIsAdding(true);
        try {
            await apiClient.post(`/users/vendors/${vendorId}/add_skill/`, {
                id: selectedSkill.value
            });

            await fetchVendorSkills(vendorId);
            setSelectedSkill(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add skill');
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

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

    useEffect(() => {
        if (vendorId) {
            fetchAvailableSkills();
            fetchVendorSkills(vendorId);
        }
    }, [vendorId]);

    const skillOptions = availableSkills
        .filter(skill => !vendorSkills.some(vendorSkill => vendorSkill.id === skill.id))
        .map(skill => ({
            value: skill.id,
            label: skill.name
        }));

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                    <span className="text-red-700">{error}</span>
                </div>
                <button
                    onClick={() => setError(null)}
                    className="text-red-700 hover:text-red-900 transition-colors"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Your Skills</h2>
                    <p className="text-gray-500 text-sm mt-1">Showcase your professional expertise</p>
                </div>
            </div>

            {/* Current Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Your Skills</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {vendorSkills.length} skills
                    </span>
                </div>

                {vendorSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {vendorSkills.map(skill => (
                            <div
                                key={skill.id}
                                className="group relative bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
                            >
                                <span className="text-blue-800 font-medium">{skill.name}</span>
                                <button
                                    onClick={() => deleteSkill(skill.id)}
                                    className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-all duration-200"
                                    aria-label={`Remove ${skill.name} skill`}
                                >
                                    <i className="fas fa-times text-xs"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <i className="fas fa-clipboard-list text-3xl text-gray-400 mb-3"></i>
                        <p className="text-gray-500">You haven't added any skills yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add skills to showcase your expertise</p>
                    </div>
                )}
            </div>

            {/* Add Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">Add New Skills</h3>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:flex-grow">
                        <Select
                            value={selectedSkill}
                            onChange={setSelectedSkill}
                            options={skillOptions}
                            placeholder={
                                <div className="flex items-center">
                                    <i className="fas fa-search text-gray-400 mr-2"></i>
                                    <span>Search skills...</span>
                                </div>
                            }
                            isSearchable={true}
                            isClearable={true}
                            noOptionsMessage={() => (
                                <div className="py-2 text-gray-500">
                                    No skills available or all skills already added
                                </div>
                            )}
                            components={animatedComponents}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            styles={{
                                control: (base, { isFocused }) => ({
                                    ...base,
                                    minHeight: '44px',
                                    borderColor: isFocused ? '#3b82f6' : '#e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: isFocused ? '0 0 0 1px #3b82f6' : 'none',
                                    '&:hover': {
                                        borderColor: '#3b82f6'
                                    },
                                    paddingLeft: '8px'
                                }),
                                option: (base, { isFocused, isSelected }) => ({
                                    ...base,
                                    backgroundColor: isSelected
                                        ? '#3b82f6'
                                        : isFocused
                                            ? '#eff6ff'
                                            : 'white',
                                    color: isSelected ? 'white' : '#1e3a8a',
                                    ':active': {
                                        backgroundColor: '#3b82f6',
                                        color: 'white'
                                    }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    zIndex: 9999
                                }),
                                menuList: (base) => ({
                                    ...base,
                                    padding: 0
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: '#9ca3af'
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    color: '#9ca3af',
                                    ':hover': {
                                        color: '#6b7280'
                                    }
                                }),
                                clearIndicator: (base) => ({
                                    ...base,
                                    color: '#9ca3af',
                                    ':hover': {
                                        color: '#6b7280'
                                    }
                                })
                            }}
                        />
                        {skillOptions.length === 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-500 flex items-center">
                                <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                                You've added all available skills
                            </div>
                        )}
                    </div>

                    <button
                        onClick={addSkill}
                        disabled={!selectedSkill || isAdding}
                        className={`w-full md:w-auto px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${selectedSkill && !isAdding
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
                        ) : (
                            <>
                                <i className="fas fa-plus mr-2"></i>
                                Add Skill
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorSkillsManagement;