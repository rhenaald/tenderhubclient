import React, { useState } from "react";
import ProjectList from "./ProjectList";
import ActiveProjectList from "./ActiveProjectList";
import ReviewList from "./ReviewList";

const ProfileTabs = ({ profileData, clientData }) => {
    const [activeTab, setActiveTab] = useState("active");

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex text-lg font-semibold text-gray-700 select-none border-b">
                <button
                    onClick={() => setActiveTab("active")}
                    className={`py-4 px-6 ${activeTab === "active" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                >
                    Proyek Aktif
                </button>
                <button
                    onClick={() => setActiveTab("projects")}
                    className={`py-4 px-6 ${activeTab === "projects" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                >
                    Proyek Saya
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 px-6 ${activeTab === "reviews" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                >
                    Review
                </button>
            </div>

            {activeTab === "active" && <ActiveProjectList />}
            {activeTab === "projects" && <ProjectList />}
            {activeTab === "reviews" && <ReviewList />}
        </div>
    );
};

export default ProfileTabs;