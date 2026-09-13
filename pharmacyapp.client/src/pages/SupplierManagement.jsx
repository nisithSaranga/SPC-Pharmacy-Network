import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiSend, apiDelete } from "../api";
import "./OrderManagement.css";

const SupplierManagement = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [form, setForm] = useState({
        name: "", address: "", email: "", phone: "", contactPerson: ""
    });

    const fetchSuppliers = () => {
        setLoading(true);
        apiGet("/suppliers")
            .then(setSuppliers)
            .catch(() => setSuppliers([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiSend("/suppliers", "POST", form);
            setForm({ name: "", address: "", email: "", phone: "", contactPerson: "" });
            setShowModal(false);
            setToast({ show: true, message: "Supplier registered.", type: "success" });
            fetchSuppliers();
        } catch (err) {
            setToast({ show: true, message: `Failed: ${err.message}`, type: "error" });
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove ${name} from the supplier list?`)) return;
        try {
            await apiDelete(`/suppliers/${id}`);
            setToast({ show: true, message: "Supplier removed.", type: "success" });
            fetchSuppliers();
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
                <h2 className="order-mgmt-title">Supplier Management</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + Register Supplier
                </button>
            </div>

            {showModal && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setShowModal(false)}>×</button>
                        <h3>Register Supplier</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} required autoFocus />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person</label>
                                    <input name="contactPerson" value={form.contactPerson} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address</label>
                                    <input name="address" value={form.address} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-submit-row">
                                <button type="submit" className="add-btn" disabled={submitting}>
                                    {submitting ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="order-mgmt-card">
                {loading ? (
                    <div className="loading-msg">Loading suppliers...</div>
                ) : (
                    <table className="order-mgmt-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center" }}>No suppliers registered</td>
                                </tr>
                            ) : (
                                suppliers.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.id}</td>
                                        <td>{s.name}</td>
                                        <td>{s.contactPerson}</td>
                                        <td>{s.email}</td>
                                        <td>{s.phone}</td>
                                        <td>{s.address}</td>
                                        <td>
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleDelete(s.id, s.name)}
                                            >
                                                Remove
                                            </button>
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

export default SupplierManagement;