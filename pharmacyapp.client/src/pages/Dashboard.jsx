import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import AddSupplier from "./AddSupplier";
import AddOrder from "./AddOrder";

const Dashboard = () => {
    // Only one modal can be open at a time: "supplier" or "order"
    const [activeModal, setActiveModal] = useState(null); // null | "supplier" | "order"
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
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
    // Helpers
    const openSupplierModal = () => setActiveModal("supplier");
    const openOrderModal = () => setActiveModal("order");
    const closeModal = () => setActiveModal(null);

    return (
        <div className="dashboard-bg">
            {/* Toast */}
            {toast.show && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}

            {/* Modal: Add Supplier */}
            {activeModal === "supplier" && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={closeModal}>×</button>
                        <AddSupplier />
                    </div>
                </div>
            )}
            {/* Modal: Add Order */}
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
                    <input
                        type="text"
                        placeholder="Search Drugs"
                        className="dashboard-search"
                    />
                </div>
            </header>

            <main className="dashboard-main">
                {/* SUMMARY CARDS */}
                <div className="dashboard-cards-row">
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Registered Suppliers</div>
                        <div className="dashboard-card-value">248</div>
                        <div className="dashboard-card-growth up">+12%</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Active Orders</div>
                        <div className="dashboard-card-value">89</div>
                        <div className="dashboard-card-growth up">+5%</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Stock Items</div>
                        <div className="dashboard-card-value">1,247</div>
                        <div className="dashboard-card-growth up">+8%</div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-label">Manufacturing Plants</div>
                        <div className="dashboard-card-value">12</div>
                        <div className="dashboard-card-growth up">+2%</div>
                    </div>
                </div>

                <div className="dashboard-bottom-row">
                    {/* SERVICES PANEL */}
                    <div className="dashboard-panel services-panel">
                        <div className="dashboard-tabs">
                            <button className="dashboard-tab active">Services</button>
                            <button className="dashboard-tab">Suppliers</button>
                            <button className="dashboard-tab">Inventory</button>
                            <button className="dashboard-tab">Orders</button>
                        </div>
                        <div className="dashboard-service-cards">
                            <div
                                className="dashboard-service-card"
                                onClick={openSupplierModal}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="service-card-title">Supplier Registration</div>
                                <div className="service-card-desc">Register new suppliers</div>
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
                                onClick={openOrderModal}
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
                    {/* RECENT ACTIVITIES */}
                    <div className="dashboard-panel recent-panel">
                        <div className="panel-title">Recent Activities</div>
                        <div className="panel-subtitle">Latest system activities and updates</div>
                        <ul className="recent-list">
                            <li>New supplier registered <span className="recent-time">(2 hours ago)</span></li>
                            <li>Stock updated <span className="recent-time">(4 hours ago)</span></li>
                            <li>Order placed <span className="recent-time">(6 hours ago)</span></li>
                            <li>Tender published <span className="recent-time">(1 day ago)</span></li>
                        </ul>
                    </div>
                    {/* QUICK ACTIONS */}
                    <div className="dashboard-panel actions-panel">
                        <div className="panel-title">Quick Actions</div>
                        <ul className="actions-list">
                            <li><button className="action-link">Publish New Tender</button></li>
                            <li><button className="action-link">Search Drug Catalog</button></li>
                            <li><button className="action-link">View Reports</button></li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
