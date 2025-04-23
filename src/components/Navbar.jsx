import React, { useState } from "react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-4 z-50 w-full px-4">
            <div className="mx-auto max-w-6xl bg-white shadow-md rounded-full px-6 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="text-xl font-bold text-blue-500 italic">TenderHub</div>

                {/* Search Bar - desktop only */}
                <div className="hidden md:flex relative flex-1 max-w-md">
                    <input
                        type="search"
                        placeholder="Search Here..."
                        className="w-full p-2 pl-4 pr-10 rounded-full bg-gray-100 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <i className="ri-search-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
                    <a href="/" className="hover:text-blue-500">Beranda</a>
                    <a href="#" className="hover:text-blue-500">Proyek</a>
                    <a href="#" className="flex items-center hover:text-blue-500">
                        Explore <i className="ri-arrow-down-s-line ml-1 text-base" />
                    </a>
                    <a
                        href="/login"
                        className="bg-blue-100 text-blue-500 rounded-full py-2 px-4 font-semibold hover:bg-blue-200 transition"
                    >
                        Masuk
                    </a>
                    <a
                        href="/register"
                        className="bg-blue-500 text-white rounded-full py-2 px-4 font-semibold hover:bg-blue-600 transition"
                    >
                        Daftar
                    </a>
                </nav>

                {/* Hamburger - mobile only */}
                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <i className="ri-menu-line text-2xl text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden mt-2 mx-auto max-w-6xl bg-white rounded-xl shadow-md p-6 space-y-4 text-sm font-medium text-gray-700">
                    <div className="relative flex mb-4">
                        <input
                            type="search"
                            placeholder="Search Here..."
                            className="w-full p-2 pl-4 pr-10 rounded-full bg-gray-100 text-sm text-gray-600 placeholder:text-gray-400"
                        />
                        <i className="ri-search-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                    </div>
                    <a href="/" className="block hover:text-blue-500">Beranda</a>
                    <a href="#" className="block hover:text-blue-500">Proyek</a>
                    <a href="#" className="block hover:text-blue-500">Explore</a>
                    <a
                        href="/login"
                        className="block bg-blue-100 text-blue-500 rounded-full py-2 px-4 font-semibold hover:bg-blue-200 transition text-center"
                    >
                        Masuk
                    </a>
                    <a
                        href="/register"
                        className="block bg-blue-500 text-white rounded-full py-2 px-4 font-semibold hover:bg-blue-600 transition text-center"
                    >
                        Daftar
                    </a>
                </div>
            )}
        </header>
    );
};

export default Header;
