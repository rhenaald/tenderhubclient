import React from 'react';
import PortfolioList from './PortfolioList';
import PortfolioForm from './PortfolioForm';

const PortfolioTab = ({
    isAddingPortfolio,
    setIsAddingPortfolio,
    portfolioItems,
    newPortfolio,
    portfolioPreview,
    handlePortfolioInputChange,
    handlePortfolioImageChange,
    handleAddPortfolio,
    handleDeletePortfolio,
    isLoading
}) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Portfolio Saya</h3>
                    <p className="text-gray-500 text-sm mt-1">Kumpulan karya dan proyek terbaik Anda</p>
                </div>
                {!isAddingPortfolio && (
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-5 py-2.5 transition-all duration-300 hover:shadow-md flex items-center"
                        onClick={() => setIsAddingPortfolio(true)}
                    >
                        <i className="fas fa-plus mr-2 text-sm"></i>
                        Tambah Portfolio
                    </button>
                )}
            </div>

            {isAddingPortfolio ? (
                <PortfolioForm
                    newPortfolio={newPortfolio}
                    portfolioPreview={portfolioPreview}
                    handlePortfolioInputChange={handlePortfolioInputChange}
                    handlePortfolioImageChange={handlePortfolioImageChange}
                    handleAddPortfolio={handleAddPortfolio}
                    setIsAddingPortfolio={setIsAddingPortfolio}
                    isLoading={isLoading}
                />
            ) : (
                <PortfolioList
                    portfolioItems={portfolioItems}
                    setIsAddingPortfolio={setIsAddingPortfolio}
                    handleDeletePortfolio={handleDeletePortfolio}
                />
            )}
        </div>
    );
};

export default PortfolioTab;