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
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex text-lg font-semibold text-gray-700 select-none border-b overflow-x-auto">
                <button
                    onClick={() => setActiveTab("projects")}
                    className={`py-4 px-6 ${activeTab === "projects" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                >
                    Proyek Saya
                </button>
                {isVendor && (
                    <>
                        <button
                            onClick={() => setActiveTab("portfolio")}
                            className={`py-4 px-6 ${activeTab === "portfolio" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab("education")}
                            className={`py-4 px-6 ${activeTab === "education" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                        >
                            Pendidikan
                        </button>
                        <button
                            onClick={() => setActiveTab("certifications")}
                            className={`py-4 px-6 ${activeTab === "certifications" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                        >
                            Sertifikasi
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`py-4 px-6 ${activeTab === "reviews" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                        >
                            Review
                        </button>
                        <button
                            onClick={() => setActiveTab("skills")}
                            className={`py-4 px-6 ${activeTab === "skills" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
                        >
                            Skills
                        </button>
                    </>
                )}
            </div>

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
    );
};

export default ProfileTabs;