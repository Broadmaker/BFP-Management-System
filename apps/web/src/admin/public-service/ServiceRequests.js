import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-service-requests';
const SEED = [
    { id: 'SR-2026-001', type: 'FSIC Application', requester: 'Juan Dela Cruz', business: 'Sari-Sari Store', contact: '0917-123-4567', date: 'Jul 12, 2026', status: 'Pending' },
    { id: 'SR-2026-002', type: 'FSIC Renewal', requester: 'Maria Santos', business: 'Riverside Eatery', contact: '0928-234-5678', date: 'Jul 11, 2026', status: 'Under Review' },
    { id: 'SR-2026-003', type: 'Inspection Request', requester: 'Pedro Reyes', business: '—', contact: '0939-345-6789', date: 'Jul 10, 2026', status: 'Approved' },
    { id: 'SR-2026-004', type: 'Document Request', requester: 'Ana Gonzales', business: '—', contact: '0940-456-7890', date: 'Jul 9, 2026', status: 'Completed' },
    { id: 'SR-2026-005', type: 'FSIC Application', requester: 'Carlos Lim', business: 'Sibugay Hardware', contact: '0951-567-8901', date: 'Jul 8, 2026', status: 'Rejected' },
];
function loadItems() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return SEED;
}
function makeId() {
    const n = Date.now().toString(36).toUpperCase();
    return `SR-${n.slice(-5)}`;
}
const statuses = ['Pending', 'Under Review', 'Approved', 'Completed', 'Rejected'];
const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700', 'Under Review': 'bg-blue-100 text-blue-700',
    Approved: 'bg-green-100 text-green-700', Completed: 'bg-gray-100 text-gray-600',
    Rejected: 'bg-red-100 text-red-700',
};
export default function ServiceRequests() {
    const [items, setItems] = useState(loadItems);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ type: '', requester: '', business: '', contact: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            setItems((prev) => [{ id: makeId(), ...form, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'Pending' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ type: '', requester: '', business: '', contact: '' });
    }
    function edit(item) { setForm({ type: item.type, requester: item.requester, business: item.business, contact: item.contact }); setEditing(item); setShowForm(true); }
    function remove(id) { if (confirm('Delete this request?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function updateStatus(id, status) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.requester.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.business.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length };
    statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Public Service" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Service Requests" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " total requests"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ type: '', requester: '', business: '', contact: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " New Request"] })] }), _jsx("div", { className: "grid grid-cols-6 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-gray-500", children: k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', ...statuses].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "ID" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Requester" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Business" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-gray-900", children: r.id }), _jsx("td", { className: "px-4 py-2.5 text-gray-900", children: r.type }), _jsxs("td", { className: "px-4 py-2.5", children: [_jsx("div", { className: "font-medium text-gray-900", children: r.requester }), _jsx("div", { className: "text-xs text-gray-400", children: r.contact })] }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.business }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.date }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("select", { value: r.status, onChange: (e) => updateStatus(r.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => edit(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))) })] })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Request' : 'New Service Request' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Request Type" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select type..." }), _jsx("option", { children: "FSIC Application" }), _jsx("option", { children: "FSIC Renewal" }), _jsx("option", { children: "Inspection Request" }), _jsx("option", { children: "Document Request" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Requester Name" }), _jsx("input", { type: "text", value: form.requester, onChange: (e) => setForm({ ...form, requester: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Contact #" }), _jsx("input", { type: "text", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Business (optional)" }), _jsx("input", { type: "text", value: form.business, onChange: (e) => setForm({ ...form, business: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "\u2014" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.type || !form.requester || !form.contact, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
