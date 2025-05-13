import React, { useState } from "react";
import ProjectList from "./ProjectList";
import ActiveProjectList from "./ActiveProjectList";
import ReviewList from "./ReviewList";
import { apiClient } from "../../../api/apiService";

const ProfileTabs = ({ profileData, clientData }) => {
    const [activeTab, setActiveTab] = useState("active");
    const [hoverTab, setHoverTab] = useState(null);

    const a = apiClient.get("/categories/");
    console.log("API response:", a);
    const b = apiClient.get(`tags/`);
    console.log("API response:", b);
    

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
            <div className="flex text-base font-medium text-gray-600 select-none">
                {[
                    { id: "active", label: "Proyek Aktif" },
                    { id: "projects", label: "Proyek Saya" },
                    { id: "reviews", label: "Review" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        onMouseEnter={() => setHoverTab(tab.id)}
                        onMouseLeave={() => setHoverTab(null)}
                        className={`relative py-4 px-6 transition-all duration-300 ${activeTab === tab.id
                                ? "text-blue-600 font-semibold"
                                : "hover:text-blue-500"
                            }`}
                    >
                        {tab.label}
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300 ${activeTab === tab.id
                                ? "opacity-100 scale-x-100"
                                : hoverTab === tab.id
                                    ? "opacity-50 scale-x-75"
                                    : "opacity-0 scale-x-0"
                            }`}></div>
                    </button>
                ))}
            </div>

            <div className="transition-all duration-300 transform">
                {activeTab === "active" && <ActiveProjectList />}
                {activeTab === "projects" && <ProjectList />}
                {activeTab === "reviews" && <ReviewList />}
            </div>
        </div>
    );
};

export default ProfileTabs;