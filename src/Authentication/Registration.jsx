import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api/apiService";

export default function TenderHubRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        user_type: 'client', // Default to client
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUserTypeToggle = (selectedType) => {
        setFormData({
            ...formData,
            user_type: selectedType,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.password2) {
            setError({ message: "Kata sandi tidak cocok!" });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await userService.register(formData);
            console.log('Registration successful', response.data);

            // Redirect to login page after successful registration
            navigate('/login', {
                state: { message: 'Pendaftaran berhasil! Anda dapat masuk sekarang.' }
            });
        } catch (err) {
            console.error('Registration error:', err);

            if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError({ message: 'Terjadi kesalahan. Silakan coba lagi.' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Format error messages for display
    const formatErrorMessage = () => {
        if (!error) return null;

        if (typeof error.message === 'string') {
            return error.message;
        }

        const messages = [];
        for (const [field, errors] of Object.entries(error)) {
            if (Array.isArray(errors)) {
                messages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
                messages.push(`${field}: ${errors}`);
            }
        }

        return messages.join('; ') || 'Terjadi kesalahan. Silakan coba lagi.';
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
            <section className="flex-1 max-w-xl mx-auto flex flex-col" aria-label="Create new account form">
                <h2 className="text-2xl font-bold mb-6">Buat Akun Baru</h2>

                {error && (
                    <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700">
                        {formatErrorMessage()}
                    </div>
                )}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="role" className="font-semibold text-base mb-2">Daftar Sebagai</label>
                    <div
                        className="flex bg-gray-200 rounded-full overflow-hidden mb-5"
                        role="radiogroup"
                        aria-labelledby="role-label"
                    >
                        {['client', 'vendor'].map((type) => (
                            <div
                                key={type}
                                tabIndex={0}
                                role="radio"
                                aria-checked={formData.user_type === type}
                                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer transition rounded-full ${formData.user_type === type ? 'bg-[#5a8ff9] text-white' : 'text-gray-500'
                                    }`}
                                onClick={() => handleUserTypeToggle(type)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleUserTypeToggle(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-5">
                            <label htmlFor="first_name" className="font-semibold text-base mb-2">Nama Depan</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Masukan Nama Depan"
                                required
                                className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mt-2 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="last_name" className="font-semibold text-base mb-2">Nama Belakang</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Masukan Nama Belakang"
                                required
                                className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mt-2 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                            />
                        </div>
                    </div>

                    <label htmlFor="username" className="font-semibold text-base mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Masukan Username"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="email" className="font-semibold text-base mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukan Email"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="password" className="font-semibold text-base mb-2">Kata Sandi</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukan Kata Sandi"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="password2" className="font-semibold text-base mb-2">Konfirmasi Kata Sandi</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        placeholder="Masukan Ulang Kata Sandi"
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#5a8ff9] hover:bg-[#4a7de6] text-white font-semibold text-lg py-3 rounded-full mb-5 ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Mendaftar..." : "Daftar"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Sudah punya akun? <a href="/login" className="font-medium text-[#5a8ff9]">Masuk di sini</a>
                </p>
            </section>
        </div>
    );
}