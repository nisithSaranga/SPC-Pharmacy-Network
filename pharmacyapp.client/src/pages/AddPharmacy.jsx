import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPharmacy.css";

const statusOptions = ["Active", "Inactive"];
const integrationOptions = ["Connected", "Pending", "Disconnected"];
const typeOptions = ["SPC Owned", "Linked Dealer"];

const AddPharmacy = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        type: "",
        address: "",
        phone: "",
        email: "",
        manager: "",
        status: "Active",
        monthlyOrders: "",
        revenue: "",
        integrationStatus: "Pending",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7216/api/pharmacies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error("Failed to add pharmacy");
            navigate("/pharmacy-network");
        } catch (err) {
            alert("Failed to add pharmacy!");
            console.error(err);
        }
    };

    return (
        <div className="add-pharmacy-wrapper">
            <div className="add-pharmacy-header">
                <h2>Add New Pharmacy</h2>
                <button
                    className="back-btn"
                    type="button"
                    onClick={() => navigate("/pharmacy-network")}
                >
                    Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="add-pharmacy-form">
                {/* Name & Type */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            {typeOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Address & Manager */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Manager</label>
                        <input
                            name="manager"
                            value={form.manager}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Status & Integration */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Integration Status</label>
                        <select
                            name="integrationStatus"
                            value={form.integrationStatus}
                            onChange={handleChange}
                        >
                            {integrationOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Monthly Orders & Revenue */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Monthly Orders</label>
                        <input
                            name="monthlyOrders"
                            type="number"
                            min="0"
                            value={form.monthlyOrders}
                            onChange={handleChange}
                            placeholder="eg: 10"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Revenue</label>
                        <input
                            name="revenue"
                            type="number"
                            min="0"
                            value={form.revenue}
                            onChange={handleChange}
                            placeholder="eg: 250000"
                            required
                        />
                    </div>
                </div>

                <div className="form-submit-row">
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Add Pharmacy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPharmacy;
