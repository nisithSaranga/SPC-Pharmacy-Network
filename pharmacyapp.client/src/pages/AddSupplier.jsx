import React, { useState } from "react";
import "./AddSupplier.css";

const AddSupplier = () => {
    const [form, setForm] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        contactPerson: "",
    });
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [submitting, setSubmitting] = useState(false);

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setToast({ show: false, message: "", type: "" });

        try {
            const res = await fetch("https://localhost:7216/api/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to register supplier");
            setForm({ name: "", address: "", email: "", phone: "", contactPerson: "" });
            setToast({ show: true, message: "Supplier registered successfully!", type: "success" });
        } catch (err) {
            setToast({ show: true, message: "Error registering supplier!", type: "error" });
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
        }
    };

    return (
        <div className="add-supplier-wrapper">
            <div className="add-supplier-header">
                <h2>Register Supplier</h2>
            </div>
            <form onSubmit={handleSubmit} className="add-supplier-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
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
                    <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? "Registering..." : "Register"}
                    </button>
                </div>
                {toast.show && (
                    <div className={`toast-message ${toast.type}`}>{toast.message}</div>
                )}
            </form>
        </div>
    );
};

export default AddSupplier;


