import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiSend } from "../api";
import "./OrderManagement.css";

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const fetchOrders = () => {
        setLoading(true);
        apiGet("/orders")
            .then(setOrders)
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await apiSend(`/orders/${id}/status`, "PATCH", { status });
            setToast({ show: true, message: `Order ${status.toLowerCase()}.`, type: "success" });
            fetchOrders();
        } catch (err) {
            setToast({ show: true, message: `Failed: ${err.message}`, type: "error" });
        }
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
    };

    return (
        <div className="order-mgmt-bg">
            <button className="back-home-btn" onClick={() => navigate("/dashboard")}>
                &larr; Back to Home
            </button>

            <div className="order-mgmt-header-row">
                <h2 className="order-mgmt-title">Order Management</h2>
            </div>

            <div className="order-mgmt-card">
                {loading ? (
                    <div className="loading-msg">Loading orders...</div>
                ) : (
                    <table className="order-mgmt-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Pharmacy</th>
                                <th>Drug</th>
                                <th>Qty</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center" }}>No orders placed</td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.pharmacyName}</td>
                                        <td>{order.drugName}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}</td>
                                        <td>
                                            <span className={`status-badge status-${(order.status || "").toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.status === "Pending" ? (
                                                <>
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => updateStatus(order.id, "Approved")}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => updateStatus(order.id, "Rejected")}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                    <span className="no-action">Closed</span>

                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {toast.show && (
                <div className={`toast-message-main ${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
};

export default OrderManagement;