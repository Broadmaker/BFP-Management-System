import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-maintenance';
const EQUIP_KEY = 'bfp-equipment';
const VEHICLE_KEY = 'bfp-vehicles';
function loadItems() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function loadEquipment() {
    try {
        const raw = localStorage.getItem(EQUIP_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function loadVehicles() {
    try {
        const raw = localStorage.getItem(VEHICLE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
const typeColors = {
    Preventive: 'bg-blue-100 text-blue-700',
    Repair: 'bg-orange-100 text-orange-700',
};
const todayStr = () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
export default function Maintenance() {
    const [items, setItems] = useState(loadItems);
    const [equipment] = useState(loadEquipment);
    const [vehicles] = useState(loadVehicles);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ assetType: 'equipment', assetId: '', type: 'Preventive', description: '', cost: '', nextScheduledDate: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.assetId || !form.type)
            return;
        const assetName = form.assetType === 'equipment'
            ? equipment.find((e) => e.id === form.assetId)?.name || 'Unknown'
            : vehicles.find((v) => v.id === form.assetId)?.name || 'Unknown';
        const id = crypto.randomUUID();
        setItems((prev) => [{ id, ...form, assetName, date: todayStr() }, ...prev]);
        setShowForm(false);
        setForm({ assetType: 'equipment', assetId: '', type: 'Preventive', description: '', cost: '', nextScheduledDate: '' });
    }
    function remove(id) { if (confirm('Delete this maintenance record?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.type !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.assetName?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length, Preventive: 0, Repair: 0 };
    items.forEach((i) => { if (counts[i.type] !== undefined)
        counts[i.type]++; });
    const assets = form.assetType === 'equipment' ? equipment : vehicles;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Equipment & Vehicles" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Maintenance Records" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " total records"] })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Log Maintenance"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k === 'All' ? 'Total' : k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Preventive', 'Repair'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Asset" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Description" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Cost" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.date }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.assetName }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`, children: r.type }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.description || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.cost ? `₱${Number(r.cost).toLocaleString()}` : '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Log Maintenance" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Asset Type" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => { setForm({ ...form, assetType: 'equipment', assetId: '' }); }, className: `px-3 py-2 text-sm rounded-lg border ${form.assetType === 'equipment' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: "Equipment" }), _jsx("button", { onClick: () => { setForm({ ...form, assetType: 'vehicle', assetId: '' }); }, className: `px-3 py-2 text-sm rounded-lg border ${form.assetType === 'vehicle' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: "Vehicle" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Asset ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.assetId, onChange: (e) => setForm({ ...form, assetId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsxs("option", { value: "", children: ["Select ", form.assetType, "..."] }), assets.map((a) => _jsxs("option", { value: a.id, children: [a.name, " (", a.id, ")"] }, a.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => setForm({ ...form, type: 'Preventive' }), className: `px-3 py-2 text-sm rounded-lg border ${form.type === 'Preventive' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: "Preventive" }), _jsx("button", { onClick: () => setForm({ ...form, type: 'Repair' }), className: `px-3 py-2 text-sm rounded-lg border ${form.type === 'Repair' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: "Repair" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Cost (\u20B1)" }), _jsx("input", { type: "number", value: form.cost, onChange: (e) => setForm({ ...form, cost: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Next Schedule" }), _jsx("input", { type: "date", value: form.nextScheduledDate, onChange: (e) => setForm({ ...form, nextScheduledDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.assetId, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Log"] })] })] }) }))] }));
}
