import React, { useState } from "react";
import API from "../api.js";
import { useNotification } from "../context/NotificationContext.jsx";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { email, password });
      showNotification("Registration successful! Please log in.");
    } catch (error) {
      console.error("Signup error:", error.response.data.message);
      showNotification(
        `Signup failed: ${error.response.data.message}`,
        "error"
      );
    }
  };

  return (
    <div className="form-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
