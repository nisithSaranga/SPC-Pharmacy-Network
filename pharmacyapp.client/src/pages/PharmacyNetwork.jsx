import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiSend } from "../api";
import "./PharmacyNetwork.css";

const PharmacyNetwork = () => {
    const navigate = useNavigate();
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

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

        useEffect(() => {
        apiGet("/pharmacies")
            .then(setPharmacies)
            .catch(() => alert("Error loading pharmacies"))
            .finally(() => setLoading(false));
    }, []);

    const triggerToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 2200);
    };

    const filteredPharmacies = pharmacies.filter((p) => {
        const needle = search.toLowerCase();
        const matchesSearch =
            (p.name || "").toLowerCase().includes(needle) ||
            (p.address || "").toLowerCase().includes(needle) ||
            (p.manager || "").toLowerCase().includes(needle) ||
            (p.email || "").toLowerCase().includes(needle) ||
            (p.phone || "").toLowerCase().includes(needle);
        const matchesType = !typeFilter || p.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
      const handleSubmit = async e => {
        e.preventDefault();
        try {
            const newPharmacy = await apiSend("/pharmacies", "POST", form);
            setPharmacies(phs => [...phs, newPharmacy]);
            setShowAdd(false);
            setForm({
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
            triggerToast("Pharmacy added successfully!", "success");
        } catch {
            triggerToast("Failed to add pharmacy.", "error");
        }
    };

    const doSearch = () => setSearch(searchInput.trim());
    const handleSearchKeyDown = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
        }
    };

    return (
        <div className="pharmacy-network-wrapper">
            {/* Back Button */}
                        <button
                className="back-home-btn"
                onClick={() => navigate("/dashboard")}
            >
                &larr; Back to Home
            </button>
            <header className="pharmacy-network-header">
                <h1>Pharmacy Network</h1>
                <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add Pharmacy</button>
            </header>

            <div className="pharmacy-filters">
                <input
                    type="text"
                    placeholder="Search by name, address, manager, email, phone"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
                <button className="search-btn" onClick={doSearch}>Search</button>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="SPC Owned">SPC Owned</option>
                    <option value="Linked Dealer">Linked Dealer</option>
                </select>
                {(search || typeFilter) && (
                    <button className="clear-btn" onClick={() => { setSearch(""); setSearchInput(""); setTypeFilter(""); }}>
                        Clear
                    </button>
                )}
            </div>

            {/* Add Pharmacy Modal */}
            {showAdd && (
                <div className="modal-bg">
                    <div className="modal-content">
                        <button className="close-modal-btn" onClick={() => setShowAdd(false)}>×</button>
                        <h2>Add New Pharmacy</h2>
                        <form onSubmit={handleSubmit} className="pharmacy-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={form.type} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        <option value="SPC Owned">SPC Owned</option>
                                        <option value="Linked Dealer">Linked Dealer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address</label>
                                    <input name="address" value={form.address} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Manager</label>
                                    <input name="manager" value={form.manager} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input name="email" value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={form.status} onChange={handleChange}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Integration Status</label>
                                    <select name="integrationStatus" value={form.integrationStatus} onChange={handleChange}>
                                        <option>Pending</option>
                                        <option>Connected</option>
                                        <option>Disconnected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Monthly Orders</label>
                                    <input name="monthlyOrders" type="number" value={form.monthlyOrders} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Revenue</label>
                                    <input name="revenue" type="number" value={form.revenue} onChange={handleChange} required />
                                </div>
                            </div>
                            {toast.show && (
                                <div className={`toast-message ${toast.type}`}>{toast.message}</div>
                            )}
                            <div style={{ textAlign: "right" }}>
                                <button className="submit-btn" type="submit">Add Pharmacy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="pharmacy-list-card">
                <h3>All Pharmacies</h3>
                {loading ? (
                    <div style={{ padding: 32 }}>Loading...</div>
                ) : (
                    <table className="pharmacy-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Address</th>
                                <th>Manager</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Orders</th>
                                <th>Revenue</th>
                                <th>Integration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPharmacies.length === 0 ? (
                                <tr><td colSpan={10} style={{ textAlign: "center", color: "#b0b0b0" }}>No pharmacies found.</td></tr>
                            ) : (
                                filteredPharmacies.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.name}</td>
                                        <td>{p.type}</td>
                                        <td>{p.address}</td>
                                        <td>{p.manager}</td>
                                        <td>{p.email}</td>
                                        <td>{p.phone}</td>
                                        <td>
                                            <span className={`badge ${p.status === "Active" ? "badge-green" : "badge-red"}`}>{p.status}</span>
                                        </td>
                                        <td>{p.monthlyOrders}</td>
                                        <td>LKR {Number(p.revenue).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${p.integrationStatus === "Connected"
                                                ? "badge-green"
                                                : p.integrationStatus === "Pending"
                                                    ? "badge-yellow"
                                                    : "badge-red"
                                                }`}>{p.integrationStatus}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PharmacyNetwork;



