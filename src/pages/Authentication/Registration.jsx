import { useState } from "react";

export default function TenderHubRegistration() {
    const [role, setRole] = useState("vendor");

    const handleRoleToggle = (selectedRole) => {
        setRole(selectedRole);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen p-6 gap-10 bg-white">
            {/* Left Side */}
            <section
                className="hidden lg:flex flex-1 rounded-2xl bg-gradient-to-b from-[#dbe9ff] via-[#5a8ff9] to-[#7a7fff] relative text-white flex-col p-8 overflow-hidden"
                aria-label="Promotional information about TenderHub"
            >
                <div className="text-[#5a8ff9] font-semibold italic text-lg z-10">TenderHub</div>
                <button
                    type="button"
                    className="mt-auto self-start bg-white/30 border border-white/50 text-white rounded-md px-3 py-1.5 text-sm hover:bg-white/45 transition z-10"
                    aria-label="Join Us button with smiling emoji">
                    Join Us 🤩</button>
                <h1 className="text-4xl font-semibold my-6 z-10">Start Your Journey.</h1>
                <div className="flex flex-col md:flex-row gap-3 z-10">
                    <div className="flex-1 bg-white text-[#5a8ff9] shadow-[0_0_0_1px_rgba(90,143,249,0.3)] rounded-md p-4 text-sm">
                        <strong className="block font-semibold text-xl mb-1">Tender Terbuka</strong>
                        Semua freelancer bisa ikut menawarkan jasa untuk proyek, bikin proses lebih adil dan transparan.
                    </div>

                    <div className="flex-1 bg-white/10 text-white backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.3)] rounded-md p-4 text-sm">
                        <strong className="block font-semibold text-xl mb-1">Pantau Progress Proyek</strong>
                        Client bisa melihat sejauh mana proyek dikerjakan.
                    </div>

                    <div className="flex-1 bg-white/10 text-white backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.3)] rounded-md p-4 text-sm">
                        <strong className="block font-semibold text-xl mb-1">Tampilan Modern</strong>
                        Tampilannya cepat, ringan, dan enak dipakai di semua perangkat.
                    </div>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none rounded-2xl"></div>
            </section>

            {/* Right Side */}
            <section className="flex-1 max-w-xl flex flex-col" aria-label="Create new account form">
                <h2 className="text-2xl font-bold mb-6">Buat Akun Baru</h2>
                <form className="flex flex-col">
                    <label htmlFor="role" className="font-semibold text-base mb-2">Daftar Sebagai</label>
                    <div
                        className="flex bg-gray-200 rounded-full overflow-hidden mb-5"
                        role="radiogroup"
                        aria-labelledby="role-label"
                    >
                        {['client', 'vendor'].map((r) => (
                            <div
                                key={r}
                                tabIndex={0}
                                role="radio"
                                aria-checked={role === r}
                                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer transition rounded-full ${role === r ? 'bg-[#5a8ff9] text-white' : 'text-gray-500'
                                    }`}
                                onClick={() => handleRoleToggle(r)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRoleToggle(r)}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </div>
                        ))}
                    </div>

                    <label htmlFor="fullname" className="font-semibold text-base mb-2">Nama Lengkap</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        placeholder="Masukan nama Lengkap"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="email" className="font-semibold text-base mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Masukan Email"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="password" className="font-semibold text-base mb-2">Kata Sandi</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Masukan Kata Sandi"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="confirm-password" className="font-semibold text-base mb-2">Konfirmasi Kata Sandi</label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Masukan Ulang Kata Sandi"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#5a8ff9] hover:bg-[#4a7de6] text-white font-semibold text-lg py-3 rounded-full mb-5"
                    >
                        Daftar
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Sudah punya akun? <a href="/login" className="font-medium text-[#5a8ff9]">Masuk di sini</a>
                </p>
            </section>
        </div>
    );
}