import React, { useState, useEffect } from "react";
import "./AddOrder.css"; // Reuse AddSupplier/AddOrder styles
import { apiGet, apiSend } from "../api";

const AddOrder = () => {
    const [form, setForm] = useState({ pharmacyName: "", drugId: "", quantity: 1 });
    const [drugs, setDrugs] = useState([]);
    const [loadingDrugs, setLoadingDrugs] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

       useEffect(() => {
        // Fetch drug list for dropdown
        apiGet("/drugs")
            .then(data => setDrugs(data))
            .catch(() => setToast({ show: true, message: "Error loading drugs!", type: "error" }))
            .finally(() => setLoadingDrugs(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setToast({ show: false, message: "", type: "" });
        try {
            await apiSend("/orders", "POST", {
                drugId: Number(form.drugId),
                quantity: Number(form.quantity),
                pharmacyName: form.pharmacyName,
            });
            setForm({ pharmacyName: "", drugId: "", quantity: 1 });
            setToast({ show: true, message: "Order placed successfully!", type: "success" });
        } catch (err) {
            setToast({
                show: true,
                message: err?.message ? `Error placing order: ${err.message}` : "Error placing order!",
                type: "error"
            });
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
        }
    };

    return (
        <div className="add-supplier-wrapper">
            <div className="add-supplier-header">
                <h2>Place Order</h2>
            </div>
            <form onSubmit={handleSubmit} className="add-supplier-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Pharmacy Name</label>
                        <input
                            name="pharmacyName"
                            value={form.pharmacyName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Drug</label>
                        <select
                            name="drugId"
                            value={form.drugId}
                            onChange={handleChange}
                            required
                            disabled={loadingDrugs}
                        >
                            <option value="">{loadingDrugs ? "Loading drugs..." : "Select Drug"}</option>
                            {drugs.map(drug => (
                                <option key={drug.id || drug.Id} value={drug.id || drug.Id}>
                                    {drug.name || drug.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-submit-row">
                    <button type="submit" className="submit-btn" disabled={submitting || loadingDrugs}>
                        {submitting ? "Placing..." : "Place Order"}
                    </button>
                </div>
                {toast.show && (
                    <div className={`toast-message ${toast.type}`}>{toast.message}</div>
                )}
            </form>
        </div>
    );
};

export default AddOrder;

