import React, { useState } from 'react';

const PortfolioList = ({ portfolioItems, setIsAddingPortfolio, handleDeletePortfolio }) => {
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioItems.length > 0 ? (
                    portfolioItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            {item.image && (
                                <img
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {new Date(item.date_created).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-gray-700 mb-3 line-clamp-2">{item.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                            >
                                                <i className="fas fa-external-link-alt mr-1 text-xs"></i>
                                                Lihat Proyek
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => openDeleteConfirm(item)}
                                            className="text-red-500 hover:text-red-700 flex items-center"
                                            disabled={deletingId === item.id}
                                        >
                                            {deletingId === item.id ? (
                                                <i className="fas fa-circle-notch fa-spin mr-1"></i>
                                            ) : (
                                                <i className="fas fa-trash-alt mr-1"></i>
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center col-span-2">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <i className="fas fa-folder-open text-blue-500 text-3xl"></i>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mb-2">Belum ada portfolio</h4>
                        <p className="text-gray-500 mb-6">Tambahkan portfolio untuk menampilkan karya Anda</p>
                        <button
                            onClick={() => setIsAddingPortfolio(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2 transition duration-200"
                        >
                            Tambah Portfolio
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h3>
                        <p className="text-gray-600 mb-4">
                            Apakah Anda yakin ingin menghapus portfolio "{selectedItem?.title}"? 
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center"
                                disabled={deletingId !== null}
                            >
                                {deletingId !== null ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                        Menghapus...
                                    </>
                                ) : (
                                    <>Hapus</>
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