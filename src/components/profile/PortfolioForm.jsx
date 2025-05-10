import React from 'react';

const PortfolioForm = ({
    newPortfolio,
    portfolioPreview,
    handlePortfolioInputChange,
    handlePortfolioImageChange,
    handleAddPortfolio,
    setIsAddingPortfolio,
    isLoading
}) => {
    return (
        <div className="border border-blue-200 rounded-lg p-5 bg-blue-50 mb-6">
            <h4 className="font-semibold text-lg mb-4">Tambah Portfolio Baru</h4>
            <form onSubmit={handleAddPortfolio} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Judul*</label>
                    <input
                        name="title"
                        value={newPortfolio.title}
                        onChange={handlePortfolioInputChange}
                        required
                        className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Deskripsi*</label>
                    <textarea
                        name="description"
                        value={newPortfolio.description}
                        onChange={handlePortfolioInputChange}
                        required
                        className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none h-24 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Gambar*</label>
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                            <i className="fas fa-cloud-upload-alt mr-2"></i>
                            Pilih File
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePortfolioImageChange}
                                className="hidden"
                                required={!portfolioPreview}
                            />
                        </label>
                        {portfolioPreview && (
                            <div className="relative">
                                <img
                                    src={portfolioPreview}
                                    alt="Portfolio preview"
                                    className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPortfolioPreview(null);
                                        setNewPortfolio(prev => ({ ...prev, image: null }));
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Link (Opsional)</label>
                    <input
                        name="link"
                        type="url"
                        value={newPortfolio.link}
                        onChange={handlePortfolioInputChange}
                        className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                        placeholder="https://example.com"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Tanggal Dibuat*</label>
                    <input
                        name="date_created"
                        type="date"
                        value={newPortfolio.date_created}
                        onChange={handlePortfolioInputChange}
                        required
                        className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
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
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </>
                        ) : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioForm;