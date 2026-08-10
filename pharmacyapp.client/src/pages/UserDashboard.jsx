import React, { useState, useEffect } from "react";
import AddOrder from "./AddOrder"; // Import your order form/modal
import "./UserDashboard.css"; // (optional, style as you like)

const UserDashboard = ({ onLogout }) => {
    const username = localStorage.getItem("username") || "";
    const [orders, setOrders] = useState([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [search, setSearch] = useState("");
    const [drugResults, setDrugResults] = useState([]);

    // Fetch user's orders
    useEffect(() => {
        fetch(`https://localhost:7216/api/orders?username=${username}`)
            .then(res => res.json())
            .then(setOrders)
            .catch(() => setOrders([]));
    }, [showOrderModal, username]); // Refresh after new order

    // Search drugs
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return;
        fetch(`https://localhost:7216/api/drugs?search=${search}`)
            .then(res => res.json())
            .then(setDrugResults)
            .catch(() => setDrugResults([]));
    };

    return (
        <div className="user-dashboard-bg">
            {/* Header */}
            <header className="user-dashboard-header">
                <img src="/spc-logo.png" alt="SPC Logo" className="dashboard-logo" />
                <span className="welcome-text">Welcome, {username} (user)</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </header>
            {/* Cards Row */}
            <div className="user-dashboard-cards-row">
                {/* Order Drugs */}
                <div className="user-dashboard-card" onClick={() => setShowOrderModal(true)}>
                    <div className="card-title">Order Drugs</div>
                    <div>Place new pharmacy orders</div>
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
                                <strong>{drug.name}</strong> ({drug.brand}) - {drug.stock} in stock
                            </div>
                        ))}
                        {drugResults.length === 0 && search && <div>No drugs found.</div>}
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
