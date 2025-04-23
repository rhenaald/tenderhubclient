import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import HomePage from "./pages/HomePage";
import About from "./pages/AboutPage";
import Registration from "./pages/Authentication/Registration";
import Login from "./pages/Authentication/Login";

function LayoutWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/register", "/login"];
  const hideFooterRoutes = ["/register", "/login"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
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
