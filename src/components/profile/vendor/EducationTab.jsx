import React from 'react';

const EducationTab = ({
    educationItems,
    isAddingEducation,
    setIsAddingEducation,
    newEducation,
    handleEducationInputChange,
    handleAddEducation,
    handleDeleteEducation,
    isLoading
}) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Pendidikan Saya</h3>
                {!isAddingEducation && (
                    <button
                        onClick={() => setIsAddingEducation(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Pendidikan
                    </button>
                )}
            </div>

            {isAddingEducation && (
                <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Tambah Pendidikan Baru</h4>
                    <form onSubmit={handleAddEducation}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Institusi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="institution"
                                    value={newEducation.institution}
                                    onChange={handleEducationInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama Institusi/Universitas"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Gelar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="degree"
                                    value={newEducation.degree}
                                    onChange={handleEducationInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Gelar (contoh: S1, MBA)"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Bidang Studi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="field_of_study"
                                value={newEducation.field_of_study}
                                onChange={handleEducationInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Jurusan/Program Studi"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={newEducation.start_date}
                                    onChange={handleEducationInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={newEducation.end_date}
                                    onChange={handleEducationInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">Kosongkan jika masih berlangsung</p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2 rounded-lg transition duration-200 flex items-center justify-center`}
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
                                onClick={() => setIsAddingEducation(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition duration-200"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {educationItems.length === 0 && !isAddingEducation ? (
                <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-graduation-cap text-4xl mb-3"></i>
                    <p className="text-xl">Belum ada riwayat pendidikan</p>
                    <p className="mt-2">Tambahkan riwayat pendidikan Anda untuk meningkatkan profil</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {educationItems.map((education) => (
                        <div key={education.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800">{education.degree} - {education.field_of_study}</h4>
                                    <p className="text-gray-600 font-medium mt-1">{education.institution}</p>
                                    <p className="text-gray-500 mt-2">
                                        {new Date(education.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                        {' - '}
                                        {education.end_date
                                            ? new Date(education.end_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                                            : 'Sekarang'
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEducation(education.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-200"
                                    title="Hapus Pendidikan"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EducationTab;