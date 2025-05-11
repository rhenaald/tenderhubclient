import React, { useState } from "react";
import ProjectList from "./ProjectList";
import HistoryList from "./HistoryList";
import ActiveProjectList from "./ActiveProjectList";

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
                    onClick={() => setActiveTab("history")}
                    className={`py-4 px-6 ${activeTab === "history" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                >
                    Riwayat
                </button>
            </div>

            {activeTab === "active" && <ActiveProjectList />}
            {activeTab === "projects" && <ProjectList />}
            {activeTab === "history" && <HistoryList />}
        </div>
    );
};

export default ProfileTabs;