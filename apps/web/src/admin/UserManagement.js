import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Mail } from 'lucide-react';
const STORAGE_KEY = 'bfp-users';
const SEED = [
    { id: 'USR-001', name: 'SUPT Juan Dela Cruz', email: 'juan.delacruz@bfp.gov.ph', role: 'Station Commander', rank: 'SUPT', position: 'Station Commander', contact: '0917-111-2222', isActive: true, lastLogin: 'Jul 15, 2026' },
    { id: 'USR-002', name: 'SINSP Maria Santos', email: 'maria.santos@bfp.gov.ph', role: 'Fire Officer', rank: 'SINSP', position: 'Senior Fire Officer', contact: '0917-222-3333', isActive: true, lastLogin: 'Jul 14, 2026' },
    { id: 'USR-003', name: 'FO3 Roberto Mendoza', email: 'roberto.mendoza@bfp.gov.ph', role: 'Fire Officer', rank: 'FO3', position: 'Fire Officer', contact: '0917-333-4444', isActive: true, lastLogin: 'Jul 13, 2026' },
    { id: 'USR-004', name: 'FO1 Ana Gonzales', email: 'ana.gonzales@bfp.gov.ph', role: 'Fire Officer', rank: 'FO1', position: 'Junior Fire Officer', contact: '0917-444-5555', isActive: true, lastLogin: 'Jul 12, 2026' },
    { id: 'USR-005', name: 'NCO Pedro Reyes', email: 'pedro.reyes@bfp.gov.ph', role: 'Fire Officer', rank: 'NCO', position: 'Non-Commissioned Officer', contact: '0917-555-6666', isActive: false, lastLogin: 'Jun 28, 2026' },
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
function makeId() { return `USR-${Date.now().toString(36).toUpperCase().slice(-5)}`; }
const roles = ['Station Commander', 'Fire Officer', 'Public'];
const roleColors = {
    'Station Commander': 'bg-red-100 text-red-700',
    'Fire Officer': 'bg-blue-100 text-blue-700',
    'Public': 'bg-gray-100 text-gray-600',
};
const ranks = ['SUPT', 'SINSP', 'FO3', 'FO2', 'FO1', 'NCO'];
export default function UserManagement() {
    const [items, setItems] = useState(loadItems);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.name || !form.email)
            return;
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            setItems((prev) => [{ id: makeId(), ...form, isActive: true, lastLogin: 'Never' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });
    }
    function edit(item) {
        setForm({ name: item.name, email: item.email, role: item.role, rank: item.rank || '', position: item.position || '', contact: item.contact || '' });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) { if (confirm('Deactivate this user?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function toggleActive(id) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, isActive: !i.isActive } : i)); }
    const filtered = items.filter((u) => {
        if (filter === 'Active' && !u.isActive)
            return false;
        if (filter === 'Inactive' && u.isActive)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.rank || '').toLowerCase().includes(q);
        }
        return true;
    });
    const counts = {
        All: items.length,
        Active: items.filter((u) => u.isActive).length,
        Inactive: items.filter((u) => !u.isActive).length,
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "System" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "User Management" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " users"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add User"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "relative flex-1 max-w-xs", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Search users..." })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-100 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "User" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Role" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Rank / Position" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Contact" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Status" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Last Login" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((u) => (_jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold", children: u.name.split(' ').map((n) => n[0]).slice(0, 2).join('') }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: u.name }), _jsxs("div", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(Mail, { size: 10 }), " ", u.email] })] })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[u.role]}`, children: u.role }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: u.rank ? _jsxs(_Fragment, { children: [_jsx("span", { className: "font-medium", children: u.rank }), " \u2014 ", u.position] }) : u.position || '—' }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: u.contact || '—' }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => toggleActive(u.id), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: u.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: u.lastLogin }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx("button", { onClick: () => edit(u), className: "p-1.5 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(u.id), className: "p-1.5 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, u.id))) })] }) }), filtered.length === 0 && _jsx("div", { className: "text-center text-sm text-gray-400 py-8", children: "No users found." })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit User' : 'New User' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Role" }), _jsx("select", { value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: roles.map((r) => _jsx("option", { value: r, children: r }, r)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Rank" }), _jsxs("select", { value: form.rank, onChange: (e) => setForm({ ...form, rank: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), ranks.map((r) => _jsx("option", { value: r, children: r }, r))] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Position" }), _jsx("input", { type: "text", value: form.position, onChange: (e) => setForm({ ...form, position: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Contact Number" }), _jsx("input", { type: "text", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.name || !form.email, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
