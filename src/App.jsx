import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthContext } from "./context/AuthContext.jsx";

function AppContent() {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Buy It</Link>
        </div>
        <div className="nav-links">
          {user && user.role === "admin" && location.pathname !== "/admin" && (
            <Link to="/admin">Admin</Link>
          )}
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
          {location.pathname === "/cart" ? (
            <button onClick={goBack} className="nav-back-btn">
              ← Back
            </button>
          ) : (
            <Link to="/cart">Cart</Link>
          )}
        </div>
      </nav>
      {location.pathname === "/admin" && (
        <div className="sub-navbar">
          <button onClick={goBack} className="sub-nav-back-btn">
            ← Back to Shop
          </button>
        </div>
      )}

      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
