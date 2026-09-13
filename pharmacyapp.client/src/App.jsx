import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InventoryManagement from "./pages/InventoryManagement";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import PharmacyNetwork from "./pages/PharmacyNetwork";
import { useState, useEffect } from "react";
import OrderManagement from "./pages/OrderManagement";
import SupplierManagement from "./pages/SupplierManagement";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    useEffect(() => {
        const onStorage = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRole(localStorage.getItem("role") || "");
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole("");
    };

    const homeRedirect = isLoggedIn
        ? (role === "admin"
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/user-dashboard" replace />)
        : <Navigate to="/login" replace />;

    const adminOnly = (element) =>
        isLoggedIn && role === "admin" ? element : <Navigate to="/login" replace />;

    return (
        <Router>
            <Routes>
                <Route path="/" element={homeRedirect} />

                <Route
                    path="/login"
                    element={
                        isLoggedIn
                            ? homeRedirect
                            : <Login onLogin={() => {
                                setIsLoggedIn(true);
                                setRole(localStorage.getItem("role") || "");
                            }} />
                    }
                />

                <Route
                    path="/dashboard"
                    element={adminOnly(<Dashboard onLogout={handleLogout} />)}
                />

                <Route
                    path="/user-dashboard"
                    element={
                        isLoggedIn && role === "user"
                            ? <UserDashboard onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />

                <Route path="/inventory" element={adminOnly(<InventoryManagement />)} />
                <Route path="/pharmacy-network" element={adminOnly(<PharmacyNetwork />)} />

                <Route path="*" element={homeRedirect} />
                <Route path="/order-management" element={adminOnly(<OrderManagement />)} />
                <Route path="/supplier-management" element={adminOnly(<SupplierManagement />)} />
            </Routes>
        </Router>
    );
}

export default App;