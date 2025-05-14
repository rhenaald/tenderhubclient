import React from 'react';

const CertificationsTab = ({
    certifications,
    isAddingCertification,
    setIsAddingCertification,
    newCertification,
    handleCertificationInputChange,
    handleAddCertification,
    handleDeleteCertification,
    isLoading
}) => {
    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Sertifikasi Profesional</h3>
                    <p className="text-gray-500 text-sm mt-1">Bukti kompetensi dan keahlian Anda</p>
                </div>

                {!isAddingCertification && (
                    <button
                        onClick={() => setIsAddingCertification(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-md flex items-center"
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        Tambah Sertifikasi
                    </button>
                )}
            </div>

            {/* Add Certification Form */}
            {isAddingCertification && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-100">
                        <h4 className="text-xl font-bold text-gray-800 flex items-center">
                            <i className="fas fa-certificate text-blue-500 mr-3"></i>
                            Tambah Sertifikasi Baru
                        </h4>
                    </div>

                    <form onSubmit={handleAddCertification} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Judul Sertifikasi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newCertification.title}
                                        onChange={handleCertificationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Contoh: AWS Certified Solutions Architect"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Organisasi Penerbit <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="fas fa-building"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="issuing_organization"
                                        value={newCertification.issuing_organization}
                                        onChange={handleCertificationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Contoh: Amazon Web Services"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Penerbitan <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                    <input
                                        type="date"
                                        name="issue_date"
                                        value={newCertification.issue_date}
                                        onChange={handleCertificationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Kadaluarsa
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="far fa-calendar-times"></i>
                                    </div>
                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={newCertification.expiry_date}
                                        onChange={handleCertificationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ada kadaluarsa</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                ID Kredensial
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <i className="fas fa-id-card"></i>
                                </div>
                                <input
                                    type="text"
                                    name="credential_id"
                                    value={newCertification.credential_id}
                                    onChange={handleCertificationInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Contoh: AWS-ASA-123456"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddingCertification(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center justify-center ${isLoading
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
                                        Simpan Sertifikasi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Certifications List */}
            {certifications.length === 0 && !isAddingCertification ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-certificate text-blue-500 text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Belum ada sertifikasi</h4>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Tambahkan sertifikasi Anda untuk menunjukkan keahlian profesional</p>
                    <button
                        onClick={() => setIsAddingCertification(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2.5 transition-all duration-300 hover:shadow-md"
                    >
                        <i className="fas fa-plus-circle mr-2"></i>
                        Tambah Sertifikasi Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative h-full"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDeleteCertification(cert.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Hapus Sertifikasi"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>

                            <div className="flex items-start mb-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                                    <i className="fas fa-certificate text-blue-500 text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 line-clamp-2">{cert.title}</h4>
                                    <p className="text-blue-600 text-sm font-medium">{cert.issuing_organization}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <i className="far fa-calendar-alt text-gray-400 mr-2 w-4"></i>
                                    <span>Diterbitkan: {new Date(cert.issue_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                                </div>

                                {cert.expiry_date && (
                                    <div className="flex items-center text-gray-600">
                                        <i className="far fa-calendar-times text-gray-400 mr-2 w-4"></i>
                                        <span>Kadaluarsa: {new Date(cert.expiry_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                                    </div>
                                )}

                                {cert.credential_id && (
                                    <div className="flex items-center text-gray-600">
                                        <i className="fas fa-id-card text-gray-400 mr-2 w-4"></i>
                                        <span>ID: {cert.credential_id}</span>
                                    </div>
                                )}
                            </div>

                            {cert.expiry_date && new Date(cert.expiry_date) < new Date() && (
                                <div className="mt-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        Kadaluarsa
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CertificationsTab;