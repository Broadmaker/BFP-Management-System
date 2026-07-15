import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ExternalLink, Award, Clock, AlertCircle } from 'lucide-react';
const STORAGE_KEY = 'bfp-training-records';
const PERSONNEL_KEY = 'bfp-personnel';
function loadItems() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function loadPersonnel() {
    try {
        const raw = localStorage.getItem(PERSONNEL_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function isExpired(dateStr) {
    if (!dateStr)
        return false;
    return new Date(dateStr) < new Date();
}
function formatDate(d) {
    if (!d)
        return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
export default function TrainingRecords() {
    const [items, setItems] = useState(loadItems);
    const [personnel] = useState(loadPersonnel);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.personnelId || !form.title)
            return;
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            const id = crypto.randomUUID();
            const person = personnel.find((p) => p.id === form.personnelId);
            setItems((prev) => [{ id, ...form, name: person?.name || 'Unknown' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' });
    }
    function editItem(item) {
        setForm({
            personnelId: item.personnelId, title: item.title, provider: item.provider || '',
            completedDate: item.completedDate || '', expiryDate: item.expiryDate || '', certificateUrl: item.certificateUrl || ''
        });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) {
        if (confirm('Delete this training record?'))
            setItems((prev) => prev.filter((i) => i.id !== id));
    }
    const filtered = items.filter((r) => {
        if (filter === 'Expired' && !isExpired(r.expiryDate))
            return false;
        if (filter === 'Valid' && isExpired(r.expiryDate))
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.title.toLowerCase().includes(q) || (r.name || '').toLowerCase().includes(q);
        }
        return true;
    });
    const expired = items.filter((i) => isExpired(i.expiryDate)).length;
    const valid = items.filter((i) => i.expiryDate && !isExpired(i.expiryDate)).length;
    const noExpiry = items.filter((i) => !i.expiryDate).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Personnel & Shifts" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Training Records" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " training records"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add Training"] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Total Training" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: items.length })] }), _jsx("div", { className: "p-2 rounded-lg bg-blue-50", children: _jsx(Award, { size: 16, className: "text-blue-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Valid" }), _jsx("div", { className: "text-xl font-semibold text-green-600 mt-1", children: valid })] }), _jsx("div", { className: "p-2 rounded-lg bg-green-50", children: _jsx(Check, { size: 16, className: "text-green-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Expired" }), _jsx("div", { className: "text-xl font-semibold text-red-600 mt-1", children: expired })] }), _jsx("div", { className: "p-2 rounded-lg bg-red-50", children: _jsx(AlertCircle, { size: 16, className: "text-red-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "No Expiry" }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: noExpiry })] }), _jsx("div", { className: "p-2 rounded-lg bg-gray-50", children: _jsx(Clock, { size: 16, className: "text-gray-400" }) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Valid', 'Expired'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search training...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Personnel" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Training Title" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Provider" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Completed" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Expiry" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Cert" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsxs("tbody", { children: [filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-4 py-8 text-center text-sm text-gray-400", children: "No training records found." }) })), filtered.map((r) => {
                                            const expired = isExpired(r.expiryDate);
                                            return (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5", children: _jsx("div", { className: "font-medium text-gray-900", children: r.name }) }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.title }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.provider || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(r.completedDate) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(r.expiryDate) }), _jsx("td", { className: "px-4 py-2.5", children: r.expiryDate ? (_jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`, children: expired ? 'Expired' : 'Valid' })) : (_jsx("span", { className: "text-[11px] text-gray-400", children: "N/A" })) }), _jsx("td", { className: "px-4 py-2.5", children: r.certificateUrl ? (_jsx("a", { href: r.certificateUrl, target: "_blank", rel: "noopener noreferrer", className: "text-red-600 hover:text-red-700", children: _jsx(ExternalLink, { size: 14 }) })) : _jsx("span", { className: "text-gray-300", children: "\u2014" }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => editItem(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(X, { size: 14, className: "rotate-45" }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) })] }) })] }, r.id));
                                        })] })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Training' : 'Add Training Record' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Personnel ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.personnelId, onChange: (e) => setForm({ ...form, personnelId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select personnel..." }), personnel.map((p) => _jsxs("option", { value: p.id, children: [p.name, " (", p.id, ")"] }, p.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Training Title ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "e.g. Basic Fire Fighting Course" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Provider" }), _jsx("input", { type: "text", value: form.provider, onChange: (e) => setForm({ ...form, provider: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "e.g. BFP National Training Institute" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Completed Date" }), _jsx("input", { type: "date", value: form.completedDate, onChange: (e) => setForm({ ...form, completedDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Expiry Date" }), _jsx("input", { type: "date", value: form.expiryDate, onChange: (e) => setForm({ ...form, expiryDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Certificate URL" }), _jsx("input", { type: "url", value: form.certificateUrl, onChange: (e) => setForm({ ...form, certificateUrl: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "https://" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.personnelId || !form.title, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Add'] })] })] }) }))] }));
}
