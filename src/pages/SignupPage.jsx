import React, { useState } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });
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
