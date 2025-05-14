import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../api/apiService";
import { Eye, EyeOff } from 'lucide-react';

export default function TenderHubLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Check for messages from registration or other pages
    const message = location.state?.message || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError("Username dan password tidak boleh kosong");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const userData = await authService.login(username, password);
            if (userData && userData.access) {
                console.log("Login berhasil");
                // Redirect to dashboard after successful login
                navigate("/");
            } else {
                setError("Login gagal. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Login error:", err);

            // Handle specific error messages
            if (err.response) {
                // The server responded with an error status
                switch (err.response.status) {
                    case 400:
                    case 401:
                        setError("Username atau password salah");
                        break;
                    case 403:
                        setError("Akun Anda diblokir. Silakan hubungi admin");
                        break;
                    case 404:
                        setError("Server login tidak ditemukan");
                        break;
                    case 500:
                        setError("Terjadi kesalahan pada server. Coba lagi nanti");
                        break;
                    default:
                        setError(err.response.data?.detail || "Login gagal. Periksa kredensial Anda.");
                }
            } else if (err.request) {
                // The request was made but no response was received
                setError("Terjadi kesalahan jaringan. Periksa koneksi internet Anda");
            } else {
                // Something else caused the error
                setError(err.message || "Terjadi kesalahan tidak terduga");
            }
        } finally {
            setLoading(false);
        }
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

            <section className="flex-1 w-full max-w-2xl mx-auto justify-center flex flex-col px-4 md:px-10" aria-label="Login form">
                <h2 className="text-2xl font-bold mb-6">Masuk ke Akun Anda</h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <form className="flex flex-col" onSubmit={handleSubmit} aria-label="Form login akun TenderHub">
                    <label htmlFor="username" className="font-semibold text-base mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoComplete="username"
                        placeholder="Masukan Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-5 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9]"
                    />

                    <label htmlFor="password" className="font-semibold text-base mb-2">Kata Sandi</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            placeholder="Masukan Kata Sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm text-gray-600 mb-2 focus:outline-none focus:bg-[#f5faff] focus:ring-2 focus:ring-[#5a8ff9] pr-12"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5a8ff9] hover:bg-[#4a7de6] text-white font-semibold text-lg py-3 rounded-full mb-5 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>

                    {error && <p className="text-red-600 text-sm text-center mb-5">{error}</p>}
                </form>
                <p className="text-center text-sm text-gray-600">
                    Belum punya akun? <a href="/register" className="font-medium text-[#5a8ff9]">Daftar di sini</a>
                </p>
            </section>
        </div>
    );
}