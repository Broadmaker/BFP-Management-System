import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, Clock, Pencil, Trash2, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-hazard-reports';
const SEED = [
    { id: 'HAZ-001', type: 'Electrical Hazard', location: 'National Highway, Ipil Heights', barangay: 'Ipil Heights', reporter: 'Anonymous', date: 'Jul 13, 2026', status: 'Under Investigation', priority: 'High' },
    { id: 'HAZ-002', type: 'Gas Leak Suspected', location: 'Quezon Blvd, Sanito', barangay: 'Sanito', reporter: 'Maria Santos', date: 'Jul 12, 2026', status: 'Resolved', priority: 'Critical' },
    { id: 'HAZ-003', type: 'Unattended Burning', location: 'Serenity Dr, Bangkerohan', barangay: 'Bangkerohan', reporter: 'Anonymous', date: 'Jul 11, 2026', status: 'Closed', priority: 'Medium' },
    { id: 'HAZ-004', type: 'Blocked Fire Exit', location: 'Gov. Cerilles St, Poblacion', barangay: 'Poblacion', reporter: 'Pedro Reyes', date: 'Jul 10, 2026', status: 'Resolved', priority: 'Medium' },
    { id: 'HAZ-005', type: 'Improper LPG Storage', location: 'Cueto St, Upper Ipil', barangay: 'Upper Ipil', reporter: 'Anonymous', date: 'Jul 9, 2026', status: 'New', priority: 'High' },
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
function makeId() { return `HAZ-${Date.now().toString(36).toUpperCase().slice(-5)}`; }
const statuses = ['New', 'Under Investigation', 'Resolved', 'Closed'];
const priorities = ['Critical', 'High', 'Medium', 'Low'];
const hazardTypes = ['Electrical Hazard', 'Gas Leak Suspected', 'Unattended Burning', 'Blocked Fire Exit', 'Improper LPG Storage', 'Chemical Spill', 'Other'];
const statusColors = {
    New: 'bg-red-100 text-red-700', 'Under Investigation': 'bg-yellow-100 text-yellow-700',
    Resolved: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500',
};
const priorityColors = {
    Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700',
};
export default function HazardReports() {
    const [items, setItems] = useState(loadItems);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            setItems((prev) => [{ id: makeId(), ...form, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'New' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' });
    }
    function edit(item) { setForm({ type: item.type, location: item.location, barangay: item.barangay, reporter: item.reporter, priority: item.priority }); setEditing(item); setShowForm(true); }
    function remove(id) { if (confirm('Delete this hazard report?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function updateStatus(id, status) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }
    const filtered = items.filter((h) => {
        if (filter !== 'All' && h.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return h.type.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.barangay.toLowerCase().includes(q);
        }
        return true;
    });
    function getStyle(p) {
        return p === 'Critical' ? 'bg-red-50 text-red-600' : p === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600';
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Public Service" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Hazard Reports" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " reports"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(AlertTriangle, { size: 14 }), " Log Hazard"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [
                    { label: 'New', value: items.filter((i) => i.status === 'New').length, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Under Investigation', value: items.filter((i) => i.status === 'Under Investigation').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Resolved', value: items.filter((i) => i.status === 'Resolved').length, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total', value: items.length, color: 'text-gray-900', bg: 'bg-gray-50' },
                ].map((s) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-gray-500", children: s.label }), _jsx("div", { className: `text-lg font-semibold mt-0.5 ${s.color}`, children: s.value })] }, s.label))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', ...statuses].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsx("div", { className: "divide-y divide-gray-100", children: filtered.map((h) => (_jsxs("div", { className: "p-4 hover:bg-gray-50 flex items-start gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStyle(h.priority)}`, children: _jsx(AlertTriangle, { size: 18 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: h.type }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: h.location })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${priorityColors[h.priority]}`, children: h.priority }), _jsx("select", { value: h.status, onChange: (e) => updateStatus(h.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[h.status]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }), _jsx("button", { onClick: () => edit(h), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(h.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] })] }), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), " ", h.barangay] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " ", h.date] }), _jsx("span", { children: h.reporter })] })] })] }, h.id))) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Hazard Report' : 'Log Hazard Report' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Hazard Type" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [hazardTypes.filter((t) => t !== 'Other').map((t) => _jsx("option", { children: t }, t)), _jsx("option", { children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Location / Address" }), _jsx("input", { type: "text", value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Barangay" }), _jsxs("select", { value: form.barangay, onChange: (e) => setForm({ ...form, barangay: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { children: "Poblacion" }), _jsx("option", { children: "Ipil Heights" }), _jsx("option", { children: "Don Basilio" }), _jsx("option", { children: "Bangkerohan" }), _jsx("option", { children: "Upper Ipil" }), _jsx("option", { children: "Sanito" }), _jsx("option", { children: "Makilas" }), _jsx("option", { children: "Lumbia" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Priority" }), _jsx("select", { value: form.priority, onChange: (e) => setForm({ ...form, priority: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: priorities.map((p) => _jsx("option", { children: p }, p)) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Reporter" }), _jsx("input", { type: "text", value: form.reporter, onChange: (e) => setForm({ ...form, reporter: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Anonymous" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.type || !form.location, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
