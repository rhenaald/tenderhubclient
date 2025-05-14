import React from 'react';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-9xl font-bold text-red-500">403</div>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">Akses Ditolak</h1>
            <p className="text-xl text-gray-600 mt-4 text-center">
                Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <button
                onClick={() => window.history.back()}
                className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Kembali
            </button>
        </div>
    );
};

export default Forbidden;