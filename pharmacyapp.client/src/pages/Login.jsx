import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch("https://localhost:7216/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                setError("Invalid credentials");
                setSubmitting(false);
                return;
            }
            const data = await res.json();
            console.log("Login API data:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role || data.Role);

            setToast({ show: true, message: "Login successful!", type: "success" });
            setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                setSubmitting(false);
                onLogin && onLogin();
            }, 1200);

        } catch {
            setError("Login failed.");
            setSubmitting(false);
        }
    };


    return (
        <div className="login-bg">
            <div className="login-container">
                <img src="/spc-logo.png" alt="SPC Logo" className="login-logo" />
                <div className="login-title">SPC SOC Portal</div>
                <div className="login-subtitle">Sign in to your account</div>
                <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                    <div>
                        <label className="login-label" htmlFor="login-username">Username&nbsp;</label>
                        <input
                            id="login-username"
                            className="login-input"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="login-label" htmlFor="login-password">Password&nbsp;</label>
                        <input
                            id="login-password"
                            className="login-input"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <div className="login-error">{error}</div>}
                    <button className="login-btn" type="submit" disabled={submitting}>
                        {submitting ? "Signing in..." : "Login"}
                    </button>
                    {toast.show && (
                        <div className={`toast-message ${toast.type}`}>{toast.message}</div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;

