import React from "react";
import backgroundImage from "../assets/images/bg.png";
import { apiClient } from "../api/apiService";
import { Link } from "react-router-dom";

const HomePage = () => {
    const a = apiClient("/tenders/")
    console.log(a)
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
                    <Link to={"/projects"}>
                    
                    <button className="bg-white transition duration-300 text-blue-400 rounded-full py-3 px-24 font-semibold text-lg shadow-xl shadow-opacity-50">
                        Mulai
                    </button>
                    </Link>
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
            <section className="text-center my-16 px-4 sm:px-6 md:px-12">
                <h2 className="text-2xl font-bold text-blue-500">Kenapa Pilih TenderHub?</h2>
                <p className="text-sm text-white font-medium mb-6">Aman, Transparan, dan Profesional</p>
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

            {/* Testimonials Section */}
            <section className="text-center mt-0 px-4 sm:px-6 md:px-12 py-12">
                <h2 className="text-2xl font-bold text-blue-500 mb-2">Apa Kata Mereka?</h2>
                <p className="text-sm text-gray-500 mb-8">Testimonial dari pengguna TenderHub</p>
                <div className="flex flex-wrap gap-8 justify-center">
                    {[
                        {
                            name: "Andi Wijaya",
                            role: "Freelancer Web Developer",
                            quote: "TenderHub mempertemukan saya dengan mitra kerja yang profesional. Komunikasi dan alur kerja jadi jauh lebih efisien.",
                            rating: 5
                        },
                        {
                            name: "Budi Santoso",
                            role: "Pemilik Startup",
                            quote: "Mencari freelancer berbakat jadi lebih mudah. Progress tracker membantu memantau perkembangan proyek secara real-time.",
                            rating: 4
                        },
                        {
                            name: "Citra Dewi",
                            role: "Digital Marketer",
                            quote: "Platform yang sangat membantu freelancer seperti saya. Proyeknya beragam dan kliennya profesional.",
                            rating: 5
                        }
                    ].map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-left hover:shadow-lg transition duration-300"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                            <div className="border-t border-neutral-300 pt-4">
                                <h4 className="font-semibold text-blue-500">{testimonial.name}</h4>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center px-4 sm:px-6 md:px-12 py-12 rounded-lg mx-4">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">Siap Memulai Proyek Pertamamu?</h2>
                <p className="text-neutral-500 mb-6">Bergabunglah dengan ribuan profesional lainnya di TenderHub</p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <button className="bg-blue-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300">
                        Daftar Sekarang
                    </button>
                    <button className="border border-blue text-blue-400 font-semibold py-3 px-8 rounded-full hover:bg-white hover:bg-opacity-10 transition duration-300">
                        Pelajari Lebih Lanjut
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;