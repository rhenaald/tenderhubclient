import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import HomePage from "./pages/HomePage";
import Projeck from "./pages/Projek";
import Registration from "./pages/Authentication/Registration";
import Login from "./pages/Authentication/Login";
import DetailProjek from "./pages/DetailProjek";
import ProfilePage from "./pages/Profile";
import ActivityPage from "./pages/Activity";

function LayoutWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/register", "/login"];
  const hideFooterRoutes = ["/register", "/login"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/detailprojek" element={<DetailProjek />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/projeck" element={<Projeck />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
