import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#86B0FB] to-[#639BFF] text-white pt-10 pb-6 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold text-base mb-4">Tentang TenderHub</h4>
                    <p className="text-sm leading-relaxed">
                        TenderHub adalah platform digital yang memudahkan proses tender proyek freelance, mempertemukan klien dan profesional secara efisien.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-base mb-4">Kategori</h4>
                    <ul className="text-sm space-y-2">
                        <li><a href="#" className="hover:underline">Kesehatan</a></li>
                        <li><a href="#" className="hover:underline">UI Design</a></li>
                        <li><a href="#" className="hover:underline">Web Design</a></li>
                        <li><a href="#" className="hover:underline">Pendidikan</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-base mb-4">Tautan Cepat</h4>
                    <ul className="text-sm space-y-2">
                        <li><a href="#" className="hover:underline">Beranda</a></li>
                        <li><a href="#" className="hover:underline">Tentang Kami</a></li>
                        <li><a href="#" className="hover:underline">Proyek</a></li>
                        <li><a href="#" className="hover:underline">Cara Kerja</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-base mb-4">Terhubung dengan Kami</h4>
                    <ul className="text-sm space-y-2">
                        <li><a href="#" className="hover:underline">Instagram</a></li>
                        <li><a href="#" className="hover:underline">LinkedIn</a></li>
                        <li><a href="#" className="hover:underline">Facebook</a></li>
                        <li><a href="#" className="hover:underline">Twitter</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs text-white/70">
                © {new Date().getFullYear()} TenderHub. Semua hak dilindungi.
            </div>
        </footer>
    );
};

export default Footer;
