// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.access;

      // Store token — interceptor will use it automatically
      localStorage.setItem("token", token);

      navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErr("Invalid credentials — check username/password.");
      } else {
        setErr("Login failed — check server and network.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={submit}>
          <div className="input-group">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <div className="error">{err}</div>}

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
