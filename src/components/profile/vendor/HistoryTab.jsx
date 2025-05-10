import React from 'react';

const HistoryTab = () => {
    return (
        <div className="p-6">
            <h3 className="font-semibold text-xl text-gray-800 mb-6">Riwayat Proyek</h3>

            <div className="space-y-4">
                {[...Array(1)].map((_, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-5 bg-white"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex space-x-4">
                                <div className="bg-gray-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                                    <i className="fas fa-check-circle text-green-500 text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Proyek Selesai {index + 1}</h4>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Selesai</span>
                                        <span>•</span>
                                        <span>Tanggal: 10 April 2025</span>
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-green-500">Rp 2.000.000</span>
                        </div>

                        <p className="text-gray-700 my-4">
                            Proyek desain UI/UX untuk aplikasi mobile yang telah selesai dengan baik dan tepat waktu.
                        </p>

                        <div className="flex justify-end">
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

export default HistoryTab;