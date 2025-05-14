import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-9xl font-bold text-gray-800">404</div>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">Halaman Tidak Ditemukan</h1>
            <p className="text-xl text-gray-600 mt-4 text-center">
                Halaman yang Anda cari mungkin telah dihapus, berubah nama, atau sedang tidak tersedia.
            </p>
            <div className="mt-8 flex space-x-4">
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Kembali
                </button>
                <Link
                    to="/"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
};

export default NotFound;