import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService, apiClient } from "../api/apiService";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ username: "", userType: "" });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);

    // Check login status and determine user type on component mount
    useEffect(() => {
        const checkLoginStatus = async () => {
            // Check if token exists
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoggedIn(false);
                setUserData({ username: "", userType: "" });
                return;
            }

            setIsLoggedIn(true);

            // First try to get user data from localStorage
            const storedUserData = localStorage.getItem('user_data');
            if (storedUserData) {
                try {
                    const parsedUserData = JSON.parse(storedUserData);
                    const foundUsername = parsedUserData.username || "";
                    let foundUserType = parsedUserData.user_type || "";

                    // If we have a valid user type in localStorage, use it
                    if (foundUserType && foundUserType !== 'unknown') {
                        setUserData({
                            username: foundUsername,
                            userType: foundUserType
                        });
                        return;
                    }

                    // Otherwise, continue to determine user type
                    setUserData(prev => ({
                        ...prev,
                        username: foundUsername
                    }));
                } catch (error) {
                    console.error("Error parsing stored user data:", error);
                }
            }

            // If we reach here, we need to determine the user type
            try {
                // First try vendor endpoint
                try {
                    const vendorResponse = await apiClient.get('/users/vendors/me/');
                    if (vendorResponse.status === 200) {
                        updateUserData("vendor");
                        return;
                    }
                } catch (vendorError) {
                    console.log("Not a vendor user");
                }

                // Then try client endpoint
                try {
                    const clientResponse = await apiClient.get('/users/client-profile/');
                    if (clientResponse.status === 200) {
                        updateUserData("client");
                        return;
                    }
                } catch (clientError) {
                    console.log("Not a client user");
                }

                // Fallback to profile endpoint
                try {
                    const profileResponse = await apiClient.get('/users/profile/');
                    if (profileResponse.data && profileResponse.data.user_type) {
                        updateUserData(profileResponse.data.user_type);
                        return;
                    }
                } catch (profileError) {
                    console.error("Error fetching profile:", profileError);
                }

                // If all else fails, parse the token for user type
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64));

                    if (payload.user_type) {
                        updateUserData(payload.user_type);
                        return;
                    }
                } catch (tokenError) {
                    console.error("Error parsing token:", tokenError);
                }

                // Last resort
                console.warn("Could not determine user type, using 'user' as default");
                updateUserData("user");
            } catch (error) {
                console.error("Error checking user type:", error);
                updateUserData("user");
            }
        };

        const updateUserData = (userType) => {
            setUserData(prev => ({
                ...prev,
                userType
            }));

            // Update localStorage with the found user type
            try {
                const storedData = localStorage.getItem('user_data');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    parsedData.user_type = userType;
                    localStorage.setItem('user_data', JSON.stringify(parsedData));
                } else {
                    // Create new user_data if it doesn't exist
                    const username = userData.username || "";
                    localStorage.setItem('user_data', JSON.stringify({
                        username,
                        user_type: userType
                    }));
                }
            } catch (e) {
                console.error("Error updating user data in localStorage:", e);
            }
        };

        checkLoginStatus();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-toggle')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setIsLoggedIn(false);
        setUserData({ username: "", userType: "" });
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/');
    };

    const getProfilePath = () => {
        const { userType } = userData;
        switch (userType.toLowerCase()) {
            case "vendor":
                return "/profile-vendor";
            case "client":
                return "/profile-client";
            default:
                return "/dashboard"; 
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(prev => !prev);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(prev => !prev);
    };

    return (
        <header className="fixed top-4 z-50 w-full px-4">
            <div className="mx-auto max-w-6xl bg-white shadow-md rounded-full px-6 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-blue-500 italic">TenderHub</Link>

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
                    <Link to="/" className="hover:text-blue-500">Beranda</Link>
                    <Link to="/projects" className="hover:text-blue-500">Proyek</Link>
                    <button className="flex items-center hover:text-blue-500">
                        Explore <i className="ri-arrow-down-s-line ml-1 text-base" />
                    </button>

                    {/* Conditional rendering based on login status */}
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center bg-blue-100 text-blue-500 rounded-full py-2 px-4 font-semibold hover:bg-blue-200 transition"
                            >
                                <span className="mr-1">{userData.username}</span>
                                {userData.userType && (
                                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full mr-1">
                                        {userData.userType}
                                    </span>
                                )}
                                <i className="ri-arrow-down-s-line text-base" />
                            </button>

                            {/* User dropdown menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                                    <Link
                                        to={getProfilePath()}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="ri-user-line mr-2"></i>Profile
                                    </Link>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                    >
                                        <i className="ri-logout-box-r-line mr-2"></i>Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-blue-100 text-blue-500 rounded-full py-2 px-4 font-semibold hover:bg-blue-200 transition"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white rounded-full py-2 px-4 font-semibold hover:bg-blue-600 transition"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </nav>

                {/* Hamburger - mobile only */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden menu-toggle"
                >
                    <i className={`ri-${menuOpen ? 'close-line' : 'menu-line'} text-2xl text-gray-700`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`lg:hidden mt-2 mx-auto max-w-6xl bg-white rounded-xl shadow-xl p-6 space-y-4 text-sm font-medium text-gray-700 transition-all duration-300 ease-in-out ${menuOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                style={{
                    position: 'fixed',
                    left: '1rem',
                    right: '1rem',
                    zIndex: 40,
                    top: '5.5rem',
                    display: menuOpen ? 'block' : 'none'
                }}
            >
                <div className="relative flex mb-4">
                    <input
                        type="search"
                        placeholder="Search Here..."
                        className="w-full p-2 pl-4 pr-10 rounded-full bg-gray-100 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <i className="ri-search-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                </div>
                <Link
                    to="/"
                    className="block hover:text-blue-500 py-2"
                    onClick={() => setMenuOpen(false)}
                >
                    Beranda
                </Link>
                <Link
                    to="/projects"
                    className="block hover:text-blue-500 py-2"
                    onClick={() => setMenuOpen(false)}
                >
                    Proyek
                </Link>
                <button className="block w-full text-left hover:text-blue-500 py-2">
                    Explore
                </button>

                {/* Conditional rendering for mobile menu */}
                {isLoggedIn ? (
                    <>
                        <div className="bg-blue-50 text-blue-600 rounded-lg p-3 mb-2 border border-blue-100">
                            <div className="font-semibold mb-2">
                                Hello, {userData.username}
                                {userData.userType && (
                                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full ml-2">
                                        {userData.userType}
                                    </span>
                                )}
                            </div>
                            <Link
                                to={getProfilePath()}
                                className="block py-2 px-2 hover:bg-blue-100 rounded-md"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="ri-user-line mr-2"></i>Profile
                            </Link>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="block w-full bg-red-50 text-red-500 rounded-full py-2 px-4 font-semibold hover:bg-red-100 transition text-center"
                        >
                            <i className="ri-logout-box-r-line mr-2"></i>Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="block bg-blue-100 text-blue-500 rounded-full py-2 px-4 font-semibold hover:bg-blue-200 transition text-center mb-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            Masuk
                        </Link>
                        <Link
                            to="/register"
                            className="block bg-blue-500 text-white rounded-full py-2 px-4 font-semibold hover:bg-blue-600 transition text-center"
                            onClick={() => setMenuOpen(false)}
                        >
                            Daftar
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;