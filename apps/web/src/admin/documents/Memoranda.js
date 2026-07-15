import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, X, Check, FileText, Users, Clock } from 'lucide-react';
const STORAGE_KEY = 'bfp-memoranda';
const SEED = [
    { id: '1', subject: 'Revised Fire Safety Guidelines 2026', from: 'SUPT Juan Dela Cruz', date: 'Jul 14, 2026', priority: 'High', status: 'Released' },
    { id: '2', subject: 'Schedule of Fire Drills for Q3 2026', from: 'SINSP Maria Santos', date: 'Jul 12, 2026', priority: 'Normal', status: 'Approved' },
    { id: '3', subject: 'Equipment Maintenance Reminder', from: 'FO3 Roberto Mendoza', date: 'Jul 10, 2026', priority: 'Normal', status: 'Draft' },
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
    Draft: 'bg-gray-100 text-gray-600',
    'Pending Approval': 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Released: 'bg-blue-100 text-blue-700',
};
const priorityColors = {
    High: 'bg-red-100 text-red-700',
    Normal: 'bg-blue-100 text-blue-700',
    Low: 'bg-gray-100 text-gray-500',
};
const statuses = ['Draft', 'Pending Approval', 'Approved', 'Released'];
export default function Memoranda() {
    const [items, setItems] = useState(loadItems);
    const [search] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ subject: '', content: '', priority: 'Normal' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.subject)
            return;
        const id = crypto.randomUUID();
        setItems((prev) => [{ id, ...form, from: 'Station Commander', date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'Draft' }, ...prev]);
        setShowForm(false);
        setForm({ subject: '', content: '', priority: 'Normal' });
    }
    function updateStatus(id, s) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: s } : i)); }
    function remove(id) { if (confirm('Delete this memorandum?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.subject.toLowerCase().includes(q) || r.from?.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length };
    statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Document Management" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Memoranda" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " memoranda"] })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " New Memo"] })] }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k === 'All' ? 'Total' : k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "space-y-2", children: [filtered.map((r) => (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(FileText, { size: 14, className: "text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: r.subject }), _jsx("span", { className: `text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priorityColors[r.priority]}`, children: r.priority })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-500 ml-6", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 11 }), " ", r.from] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " ", r.date] })] }), r.content && _jsx("p", { className: "text-xs text-gray-600 mt-2 ml-6", children: r.content })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-4", children: [_jsx("select", { value: r.status, onChange: (e) => updateStatus(r.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) })] })] }) }, r.id))), filtered.length === 0 && _jsx("div", { className: "text-center text-sm text-gray-400 py-8", children: "No memoranda found." })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "New Memorandum" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Subject ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.subject, onChange: (e) => setForm({ ...form, subject: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Priority" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['High', 'Normal', 'Low'].map((p) => (_jsx("button", { onClick: () => setForm({ ...form, priority: p }), className: `px-3 py-2 text-sm rounded-lg border ${form.priority === p ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: p }, p))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Content" }), _jsx("textarea", { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), rows: 4, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Memorandum content..." })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.subject, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Create"] })] })] }) }))] }));
}
