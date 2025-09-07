import React, { useState } from "react";
import API from "../api.js";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationContext.jsx";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Client-side validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await API.post("/auth/register", { email, password });
      showNotification("Registration successful! Please log in.", "success");
      // Clear form after successful registration
      setEmail("");
      setPassword("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      console.error("Signup error:", errorMessage);
      setError(errorMessage);
      showNotification(`Signup failed: ${errorMessage}`, "error");
    }
  };

  return (
    <div className="form-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleSignup}>
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
            placeholder="Enter your password (min. 6 characters)"
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
          Create Account
        </button>
      </form>

      <div className="form-toggle-link">
        Already have an account? <Link to="/login">Login Here</Link>
      </div>
    </div>
  );
}
export default SignupPage;
