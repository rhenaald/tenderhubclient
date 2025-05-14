import React from 'react';

const PortfolioForm = ({
    newPortfolio,
    portfolioPreview,
    handlePortfolioInputChange,
    handlePortfolioImageChange,
    handleAddPortfolio,
    setIsAddingPortfolio,
    isLoading,
    setNewPortfolio,
    setPortfolioPreview
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-plus-circle text-blue-500 mr-3"></i>
                    Tambah Portfolio Baru
                </h4>
            </div>

            <form onSubmit={handleAddPortfolio} className="p-6 space-y-5">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Judul*</label>
                    <input
                        name="title"
                        value={newPortfolio.title}
                        onChange={handlePortfolioInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nama proyek Anda"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Deskripsi*</label>
                    <textarea
                        name="description"
                        value={newPortfolio.description}
                        onChange={handlePortfolioInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none h-32 resize-none transition-all duration-200"
                        placeholder="Deskripsi singkat tentang proyek ini"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Gambar*</label>
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer">
                            <div className="flex items-center justify-center px-5 py-2.5 border-2 border-dashed border-blue-200 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 group">
                                <i className="fas fa-cloud-upload-alt mr-2 group-hover:scale-110 transition-transform"></i>
                                Pilih Gambar
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePortfolioImageChange}
                                    className="hidden"
                                    required={!portfolioPreview}
                                />
                            </div>
                        </label>
                        {portfolioPreview && (
                            <div className="relative group">
                                <img
                                    src={portfolioPreview}
                                    alt="Portfolio preview"
                                    className="h-20 w-20 object-cover rounded-lg shadow-sm border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPortfolioPreview(null);
                                        setNewPortfolio(prev => ({ ...prev, image: null }));
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Link (Opsional)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <i className="fas fa-link"></i>
                        </div>
                        <input
                            name="link"
                            type="url"
                            value={newPortfolio.link}
                            onChange={handlePortfolioInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Tanggal Dibuat*</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <i className="far fa-calendar-alt"></i>
                        </div>
                        <input
                            name="date_created"
                            type="date"
                            value={newPortfolio.date_created}
                            onChange={handlePortfolioInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingPortfolio(false);
                            setNewPortfolio({
                                title: "",
                                description: "",
                                image: null,
                                link: "",
                                date_created: ""
                            });
                            setPortfolioPreview(null);
                        }}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Simpan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioForm;