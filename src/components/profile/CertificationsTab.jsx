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
        <div className="p-6">
            {!isAddingCertification ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Sertifikasi</h3>
                        <button
                            onClick={() => setIsAddingCertification(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Sertifikasi
                        </button>
                    </div>

                    {certifications && certifications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="border rounded-lg p-4 relative">
                                    <button
                                        onClick={() => handleDeleteCertification(cert.id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        title="Hapus Sertifikasi"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <h4 className="font-bold text-lg">{cert.title}</h4>
                                    <p className="text-gray-600">{cert.issuing_organization}</p>
                                    <div className="text-sm text-gray-500 mt-2">
                                        <p>Issued: {new Date(cert.issue_date).toLocaleDateString('id-ID')}</p>
                                        {cert.expiry_date && (
                                            <p>Expires: {new Date(cert.expiry_date).toLocaleDateString('id-ID')}</p>
                                        )}
                                    </div>
                                    {cert.credential_id && (
                                        <p className="text-sm mt-1">Credential ID: {cert.credential_id}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <i className="fas fa-certificate text-4xl mb-3"></i>
                            <p>Belum ada sertifikasi yang ditambahkan</p>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Sertifikasi Baru</h3>
                    <form onSubmit={handleAddCertification}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                                Judul Sertifikasi *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newCertification.title}
                                onChange={handleCertificationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ex: AWS Certified Solutions Architect"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="issuing_organization">
                                Organisasi Penerbit *
                            </label>
                            <input
                                type="text"
                                id="issuing_organization"
                                name="issuing_organization"
                                value={newCertification.issuing_organization}
                                onChange={handleCertificationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ex: Amazon Web Services"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="issue_date">
                                Tanggal Penerbitan *
                            </label>
                            <input
                                type="date"
                                id="issue_date"
                                name="issue_date"
                                value={newCertification.issue_date}
                                onChange={handleCertificationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="expiry_date">
                                Tanggal Kadaluarsa
                            </label>
                            <input
                                type="date"
                                id="expiry_date"
                                name="expiry_date"
                                value={newCertification.expiry_date}
                                onChange={handleCertificationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="credential_id">
                                ID Kredensial
                            </label>
                            <input
                                type="text"
                                id="credential_id"
                                name="credential_id"
                                value={newCertification.credential_id}
                                onChange={handleCertificationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ex: AWS-ASA-123456"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex-1 ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-lg py-2 text-lg transition duration-200 flex justify-center items-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : "Simpan"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingCertification(false)}
                                disabled={isLoading}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CertificationsTab;