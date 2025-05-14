import React, { useState } from 'react';

const PortfolioList = ({ portfolioItems, setIsAddingPortfolio, handleDeletePortfolio }) => {
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const openDeleteConfirm = (item) => {
        setSelectedItem(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setDeletingId(selectedItem.id);
        await handleDeletePortfolio(selectedItem.id);
        setDeletingId(null);
        setShowDeleteConfirm(false);
        setSelectedItem(null);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.length > 0 ? (
                    portfolioItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            {item.image && (
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={`http://127.0.0.1:8000${item.image}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">{item.title}</h4>
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        {new Date(item.date_created).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex justify-between items-center">
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center group"
                                        >
                                            <span className="mr-2">View Project</span>
                                            <i className="fas fa-external-link-alt text-xs transition-transform group-hover:translate-x-0.5"></i>
                                        </a>
                                    )}
                                    <div className="ml-auto">
                                        <button
                                            onClick={() => openDeleteConfirm(item)}
                                            className="text-gray-400 hover:text-red-500 text-sm flex items-center transition-colors"
                                            disabled={deletingId === item.id}
                                        >
                                            {deletingId === item.id ? (
                                                <i className="fas fa-circle-notch fa-spin mr-1"></i>
                                            ) : (
                                                <i className="fas fa-trash-alt mr-1"></i>
                                            )}
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
                        <div className="bg-blue-50 p-5 rounded-full mb-6 transition-all duration-300 hover:scale-105">
                            <i className="fas fa-folder-open text-blue-400 text-4xl"></i>
                        </div>
                        <h4 className="text-xl font-medium text-gray-800 mb-3">No portfolio items yet</h4>
                        <p className="text-gray-500 max-w-md mb-6">Showcase your work by adding your first portfolio item</p>
                        <button
                            onClick={() => setIsAddingPortfolio(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2.5 transition-all duration-300 hover:shadow-md"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Add Portfolio
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-fade-in">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full mr-4">
                                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Delete portfolio?</h3>
                                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6 pl-16">Are you sure you want to delete <span className="font-medium">"{selectedItem?.title}"</span>?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 flex items-center"
                                disabled={deletingId !== null}
                            >
                                {deletingId !== null ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                        Deleting...
                                    </>
                                ) : (
                                    <>Delete</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PortfolioList;