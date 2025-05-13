import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/apiService";
import { FiFilter, FiArrowRight, FiDollarSign, FiCalendar, FiUser, FiBriefcase } from "react-icons/fi";

const ActiveProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get("/projects/");
                const projectData = response.data.results;
                setProjects(projectData);

                const statuses = [...new Set(projectData.map(project => project.status))];
                setAvailableStatuses(statuses);

                setFilteredProjects(projectData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        let filtered = projects;

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(project => project.status === statusFilter);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(project =>
                project.tender_title.toLowerCase().includes(query) ||
                project.client_name.toLowerCase().includes(query) ||
                project.vendor_name.toLowerCase().includes(query)
            );
        }

        setFilteredProjects(filtered);
    }, [statusFilter, projects, searchQuery]);

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'in_progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'on_hold': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'pending': 'bg-purple-100 text-purple-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-blue-500 font-semibold animate-pulse">Loading...</div>
                </div>
            </div>
        </div>
    );
    

    if (error) return (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-medium">Error loading projects</h3>
            <p className="text-sm mt-1">{error}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Active Projects</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative flex items-center">
                        <FiFilter className="absolute left-3 text-gray-400" />
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="all">All Statuses</option>
                            {availableStatuses.map(status => (
                                <option key={status} value={status}>
                                    {formatStatus(status)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.project_id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {formatStatus(project.status)}
                                        </span>
                                        <h3 className="mt-2 font-semibold text-lg text-gray-900 line-clamp-2">
                                            {project.tender_title}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 flex items-center">
                                            {Number(project.agreed_amount).toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            })}
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiUser className="mr-2 flex-shrink-0" />
                                        <span className="truncate">{project.client_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiBriefcase className="mr-2 flex-shrink-0" />
                                        <span className="truncate">{project.vendor_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiCalendar className="mr-2 flex-shrink-0" />
                                        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => navigate(`/Activity-projects/${project.project_id}`)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    View Details <FiArrowRight className="ml-1.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveProjectList;