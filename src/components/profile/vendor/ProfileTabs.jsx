import React from 'react';
import ProjectsTab from './ProjectsTab';
import PortfolioTab from './PortfolioTab';
import CertificationsTab from './CertificationsTab';
import EducationTab from './EducationTab';
import ReviewList from '../client/ReviewList';
import SkillsTab from './SkillsTab';

const ProfileTabs = ({
    activeTab,
    setActiveTab,
    isVendor,
    isAddingPortfolio,
    setIsAddingPortfolio,
    portfolioItems,
    newPortfolio,
    portfolioPreview,
    handlePortfolioInputChange,
    handlePortfolioImageChange,
    handleAddPortfolio,
    handleDeletePortfolio,
    isLoading,
    certifications,
    isAddingCertification,
    setIsAddingCertification,
    newCertification,
    handleCertificationInputChange,
    handleAddCertification,
    handleDeleteCertification,
    educationItems,
    isAddingEducation,
    setIsAddingEducation,
    newEducation,
    handleEducationInputChange,
    handleAddEducation,
    handleDeleteEducation,
}) => {
    const tabs = [
        { id: "projects", label: "Proyek Saya" },
        ...(isVendor ? [
            { id: "portfolio", label: "Portfolio" },
            { id: "education", label: "Pendidikan" },
            { id: "certifications", label: "Sertifikasi" },
            { id: "reviews", label: "Review" },
            { id: "skills", label: "Skills" }
        ] : [])
    ];

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
                {activeTab === "projects" && <ProjectsTab />}
                {activeTab === "portfolio" && (
                    <PortfolioTab
                        isAddingPortfolio={isAddingPortfolio}
                        setIsAddingPortfolio={setIsAddingPortfolio}
                        portfolioItems={portfolioItems}
                        newPortfolio={newPortfolio}
                        portfolioPreview={portfolioPreview}
                        handlePortfolioInputChange={handlePortfolioInputChange}
                        handlePortfolioImageChange={handlePortfolioImageChange}
                        handleAddPortfolio={handleAddPortfolio}
                        handleDeletePortfolio={handleDeletePortfolio}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "education" && (
                    <EducationTab
                        educationItems={educationItems}
                        isAddingEducation={isAddingEducation}
                        setIsAddingEducation={setIsAddingEducation}
                        newEducation={newEducation}
                        handleEducationInputChange={handleEducationInputChange}
                        handleAddEducation={handleAddEducation}
                        handleDeleteEducation={handleDeleteEducation}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "certifications" && (
                    <CertificationsTab
                        certifications={certifications}
                        isAddingCertification={isAddingCertification}
                        setIsAddingCertification={setIsAddingCertification}
                        newCertification={newCertification}
                        handleCertificationInputChange={handleCertificationInputChange}
                        handleAddCertification={handleAddCertification}
                        handleDeleteCertification={handleDeleteCertification}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "reviews" && <ReviewList />}
                {activeTab === "skills" && <SkillsTab />}
            </div>
        </div>
    );
};

export default ProfileTabs;