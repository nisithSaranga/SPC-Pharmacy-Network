import React, { useState, useEffect } from "react";
import { apiGet } from "../api";
import AddOrder from "./AddOrder"; // Import your order form/modal
import "./UserDashboard.css"; // (optional, style as you like)

const UserDashboard = ({ onLogout }) => {
    const username = localStorage.getItem("username") || "";
    const [orders, setOrders] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [search, setSearch] = useState("");
    const [searched, setSearched] = useState(false);

    // Fetch user's orders
    useEffect(() => {
        apiGet("/orders")
            .then(setOrders)
            .catch(() => setOrders([]));
    }, [showOrderModal, username]); // Refresh after new order

    // Load drug catalogue for searching
    useEffect(() => {
        apiGet("/drugs")
            .then(setDrugs)
            .catch(() => setDrugs([]));
    }, []);

    // Search drugs
    const handleSearch = (e) => {
        e.preventDefault();
        setSearched(true);
    };

    const drugResults = search
        ? drugs.filter(d => (d.name || "").toLowerCase().includes(search.toLowerCase()))
        : [];

    return (
        <div className="user-dashboard-bg">
            {/* Header */}
            <header className="user-dashboard-header">
                <img src="/spc-logo.png" alt="SPC Logo" className="dashboard-logo" />
                <span className="welcome-text">Welcome&nbsp;{username}</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </header>
            {/* Cards Row */}
            <div className="user-dashboard-cards-row">
                {/* Order Drugs */}
                <div className="user-dashboard-card">
                    <div className="card-title">Order Drugs</div>
                    <div>Place new pharmacy orders</div>
                    <button className="card-action-btn" onClick={() => setShowOrderModal(true)}>+ New Order</button>
                </div>
                {/* My Orders */}
                <div className="user-dashboard-card">
                    <div className="card-title">My Orders</div>
                    <div>View your previous orders</div>
                    {/* Orders Table */}
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Drug</th>
                                    <th>Qty</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order =>
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.drugName}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.status}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {orders.length === 0 && <div>No orders found.</div>}
                    </div>
                </div>
                {/* Search Drugs */}
                <div className="user-dashboard-card">
                    <div className="card-title">Search Drugs</div>
                    <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search for a drug..."
                        />
                        <button type="submit">Search</button>
                    </form>
                    <div>
                        {drugResults.map(drug => (
                            <div key={drug.id} className="drug-result">
                                <strong>{drug.name}</strong> - {drug.quantity} in stock
                            </div>
                        ))}
                        {drugResults.length === 0 && searched && search && <div>No drugs found.</div>}
                    </div>
                </div>
            </div>
            {/* AddOrder Modal */}
            {showOrderModal && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setShowOrderModal(false)}>×</button>
                        <AddOrder username={username} onClose={() => setShowOrderModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;