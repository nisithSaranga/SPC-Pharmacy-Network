import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";
import AddOrder from "./AddOrder";

const Dashboard = ({ onLogout }) => {
    const [activeModal, setActiveModal] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [stats, setStats] = useState({ suppliers: null, orders: null, drugs: null, pharmacies: null });
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        if (username && role && !sessionStorage.getItem("welcomed")) {
            setToast({
                show: true,
                message: `Welcome ${role} ${username}!`,
                type: "success"
            });
            sessionStorage.setItem("welcomed", "true");
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 1800);
        }
    }, []);

    useEffect(() => {
        Promise.all([
            apiGet("/suppliers").catch(() => []),
            apiGet("/orders").catch(() => []),
            apiGet("/drugs").catch(() => []),
            apiGet("/pharmacies").catch(() => [])
        ]).then(([suppliers, orders, drugs, pharmacies]) => {
            setStats({
                suppliers: suppliers.length,
                orders: orders.length,
                drugs: drugs.length,
                pharmacies: pharmacies.length
            });
        });
    }, [activeModal]);

    const closeModal = () => setActiveModal(null);

    const handleLogout = () => {
        sessionStorage.removeItem("welcomed");
        if (onLogout) onLogout();
        navigate("/login", { replace: true });
    };

    const show = (v) => (v === null ? "—" : v.toLocaleString());

    return (
        <div className="dashboard-bg">
            {toast.show && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}

            {activeModal === "order" && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={closeModal}>×</button>
                        <AddOrder onClose={closeModal} />
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="dashboard-header">
                <div className="dashboard-header-left">
                    <img src="/spc-logo.png" alt="SPC Logo" className="dashboard-logo" />
                    <div>
                        <div className="dashboard-title">State Pharmaceutical Cooperation</div>
                        <div className="dashboard-subtitle">SOC Management System</div>
                    </div>
                </div>
                <div className="dashboard-header-right">
                    <span className="dashboard-status">System Online</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                {/* SUMMARY CARDS */}
                <div className="dashboard-cards-row">
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Registered Suppliers</div>
                        <div className="dashboard-card-value">{show(stats.suppliers)}</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Orders Placed</div>
                        <div className="dashboard-card-value">{show(stats.orders)}</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Stock Items</div>
                        <div className="dashboard-card-value">{show(stats.drugs)}</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Linked Pharmacies</div>
                        <div className="dashboard-card-value">{show(stats.pharmacies)}</div>
                    </div>
                </div>

                <div className="dashboard-bottom-row">
                    {/* SERVICES PANEL */}
                    <div className="dashboard-panel services-panel">
                        <div className="dashboard-tabs">
                            <button className="dashboard-tab active">Services</button>
                        </div>
                        <div className="dashboard-service-cards">
                            <div
                                className="dashboard-service-card"
                                onClick={() => navigate("/supplier-management")}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="service-card-title">Supplier Management</div>
                                <div className="service-card-desc">Register and view suppliers</div>
                            </div>
                            <div
                                className="dashboard-service-card"
                                onClick={() => navigate("/inventory")}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="service-card-title">Inventory Management</div>
                                <div className="service-card-desc">Manage stock levels</div>
                            </div>
                            <div
                                className="dashboard-service-card"
                                onClick={() => navigate("/order-management")}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="service-card-title">Order Management</div>
                                <div className="service-card-desc">Process pharmacy orders</div>
                            </div>
                            <div
                                className="dashboard-service-card"
                                onClick={() => navigate("/pharmacy-network")}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="service-card-title">Pharmacy Network</div>
                                <div className="service-card-desc">Manage linked pharmacies</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;