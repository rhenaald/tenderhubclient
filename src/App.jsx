import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { apiClient, authService } from "./api/apiService";

import HomePage from "./pages/HomePage";
import Projek from "./pages/Projek";
import Registration from "./Authentication/Registration";
import Login from "./Authentication/Login";
import DetailProjek from "./pages/DetailProjek";
import ProfileVendor from "./pages/vendors/Profile";
import ProfileClient from "./pages/clients/Profile";
import Dashboard from "./pages/admin/dashboard";
import ProjectDetail from "./components/profile/client/ProjectDetail";
import ActiveProjectDetail from "./components/profile/client/ActiveProject";
import VendorProfile from "./pages/VendorProfile";
import ClientProfile from "./pages/ClientProfile";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const isLoggedIn = authService.isAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userType = userData.user_type;

  if (!allowedUserTypes || allowedUserTypes.includes(userType)) {
    return children;
  }

  return <Navigate to="/forbidden" replace />;
};

function LayoutWrapper() {
  const location = useLocation();
  const hiddenRoutes = ["/register", "/login"];

  const test = apiClient("/tenders")

  return (
    <>
      {!hiddenRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Public routes - accessible without login */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<Projek />} />
        <Route path="/projects/:id" element={<DetailProjek />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/profile/:id" element={<VendorProfile />} />
        <Route path="/client/profile/:id" element={<ClientProfile />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Vendor-only routes */}
        <Route path="/profile-vendor" element={
          <PrivateRoute allowedUserTypes={['vendor']}>
            <ProfileVendor />
          </PrivateRoute>
        } />

        {/* Client-only routes */}
        <Route path="/profile-client" element={
          <PrivateRoute allowedUserTypes={['client']}>
            <ProfileClient />
          </PrivateRoute>
        } />
        <Route path="/ProjectDetail/:id" element={
          <PrivateRoute allowedUserTypes={['client']}>
            <ProjectDetail />
          </PrivateRoute>
        } />

        {/* Admin-only routes */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedUserTypes={['admin']}>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Routes for both client and vendor */}
        <Route path="/Activity-projects/:id" element={
          <PrivateRoute allowedUserTypes={['client', 'vendor']}>
            <ActiveProjectDetail />
          </PrivateRoute>
        } />

        {/* 404 route - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hiddenRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}