import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Users, GraduationCap } from 'lucide-react';
const STORAGE_KEY = 'bfp-personnel';
const SEED = [
    { id: 'BFP-001', name: 'SUPT Juan Dela Cruz', rank: 'SUPT', position: 'Station Commander', assignment: 'Ipil Station', contact: '0917-000-0001', status: 'Active' },
    { id: 'BFP-002', name: 'SINSP Maria Santos', rank: 'SINSP', position: 'Fire Officer', assignment: 'Inspection Division', contact: '0917-000-0002', status: 'Active' },
    { id: 'BFP-003', name: 'FO3 Roberto Mendoza', rank: 'FO3', position: 'Fire Officer', assignment: 'Operations', contact: '0917-000-0003', status: 'Active' },
    { id: 'BFP-004', name: 'FO1 Pedro Reyes', rank: 'FO1', position: 'Fire Officer', assignment: 'Operations', contact: '0917-000-0004', status: 'Active' },
    { id: 'BFP-005', name: 'Ana Gonzales', rank: 'NUP', position: 'Admin Officer', assignment: 'Admin Division', contact: '0917-000-0005', status: 'Active' },
    { id: 'BFP-006', name: 'Carlos Lim', rank: 'NUP', position: 'Logistics Officer', assignment: 'Logistics Division', contact: '0917-000-0006', status: 'Active' },
    { id: 'BFP-007', name: 'FO2 Jose Reyes', rank: 'FO2', position: 'Fire Fighter', assignment: 'Ipil Station', contact: '0917-000-0007', status: 'Active' },
    { id: 'BFP-008', name: 'FO1 Ana Cruz', rank: 'FO1', position: 'Fire Fighter', assignment: 'Ipil Station', contact: '0917-000-0008', status: 'Active' },
    { id: 'BFP-009', name: 'FO2 Mark Tan', rank: 'FO2', position: 'Driver', assignment: 'Ipil Station', contact: '0917-000-0009', status: 'Active' },
    { id: 'BFP-010', name: 'FO1 Lisa Mendoza', rank: 'FO1', position: 'EMT', assignment: 'Ipil Station', contact: '0917-000-0010', status: 'Active' },
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
const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-gray-100 text-gray-500',
    'On Leave': 'bg-yellow-100 text-yellow-700',
};
export default function PersonnelList() {
    const [items, setItems] = useState(loadItems);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', rank: '', position: '', assignment: '', contact: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            const id = `BFP-${String(items.length + 1).padStart(3, '0')}`;
            setItems((prev) => [{ id, ...form, status: 'Active' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', rank: '', position: '', assignment: '', contact: '' });
    }
    function edit(item) {
        setForm({ name: item.name, rank: item.rank, position: item.position, assignment: item.assignment, contact: item.contact });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) {
        if (confirm('Remove this personnel record?'))
            setItems((prev) => prev.filter((i) => i.id !== id));
    }
    function toggleStatus(item) {
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: i.status === 'Active' ? 'Inactive' : 'Active' } : i));
    }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.position.toLowerCase().includes(q);
        }
        return true;
    });
    const active = items.filter((i) => i.status === 'Active').length;
    const inactive = items.filter((i) => i.status === 'Inactive').length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Personnel & Shifts" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Personnel Records" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " personnel on record"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ name: '', rank: '', position: '', assignment: '', contact: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add Personnel"] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Total Personnel" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: items.length })] }), _jsx("div", { className: "p-2 rounded-lg bg-blue-50", children: _jsx(Users, { size: 16, className: "text-blue-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Active" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: active })] }), _jsx("div", { className: "p-2 rounded-lg bg-green-50", children: _jsx(Check, { size: 16, className: "text-green-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Inactive" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: inactive })] }), _jsx("div", { className: "p-2 rounded-lg bg-gray-50", children: _jsx(X, { size: 16, className: "text-gray-400" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Assignments" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: new Set(items.map((i) => i.assignment)).size })] }), _jsx("div", { className: "p-2 rounded-lg bg-purple-50", children: _jsx(GraduationCap, { size: 16, className: "text-purple-600" }) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Active', 'Inactive'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by name, ID, position...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "ID" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Name" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Rank" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Position" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Assignment" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Contact" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-gray-900", children: r.id }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.name }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.rank || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.position }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.assignment }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.contact }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => toggleStatus(r), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[r.status] || 'bg-gray-100 text-gray-600'} cursor-pointer`, children: r.status }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => edit(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Personnel' : 'Add Personnel' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Rank + Full Name" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Rank" }), _jsxs("select", { value: form.rank, onChange: (e) => setForm({ ...form, rank: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select rank..." }), _jsx("option", { children: "SUPT" }), _jsx("option", { children: "SINSP" }), _jsx("option", { children: "INSP" }), _jsx("option", { children: "FO3" }), _jsx("option", { children: "FO2" }), _jsx("option", { children: "FO1" }), _jsx("option", { children: "NUP" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Position ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.position, onChange: (e) => setForm({ ...form, position: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "e.g. Fire Officer" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Assignment" }), _jsx("input", { type: "text", value: form.assignment, onChange: (e) => setForm({ ...form, assignment: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Division / Unit" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Contact # ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "09XX-XXX-XXXX" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.name || !form.position || !form.contact, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Add'] })] })] }) }))] }));
}
