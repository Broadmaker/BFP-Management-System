import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
const INSPECTION_KEY = 'bfp-hydrant-inspections';
const HYDRANT_KEY = 'bfp-hydrants';
function loadInspections() {
    try {
        const raw = localStorage.getItem(INSPECTION_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function loadHydrants() {
    try {
        const raw = localStorage.getItem(HYDRANT_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
export default function HydrantInspections() {
    const [items, setItems] = useState(loadInspections);
    const [hydrants, setHydrants] = useState(loadHydrants);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ hydrantId: '', waterPressure: '', isOperational: 'true', remarks: '' });
    useEffect(() => { localStorage.setItem(INSPECTION_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.hydrantId)
            return;
        const hydrant = hydrants.find((h) => h.id === form.hydrantId);
        const isOp = form.isOperational === 'true';
        const id = crypto.randomUUID();
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        setItems((prev) => [{ id, ...form, hydrantName: hydrant?.hydrantId || 'Unknown', barangay: hydrant?.barangay || '', isOperational: isOp, date: dateStr }, ...prev]);
        setHydrants((prev) => prev.map((h) => h.id === form.hydrantId ? {
            ...h, lastInspected: dateStr, waterPressure: form.waterPressure || h.waterPressure,
            status: isOp ? 'Operational' : 'Under Repair',
        } : h));
        setShowForm(false);
        setForm({ hydrantId: '', waterPressure: '', isOperational: 'true', remarks: '' });
    }
    function remove(id) { if (confirm('Delete this inspection?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && (filter === 'Operational' ? !r.isOperational : r.isOperational))
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.hydrantName?.toLowerCase().includes(q) || r.barangay?.toLowerCase().includes(q);
        }
        return true;
    });
    const passed = items.filter((i) => i.isOperational).length;
    const failed = items.filter((i) => !i.isOperational).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Fire Hydrants" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Hydrant Inspections" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " inspections \u00B7 ", passed, " passed"] })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " New Inspection"] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Total Inspections" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: items.length })] }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Operational" }), _jsx("div", { className: "text-2xl font-bold text-green-600 mt-1", children: passed })] }), _jsx("div", { className: "p-2 rounded-lg bg-green-50", children: _jsx(ThumbsUp, { size: 16, className: "text-green-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Needs Repair" }), _jsx("div", { className: "text-2xl font-bold text-red-600 mt-1", children: failed })] }), _jsx("div", { className: "p-2 rounded-lg bg-red-50", children: _jsx(ThumbsDown, { size: 16, className: "text-red-600" }) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Operational', 'Needs Repair'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Hydrant" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Barangay" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Pressure" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Remarks" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.date }), _jsx("td", { className: "px-4 py-2.5 font-mono text-xs font-semibold text-gray-900", children: r.hydrantName }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.barangay }), _jsx("td", { className: "px-4 py-2.5 text-gray-900 font-medium", children: r.waterPressure ? `${r.waterPressure} PSI` : '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${r.isOperational ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`, children: r.isOperational ? 'Operational' : 'Needs Repair' }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-500 text-xs", children: r.remarks || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Record Hydrant Inspection" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Hydrant ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.hydrantId, onChange: (e) => setForm({ ...form, hydrantId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select hydrant..." }), hydrants.map((h) => _jsxs("option", { value: h.id, children: [h.hydrantId, " \u2014 ", h.barangay] }, h.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Water Pressure (PSI)" }), _jsx("input", { type: "number", value: form.waterPressure, onChange: (e) => setForm({ ...form, waterPressure: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Operational Status" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("button", { onClick: () => setForm({ ...form, isOperational: 'true' }), className: `px-3 py-2 text-sm rounded-lg border ${form.isOperational === 'true' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: [_jsx(ThumbsUp, { size: 14, className: "inline mr-1" }), "Operational"] }), _jsxs("button", { onClick: () => setForm({ ...form, isOperational: 'false' }), className: `px-3 py-2 text-sm rounded-lg border ${form.isOperational === 'false' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: [_jsx(ThumbsDown, { size: 14, className: "inline mr-1" }), "Needs Repair"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Remarks" }), _jsx("textarea", { value: form.remarks, onChange: (e) => setForm({ ...form, remarks: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.hydrantId, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Record"] })] })] }) }))] }));
}
