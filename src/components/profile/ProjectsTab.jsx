import React from 'react';

const ProjectsTab = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl text-gray-800">Proyek Aktif</h3>
                <button className="text-blue-500 hover:text-blue-600 flex items-center">
                    <i className="fas fa-plus-circle mr-1"></i>
                    Tambah Proyek
                </button>
            </div>

            <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white hover:border-blue-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                                    <i className="fas fa-project-diagram text-blue-500 text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Proyek {index + 1}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">Dalam pengerjaan</span>
                                        <span>•</span>
                                        <span>Deadline: 12 Hari</span>
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-blue-500">Rp 1.500.000</span>
                        </div>

                        <p className="text-gray-700 my-4">
                            Deskripsi singkat proyek yang sedang dikerjakan oleh vendor. Proyek ini meliputi pembuatan desain dan pengembangan website.
                        </p>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://via.placeholder.com/32"
                                    alt="Vendor"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm font-medium">Dikerjakan oleh: Vendor Studio</span>
                            </div>
                            <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsTab;