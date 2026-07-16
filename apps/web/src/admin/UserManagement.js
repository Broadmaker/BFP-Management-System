import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Mail } from 'lucide-react';
import { UsersApi } from '../lib/api';
const roles = ['Station Commander', 'Fire Officer', 'Public'];
const roleColors = {
    'Station Commander': 'bg-red-100 text-red-700',
    'Fire Officer': 'bg-blue-100 text-blue-700',
    'Public': 'bg-gray-100 text-gray-600',
};
const ranks = ['SUPT', 'SINSP', 'FO3', 'FO2', 'FO1', 'NCO'];
export default function UserManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });
    useEffect(() => {
        UsersApi.list().then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    async function save() {
        if (!form.name || !form.email)
            return;
        const data = { name: form.name, email: form.email, role: form.role, rank: form.rank || undefined, position: form.position || undefined, contactNumber: form.contact || undefined };
        if (editing) {
            const updated = await UsersApi.update(editing.id, data);
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
        }
        else {
            const created = await UsersApi.create(data);
            setItems((prev) => [created, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' });
    }
    function edit(item) {
        setForm({ name: item.name, email: item.email, role: item.role, rank: item.rank || '', position: item.position || '', contact: item.contactNumber || '' });
        setEditing(item);
        setShowForm(true);
    }
    async function remove(id) {
        if (confirm('Deactivate this user?')) {
            await UsersApi.delete(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
        }
    }
    async function toggleActive(id) {
        const item = items.find((i) => i.id === id);
        if (!item)
            return;
        const updated = await UsersApi.update(id, { isActive: !item.isActive });
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
    }
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
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "System" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "User Management" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " users"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ name: '', email: '', role: 'Fire Officer', rank: '', position: '', contact: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add User"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "relative flex-1 max-w-xs", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Search users..." })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-100 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "User" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Role" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Rank / Position" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Contact" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Status" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Last Login" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((u) => (_jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold", children: u.name.split(' ').map((n) => n[0]).slice(0, 2).join('') }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: u.name }), _jsxs("div", { className: "text-xs text-gray-400 flex items-center gap-1", children: [_jsx(Mail, { size: 10 }), " ", u.email] })] })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[u.role]}`, children: u.role }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: u.rank ? _jsxs(_Fragment, { children: [_jsx("span", { className: "font-medium", children: u.rank }), " \u2014 ", u.position] }) : u.position || '—' }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: u.contactNumber || '—' }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => toggleActive(u.id), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: u.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—' }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx("button", { onClick: () => edit(u), className: "p-1.5 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(u.id), className: "p-1.5 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, u.id))) })] }) }), filtered.length === 0 && _jsx("div", { className: "text-center text-sm text-gray-400 py-8", children: "No users found." })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit User' : 'New User' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Role" }), _jsx("select", { value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: roles.map((r) => _jsx("option", { value: r, children: r }, r)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Rank" }), _jsxs("select", { value: form.rank, onChange: (e) => setForm({ ...form, rank: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), ranks.map((r) => _jsx("option", { value: r, children: r }, r))] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Position" }), _jsx("input", { type: "text", value: form.position, onChange: (e) => setForm({ ...form, position: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Contact Number" }), _jsx("input", { type: "text", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.name || !form.email, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
