import React, { useState, useContext } from "react";
import API from "../api.js";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;
      login(token, user);
      showNotification("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      showNotification(`Login failed: ${errorMessage}`, "error");
    }
  };

  return (
    <div className="form-container">
      <h1>Login to Your Account</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Error message with consistent spacing */}
        <div className="form-error-container">
          {error ? (
            <div className="form-error">{error}</div>
          ) : (
            <div className="form-error-placeholder"></div>
          )}
        </div>

        <button type="submit" className="form-submit-btn">
          Login to Account
        </button>
      </form>
      
      <div className="form-toggle-link">
        Don't have an account? <Link to="/signup">Create Account</Link>
      </div>
    </div>
  );
}

export default LoginPage;
