import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token in requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                // If token refresh is successful
                if (response.status === 200) {
                    // Update tokens in localStorage
                    localStorage.setItem('access_token', response.data.access);

                    // Update authorization header
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                    // Retry the original request
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, logout the user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_data');
                // Redirect to login page
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to get user type from API response
const getUserTypeFromResponse = (response) => {
    // Try to get user type from the response data
    if (response.data && response.data.user_type) {
        return response.data.user_type;
    }

    if (response.data && response.data.user && response.data.user.user_type) {
        return response.data.user.user_type;
    }

    // As a fallback, try to get it from the token
    try {
        const base64Url = response.data.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        // Check common field names for user type
        return payload.user_type || payload.userType || payload.role || payload.type || 'unknown';
    } catch (e) {
        console.error('Error extracting user type from token', e);
        return 'unknown';
    }
};

// Auth services
export const authService = {
    login: async (username, password) => {
        const response = await apiClient.post('/auth/token/', { username, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Get user type from response
            const userType = getUserTypeFromResponse(response);

            // Store user data in localStorage
            try {
                const base64Url = response.data.access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                // Store username, user_id, and user_type
                localStorage.setItem('user_data', JSON.stringify({
                    username: payload.username || username,
                    user_id: payload.user_id || payload.sub || payload.id,
                    user_type: userType
                }));

                console.log("Stored user data with type:", userType);
            } catch (e) {
                console.error('Error parsing token', e);
            }
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
        }
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    getCurrentUser: () => {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    // New function to determine and set user type
    determineUserType: async () => {
        try {
            // Try to get from user_data first
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const parsedData = JSON.parse(userData);
                if (parsedData.user_type) {
                    return parsedData.user_type;
                }
            }

            // If not found, try to get from token
            const token = localStorage.getItem('access_token');
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                let userType = payload.user_type || payload.userType || payload.role || payload.type;

                if (userType) {
                    // Update user_data with the found user type
                    if (userData) {
                        const parsedData = JSON.parse(userData);
                        parsedData.user_type = userType;
                        localStorage.setItem('user_data', JSON.stringify(parsedData));
                    } else {
                        localStorage.setItem('user_data', JSON.stringify({
                            username: payload.username || payload.sub || 'user',
                            user_id: payload.user_id || payload.sub || payload.id,
                            user_type: userType
                        }));
                    }

                    return userType;
                }
            }

            // If still not found, make an API call to user profile endpoint
            const profileResponse = await apiClient.get('/users/profile/');
            if (profileResponse.data && profileResponse.data.user_type) {
                const userType = profileResponse.data.user_type;

                // Update user_data with the found user type
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    parsedData.user_type = userType;
                    localStorage.setItem('user_data', JSON.stringify(parsedData));
                } else {
                    localStorage.setItem('user_data', JSON.stringify({
                        username: profileResponse.data.username || 'user',
                        user_id: profileResponse.data.id,
                        user_type: userType
                    }));
                }

                return userType;
            }

            return 'unknown';
        } catch (error) {
            console.error('Error determining user type:', error);
            return 'unknown';
        }
    }
};

// User services
export const userService = {
    register: async (userData) => {
        return await apiClient.post('/users/register/', userData);
    },

    getCurrentUserProfile: async () => {
        return await apiClient.get('/users/profile/');
    },

    updateUserProfile: async (profileData) => {
        return await apiClient.put('/users/profile/', profileData);
    },

    getClientProfile: async () => {
        return await apiClient.get('/users/client-profile/');
    },

    updateClientProfile: async (profileData) => {
        return await apiClient.put('/users/client-profile/', profileData);
    },

    getAllVendors: async () => {
        return await apiClient.get('/users/vendors/');
    },

    getCurrentVendorProfile: async () => {
        return await apiClient.get('/users/vendors/me/');
    },

    updateVendorProfile: async (profileData) => {
        return await apiClient.put('/users/vendors/me/', profileData);
    },

    getVendorById: async (id) => {
        return await apiClient.get(`/users/vendors/${id}/`);
    }
};

export default {
    auth: authService,
    user: userService
};