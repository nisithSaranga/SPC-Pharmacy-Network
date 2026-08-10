import React, { useState } from "react";

const MyComponent = () => {
    // 1. Define state
    const [status, setStatus] = useState("");

    return (
        <div>
            <label htmlFor="status" className="block font-medium mb-1">Status</label>
            <select
                id="status"
                name="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-[180px] border rounded px-3 py-2"
            >
                <option value="" disabled>Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
    );
};

export default MyComponent;


