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
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Pendidikan Saya</h3>
                    <p className="text-gray-500 text-sm mt-1">Riwayat pendidikan dan pencapaian akademik</p>
                </div>
                {!isAddingEducation && (
                    <button
                        onClick={() => setIsAddingEducation(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-md flex items-center"
                    >
                        <i className="fas fa-plus mr-2 text-sm"></i>
                        Tambah Pendidikan
                    </button>
                )}
            </div>

            {/* Add Education Form */}
            {isAddingEducation && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-100">
                        <h4 className="text-xl font-bold text-gray-800 flex items-center">
                            <i className="fas fa-graduation-cap text-blue-500 mr-3"></i>
                            Tambah Pendidikan Baru
                        </h4>
                    </div>

                    <form onSubmit={handleAddEducation} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Institusi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="fas fa-university"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={newEducation.institution}
                                        onChange={handleEducationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Nama Institusi/Universitas"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Gelar <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={newEducation.degree}
                                        onChange={handleEducationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        placeholder="S1, S2, MBA, dll"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Bidang Studi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <i className="fas fa-book-open"></i>
                                </div>
                                <input
                                    type="text"
                                    name="field_of_study"
                                    value={newEducation.field_of_study}
                                    onChange={handleEducationInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Jurusan/Program Studi"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={newEducation.start_date}
                                        onChange={handleEducationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Selesai
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="far fa-calendar-check"></i>
                                    </div>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={newEducation.end_date}
                                        onChange={handleEducationInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika masih berlangsung</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddingEducation(false)}
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
                                        Simpan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {educationItems.length === 0 && !isAddingEducation ? (
                <div className=" text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-graduation-cap text-blue-500 text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Belum ada riwayat pendidikan</h4>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Tambahkan riwayat pendidikan Anda untuk melengkapi profil</p>
                    <button
                        onClick={() => setIsAddingEducation(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2.5 transition-all duration-300 hover:shadow-md"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Pendidikan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {educationItems.map((education) => (
                        <div
                            key={education.id}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group h-full"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                        <i className="fas fa-graduation-cap text-blue-500"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{education.degree}</h4>
                                        <p className="text-blue-600 font-medium line-clamp-1">{education.institution}</p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-gray-700 font-medium line-clamp-1">
                                        <i className="fas fa-book-open text-gray-400 mr-2"></i>
                                        {education.field_of_study}
                                    </p>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mt-auto">
                                    <i className="far fa-calendar-alt mr-2"></i>
                                    {new Date(education.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                    <span className="mx-2">-</span>
                                    {education.end_date
                                        ? new Date(education.end_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                                        : <span className="text-blue-500">Sekarang</span>
                                    }
                                </div>

                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => handleDeleteEducation(education.id)}
                                        className="text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        title="Hapus Pendidikan"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EducationTab;