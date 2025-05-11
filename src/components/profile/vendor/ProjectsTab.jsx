import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiClient } from "../../../api/apiService";

const ActiveProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get("/projects/");
                setProjects(response.data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Active Projects</h2>

            {projects.length === 0 ? (
                <p>No active projects found.</p>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
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
                                        Status: <span className="capitalize">{project.status.replace('_', ' ')}</span>
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
                                {/* You can add more buttons here if needed */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveProjectList;