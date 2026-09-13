const API_BASE = "https://localhost:7216/api";

function authHeaders(extra = {}) {
    const token = localStorage.getItem("token");
    return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}

export async function apiSend(path, method, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.status === 204 ? null : res.json().catch(() => null);
}

export async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
}