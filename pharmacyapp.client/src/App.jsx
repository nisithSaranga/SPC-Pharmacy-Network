import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InventoryManagement from "./pages/InventoryManagement";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import PharmacyNetwork from "./pages/PharmacyNetwork";
import { useState, useEffect } from "react";

function App() {
    // Track login state and role
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    // Update state if storage changes (e.g., another tab logs in/out)
    useEffect(() => {
        const onStorage = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRole(localStorage.getItem("role") || "");
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Log out helper
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole("");
    };

    return (
        <Router>
            <Routes>
                {/* Home: redirect to correct dashboard or login */}
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? (role === "admin"
                                ? <Navigate to="/dashboard" replace />
                                : <Navigate to="/user-dashboard" replace />)
                            : <Navigate to="/login" replace />
                    }
                />
                {/* Login route */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn
                            ? (role === "admin"
                                ? <Navigate to="/dashboard" replace />
                                : <Navigate to="/user-dashboard" replace />)
                            : <Login onLogin={() => {
                                setIsLoggedIn(true);
                                setRole(localStorage.getItem("role") || "");
                            }} />
                    }
                />

                {/* Admin Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn && role === "admin"
                            ? <Dashboard onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />
                {/* User Dashboard */}
                <Route
                    path="/user-dashboard"
                    element={
                        isLoggedIn && role === "user"
                            ? <UserDashboard onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />
                {/* Inventory (Admins only, or both if you want) */}
                <Route
                    path="/inventory"
                    element={
                        isLoggedIn && role === "admin"
                            ? <InventoryManagement />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/pharmacy-network"
                    element={
                        isLoggedIn && role === "admin"
                            ? <PharmacyNetwork />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* Fallback: always redirect correctly */}
                <Route
                    path="*"
                    element={
                        isLoggedIn
                            ? (role === "admin"
                                ? <Navigate to="/dashboard" replace />
                                : <Navigate to="/user-dashboard" replace />)
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn && role === "admin"
                            ? <Dashboard onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="/user-dashboard"
                    element={
                        isLoggedIn && role === "user"
                            ? <UserDashboard onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;


