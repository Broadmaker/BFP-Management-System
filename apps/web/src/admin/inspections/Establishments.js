import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-establishments';
const SEED = [
    { id: '1', businessName: 'Ipil Grocery Mart', ownerName: 'Carlos Green', ownerContact: '0917-111-1111', address: 'National Highway', barangay: 'Poblacion', occupancyType: 'Commercial', classification: 'Retail', complianceStatus: 'Compliant' },
    { id: '2', businessName: 'Riverside Eatery', ownerName: 'Maria Rivera', ownerContact: '0917-222-2222', address: 'Quezon Blvd', barangay: 'Ipil Heights', occupancyType: 'Commercial', classification: 'Food Service', complianceStatus: 'Non-Compliant' },
    { id: '3', businessName: 'Ipil Heights Apartments', ownerName: 'Jose Santos', ownerContact: '0917-333-3333', address: 'Serenity Dr', barangay: 'Bangkerohan', occupancyType: 'Residential', classification: 'Multi-family', complianceStatus: 'Compliant' },
    { id: '4', businessName: 'Sibugay Hardware', ownerName: 'Ana Reyes', ownerContact: '0917-444-4444', address: 'Cueto St', barangay: 'Upper Ipil', occupancyType: 'Commercial', classification: 'Hardware', complianceStatus: 'Pending' },
    { id: '5', businessName: 'Don Basilio School Inc.', ownerName: 'Luisa Tan', ownerContact: '0917-555-5555', address: 'Gov. Cerilles St', barangay: 'Don Basilio', occupancyType: 'Institutional', classification: 'Educational', complianceStatus: 'Compliant' },
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
    Compliant: 'bg-green-100 text-green-700',
    'Non-Compliant': 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'Under Review': 'bg-blue-100 text-blue-700',
};
const statuses = ['Compliant', 'Non-Compliant', 'Pending', 'Under Review'];
const occupancyTypes = ['Commercial', 'Residential', 'Institutional', 'Industrial', 'Open Area', 'Mixed-Use'];
export default function Establishments() {
    const [items, setItems] = useState(loadItems);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.businessName || !form.ownerName || !form.address || !form.barangay || !form.occupancyType)
            return;
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            const id = crypto.randomUUID();
            setItems((prev) => [{ id, ...form, complianceStatus: 'Pending' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' });
    }
    function edit(item) {
        setForm({ businessName: item.businessName, ownerName: item.ownerName, ownerContact: item.ownerContact || '', address: item.address, barangay: item.barangay, occupancyType: item.occupancyType, classification: item.classification || '' });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) { if (confirm('Delete this establishment?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function updateStatus(id, status) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, complianceStatus: status } : i)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.complianceStatus !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.businessName.toLowerCase().includes(q) || r.ownerName.toLowerCase().includes(q) || r.barangay.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length };
    statuses.forEach((s) => { counts[s] = items.filter((i) => i.complianceStatus === s).length; });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Fire Safety Inspection" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Establishments" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " registered establishments"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add Establishment"] })] }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k === 'All' ? 'Total' : k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', ...statuses].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search establishments...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Business Name" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Owner" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Barangay" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Classification" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.businessName }), _jsxs("td", { className: "px-4 py-2.5", children: [_jsx("div", { className: "text-gray-900", children: r.ownerName }), _jsx("div", { className: "text-xs text-gray-400", children: r.ownerContact })] }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.barangay }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.occupancyType }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.classification || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("select", { value: r.complianceStatus, onChange: (e) => updateStatus(r.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.complianceStatus]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => edit(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Establishment' : 'Add Establishment' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Business Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.businessName, onChange: (e) => setForm({ ...form, businessName: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Owner Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.ownerName, onChange: (e) => setForm({ ...form, ownerName: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Contact #" }), _jsx("input", { type: "text", value: form.ownerContact, onChange: (e) => setForm({ ...form, ownerContact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.address, onChange: (e) => setForm({ ...form, address: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Barangay ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.barangay, onChange: (e) => setForm({ ...form, barangay: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Occupancy Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("select", { value: form.occupancyType, onChange: (e) => setForm({ ...form, occupancyType: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: occupancyTypes.map((t) => _jsx("option", { value: t, children: t }, t)) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Classification" }), _jsx("input", { type: "text", value: form.classification, onChange: (e) => setForm({ ...form, classification: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "e.g. Retail, Food Service, Educational" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.businessName || !form.ownerName || !form.address || !form.barangay, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Add'] })] })] }) }))] }));
}
