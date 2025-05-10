import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { authService } from "./api/apiService";

import HomePage from "./pages/HomePage";
import Projek from "./pages/Projek";
import Registration from "./Authentication/Registration";
import Login from "./Authentication/Login";
import DetailProjek from "./pages/DetailProjek";
import ProfilePage from "./pages/Profile";
import ActivityPage from "./pages/Activity";
import ProfileVendor from "./pages/vendors/Profile";
import ProfileClient from "./pages/clients/Profile";
import Dashboard from "./pages/admin/dashboard";
import ProjectDetail from "./components/profile/client/ProjectDetail";

// PrivateRoute component with authService
const PrivateRoute = ({ children }) => {
  const isLoggedIn = authService.isAuthenticated();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function LayoutWrapper() {
  const location = useLocation();
  const hiddenRoutes = ["/register", "/login"];

  return (
    <>
      {!hiddenRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<DetailProjek />} />
        <Route path="/projects" element={<Projek />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* Profile routes */}
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/profile-vendor" element={
          <PrivateRoute>
            <ProfileVendor />
          </PrivateRoute>
        } />
        <Route path="/profile-client" element={
          <PrivateRoute>
            <ProfileClient />
          </PrivateRoute>
        } />

        <Route path="/activity" element={
          <PrivateRoute>
            <ActivityPage />
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Move the ProjectDetail route inside Routes */}
        <Route path="/ProjectDetail/:id" element={<ProjectDetail />} />
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