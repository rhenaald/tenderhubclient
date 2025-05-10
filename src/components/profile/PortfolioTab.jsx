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
    isLoading
}) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl text-gray-800">Portfolio Saya</h3>
                {!isAddingPortfolio && (
                    <button
                        className="text-blue-500 hover:text-blue-600 flex items-center"
                        onClick={() => setIsAddingPortfolio(true)}
                    >
                        <i className="fas fa-plus-circle mr-1"></i>
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
                />
            )}
        </div>
    );
};

export default PortfolioTab;