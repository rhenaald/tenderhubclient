import React, { useState } from "react";
import ProjectList from "./ProjectList";
import ActiveProjectList from "./ActiveProjectList";
import ReviewList from "./ReviewList";
import { apiClient } from "../../../api/apiService";

const ProfileTabs = ({ profileData, clientData }) => {
    const [activeTab, setActiveTab] = useState("active");
    const tabs = [
        { id: "active", label: "Proyek Aktif" },
        { id: "projects", label: "Proyek Saya" },
        { id: "reviews", label: "Review" }
    ];

    // API calls (moved to top for better organization)
    const fetchCategories = async () => {
        try {
            const response = await apiClient.get("/categories/");
            console.log("API response:", response);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await apiClient.get("/tags/");
            console.log("API response:", response);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    // Call APIs when component mounts
    React.useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="flex space-x-1 p-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 
                            ${activeTab === tab.id
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-4 md:p-6 transition-all duration-300">
                {activeTab === "active" && <ActiveProjectList />}
                {activeTab === "projects" && <ProjectList />}
                {activeTab === "reviews" && <ReviewList />}
            </div>
        </div>
    );
};

export default ProfileTabs;