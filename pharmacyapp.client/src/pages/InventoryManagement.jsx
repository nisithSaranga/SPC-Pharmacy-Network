import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiSend, apiDelete } from "../api";
import "./InventoryManagement.css";

const InventoryManagement = () => {
    const navigate = useNavigate();
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [form, setForm] = useState({ name: "", quantity: "", price: "" });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [selectedDrugs, setSelectedDrugs] = useState([]);

    const fetchDrugs = () => {
        setLoading(true);
        apiGet("/drugs")
            .then(data => setDrugs(data))
            .catch(() => setDrugs([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDrugs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setToast({ show: false, message: "", type: "" });
        try {
               await apiSend("/drugs", "POST", {
                name: form.name,
                price: Number(form.price),
                openingStock: Number(form.quantity)
            });
            setShowModal(false);
            setForm({ name: "", quantity: "", price: "" });
            setToast({ show: true, message: "Drug added successfully!", type: "success" });
            fetchDrugs();
        } catch (err) {
            setToast({
                show: true,
                message: err?.message ? `Error adding drug: ${err.message}` : "Error adding drug.",
                type: "error"
            });
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
        }
    };

    const handleDeleteDrugs = async (e) => {
        e.preventDefault();
        for (let id of selectedDrugs) {
            await apiDelete(`/drugs/${id}`);
        }
        setDrugs(drugs.filter(d => !selectedDrugs.includes(d.id)));
        setShowDeleteModal(false);
        setSelectedDrugs([]);
        setToast({ show: true, message: "Deleted selected drugs!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
        fetchDrugs();
    };
    return (
        <div className="inventory-main-bg">
            {/* Back to Home */}
            <button
                className="back-home-btn"
                onClick={() => navigate("/dashboard")}
            >
                &larr; Back to Home
            </button>

            {/* --- Add Drug Modal --- */}
            {showModal && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setShowModal(false)}>×</button>
                        <h3>Add Drug</h3>
                        <form onSubmit={handleSubmit} className="add-drug-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        type="number"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.01"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="form-submit-row">
                                <button type="submit" className="submit-btn" disabled={submitting}>
                                    {submitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                            {toast.show && (
                                <div className={`toast-message ${toast.type}`}>{toast.message}</div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* --- Delete Drug Modal --- */}
            {showDeleteModal && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setShowDeleteModal(false)}>×</button>
                        <h3>Select drugs to delete</h3>
                        <form onSubmit={handleDeleteDrugs}>
                            <div className="modal-drug-list">
                                {drugs.map(drug => (
                                    <div key={drug.id} className="modal-drug-row">
                                        <input
                                            type="checkbox"
                                            id={`delete-drug-${drug.id}`}
                                            checked={selectedDrugs.includes(drug.id)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedDrugs(prev => [...prev, drug.id]);
                                                } else {
                                                    setSelectedDrugs(prev => prev.filter(id => id !== drug.id));
                                                }
                                            }}
                                        />
                                        <label htmlFor={`delete-drug-${drug.id}`}>
                                            {drug.name} (Stock: {drug.quantity})
                                        </label>
                                        <br/><br/>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="delete-confirm-btn"
                                disabled={selectedDrugs.length === 0}
                            >
                                Delete Selected
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Header row with buttons --- */}
            <div className="inventory-header-row">
                <h2 className="inventory-title">Inventory Management</h2>
                <div className="inventory-action-row">
                    <button className="add-drug-btn" onClick={() => setShowModal(true)}>
                        + Add Drug
                    </button>
                    <button className="delete-drug-btn" onClick={() => setShowDeleteModal(true)}>
                        Delete Drug
                    </button>
                </div>
            </div>

            {/* --- Drug Inventory Table --- */}
            <div className="inventory-card">
                {loading ? (
                    <div className="loading-msg">Loading drug inventory...</div>
                ) : (
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drugs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center" }}>No drugs in inventory</td>
                                </tr>
                            ) : (
                                drugs.map(drug => (
                                    <tr key={drug.id}>
                                        <td>{drug.id}</td>
                                        <td>{drug.name}</td>
                                        <td>{drug.quantity}</td>
                                        <td>{drug.price}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- Toast notification (below the card) --- */}
            {toast.show && !showModal && !showDeleteModal && (
                <div className={`toast-message-main ${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
};

export default InventoryManagement;
