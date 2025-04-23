import React from "react";
import backgroundImage from "../assets/images/bg.png";

const HomePage = () => {
    return (
        <div
            className="page-container bg-cover bg-center bg-no-repeat min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Hero Section */}
            <section className="relative px-6 py-16 md:py-24 text-center">
                <div className="relative z-1 bg-opacity-50 p-6 md:p-10 rounded-lg animate-fade-in mx-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Temukan Proyek, Raih Kesempatan Bangun Karier.
                    </h1>
                    <p className="text-sky-100 text-sm md:text-base mb-6">
                        TenderHub adalah tempat bertemunya pemilik proyek dan freelancer digital terbaik. Mulai sekarang, semua jadi lebih mudah.
                    </p>
                    <button className="bg-white transition duration-300 text-blue-400 rounded-full py-3 px-24 font-semibold text-lg shadow-xl shadow-opacity-50">
                        Mulai
                    </button>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="text-center px-4 sm:px-6 md:px-12">
                <h2 className="text-2xl font-bold text-white mb-6">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mx-auto">
                {/* <div className="grid grid-cols-6 gap-6 mx-auto"> */}
                    {[
                        { icon: "ri-code-line", label: "Web Development" },
                        { icon: "ri-gamepad-line", label: "Game Development" },
                        { icon: "ri-palette-line", label: "UI/UX" },
                        { icon: "ri-leaf-line", label: "Lingkungan" },
                        { icon: "ri-book-line", label: "Pendidikan" },
                        { icon: "ri-heart-line", label: "Kesehatan" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="shadow-lg shadow-slate-400/20 bg-white text-blue-500 rounded-lg p-6 hover:scale-105 transition duration-300"
                        >
                            <div className="bg-gradient-to-r from-[#86B0FB] to-[#639BFF] text-white p-4 rounded-lg mb-4">
                                <i className={`${item.icon} text-2xl`} /> {/* Ikon */}
                            </div>
                            <span className="font-semibold text-lg">{item.label}</span> {/* Label kategori */}
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="text-center my-10 px-4 sm:px-6 md:px-12">
                <h2 className="text-2xl font-bold text-blue-500 mb-6">Bagaimana Cara Kerjanya?</h2>
                <div className="flex flex-wrap gap-6 justify-center">
                    {[
                        {
                            title: "Daftar sebagai Vendor atau Client",
                            desc: "Buat akun dan isi profilmu."
                        },
                        {
                            title: "Posting atau Ajukan Proyek",
                            desc: "Vendor membuat proyek, Client memberikan penawaran."
                        },
                        {
                            title: "Kerja Sama & Selesaikan Proyek",
                            desc: "Gunakan fitur progress tracker & escrow untuk kerja yang aman dan nyaman."
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-[#86B0FB] to-[#639BFF] text-white rounded-lg p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[140px] hover:scale-105 transition duration-300"
                        >
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose TenderHub */}
            <section className="text-center my-10 px-4 sm:px-6 md:px-12">
                <h2 className="text-2xl font-bold text-blue-500 mb-6">Kenapa Pilih TenderHub?</h2>
                <p className="text-sm text-gray-500 mb-6">Aman, Transparan, dan Profesional</p>
                <div className="flex flex-wrap gap-6 justify-center">
                    {[
                        {
                            title: "Proyek terbuka & kompetitif",
                            desc: "Proyek-proyek di TenderHub terbuka untuk semua pihak dan sangat kompetitif."
                        },
                        {
                            title: "Pantau progress secara real-time",
                            desc: "Pantau progress proyek dengan fitur pelacakan secara real-time."
                        },
                        {
                            title: "Proses Cepat dan Efisien",
                            desc: "Dengan proses yang cepat dan efisien, proyek dapat selesai tepat waktu."
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="shadow-lg shadow-slate-400/20 bg-white text-blue-500 rounded-lg p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[140px] hover:scale-105 transition duration-300"
                        >
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;