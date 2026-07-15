import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, MapPin, Clock, Pencil, Trash2, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-appointments';
const SEED = [
    { id: 'APP-001', name: 'Juan Dela Cruz', business: 'Sari-Sari Store', type: 'Initial Inspection', date: 'Jul 20, 2026', time: '9:00 AM', address: 'National Highway, Poblacion', status: 'Confirmed' },
    { id: 'APP-002', name: 'Maria Santos', business: 'Riverside Eatery', type: 'Reinspection', date: 'Jul 21, 2026', time: '10:30 AM', address: 'Quezon Blvd, Ipil Heights', status: 'Pending' },
    { id: 'APP-003', name: 'Pedro Reyes', business: '—', type: 'Initial Inspection', date: 'Jul 22, 2026', time: '1:00 PM', address: 'Gov. Cerilles St, Poblacion', status: 'Confirmed' },
    { id: 'APP-004', name: 'Ana Gonzales', business: '—', type: 'Initial Inspection', date: 'Jul 18, 2026', time: '8:30 AM', address: 'Serenity Dr, Bangkerohan', status: 'Completed' },
    { id: 'APP-005', name: 'Carlos Lim', business: 'Sibugay Hardware', type: 'Reinspection', date: 'Jul 25, 2026', time: '11:00 AM', address: 'Cueto St, Upper Ipil', status: 'Pending' },
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
function makeId() { return `APP-${Date.now().toString(36).toUpperCase().slice(-5)}`; }
const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-gray-100 text-gray-500',
};
export default function Appointments() {
    const [items, setItems] = useState(loadItems);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        const data = { ...form, business: form.business || '—' };
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i));
        }
        else {
            setItems((prev) => [{ id: makeId(), ...data, status: 'Pending' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' });
    }
    function edit(item) { setForm({ name: item.name, business: item.business === '—' ? '' : item.business, type: item.type, date: item.date, time: item.time, address: item.address }); setEditing(item); setShowForm(true); }
    function remove(id) { if (confirm('Cancel this appointment?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function updateStatus(id, status) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }
    const filtered = items.filter((a) => {
        if (filter !== 'All' && a.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return a.name.toLowerCase().includes(q) || a.business.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
        }
        return true;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Public Service" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Inspection Appointments" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " appointments"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " New Appointment"] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', ...statuses].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "divide-y divide-gray-100", children: filtered.map((a) => (_jsxs("div", { className: "p-4 hover:bg-gray-50 flex items-start gap-4", children: [_jsxs("div", { className: "w-12 h-12 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center text-xs font-bold flex-shrink-0", children: [_jsx("span", { className: "text-[10px] font-medium", children: a.date.split(' ')[0] }), _jsx("span", { children: a.date.split(' ')[1]?.replace(',', '') })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: a.business !== '—' ? a.business : a.name }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [a.type, " \u2014 ", a.name] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("select", { value: a.status, onChange: (e) => updateStatus(a.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[a.status]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }), _jsx("button", { onClick: () => edit(a), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(a.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] })] }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 11 }), " ", a.date] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " ", a.time] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), " ", a.address] })] })] })] }, a.id))) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Appointment' : 'New Appointment' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Client Name" }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Business" }), _jsx("input", { type: "text", value: form.business, onChange: (e) => setForm({ ...form, business: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Optional" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Inspection Type" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { children: "Initial Inspection" }), _jsx("option", { children: "Reinspection" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: form.date, onChange: (e) => {
                                                        const d = new Date(e.target.value + 'T12:00:00');
                                                        setForm({ ...form, date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) });
                                                    }, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Time" }), _jsx("input", { type: "time", value: form.time, onChange: (e) => {
                                                        const [h, m] = e.target.value.split(':');
                                                        const ampm = +h >= 12 ? 'PM' : 'AM';
                                                        const h12 = +h % 12 || 12;
                                                        setForm({ ...form, time: `${h12}:${m} ${ampm}` });
                                                    }, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Address" }), _jsx("input", { type: "text", value: form.address, onChange: (e) => setForm({ ...form, address: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.name || !form.date || !form.time || !form.address, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
