import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/apiService";

const ActiveProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get("/projects/");
                const projectData = response.data.results;
                setProjects(projectData);

                // Extract unique statuses for filter dropdown
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
        // Apply status filter
        if (statusFilter === "all") {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(project => project.status === statusFilter);
            setFilteredProjects(filtered);
        }
    }, [statusFilter, projects]);

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Active Projects</h2>

                <div className="flex items-center">
                    <label htmlFor="statusFilter" className="mr-2 text-gray-700">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {filteredProjects.length === 0 ? (
                <p>No projects found with the selected filter.</p>
            ) : (
                <div className="space-y-4">
                    {filteredProjects.map((project) => (
                        <div key={project.project_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {project.tender_title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {project.client_name} (Client) - {project.vendor_name} (Vendor)
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status: <span className="capitalize">{formatStatus(project.status)}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${project.agreed_amount}</p>
                                    <p className="text-sm text-gray-500">
                                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => navigate(`/Activity-projects/${project.project_id}`)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    View Details
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