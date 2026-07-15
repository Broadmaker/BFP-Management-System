import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, FileText } from 'lucide-react';
const STORAGE_KEY = 'bfp-documents';
const SEED = [
    { id: '1', title: 'Monthly Incident Report - June 2026', type: 'report', category: 'Monthly Reports', description: 'Summary of all incidents for June 2026', status: 'Approved', version: 1, date: 'Jul 1, 2026' },
    { id: '2', title: 'Fire Safety Inspection Guidelines 2026', type: 'memorandum', category: 'Memoranda', description: 'Updated inspection protocols and checklists', status: 'Released', version: 2, date: 'Jun 28, 2026' },
    { id: '3', title: 'Station Maintenance Schedule Q3 2026', type: 'circular', category: 'Circulars', description: 'Equipment and vehicle maintenance schedule', status: 'Draft', version: 1, date: 'Jul 5, 2026' },
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
    Archived: 'bg-red-100 text-red-700',
};
const statuses = ['Draft', 'Pending Approval', 'Approved', 'Released', 'Archived'];
const categories = ['Monthly Reports', 'Memoranda', 'Circulars', 'Certificates', 'Reports', 'Others'];
export default function DocumentRepository() {
    const [items, setItems] = useState(loadItems);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', type: 'report', category: '', description: '', fileUrl: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);
    function save() {
        if (!form.title || !form.category)
            return;
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
        }
        else {
            const id = crypto.randomUUID();
            setItems((prev) => [{ id, ...form, status: 'Draft', version: 1, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ title: '', type: 'report', category: '', description: '', fileUrl: '' });
    }
    function edit(item) {
        setForm({ title: item.title, type: item.type, category: item.category, description: item.description || '', fileUrl: item.fileUrl || '' });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) { if (confirm('Delete this document?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    function updateStatus(id, status) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status, version: status === 'Released' ? i.version + 1 : i.version } : i)); }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (catFilter !== 'All' && r.category !== catFilter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.title.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length };
    statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Document Management" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Document Repository" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " documents"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ title: '', type: 'report', category: '', description: '', fileUrl: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Upload Document"] })] }), _jsx("div", { className: "grid grid-cols-6 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k === 'All' ? 'Total' : k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [['All', ...statuses].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))), _jsx("span", { className: "w-px h-4 bg-gray-200 mx-1" }), ['All', ...categories].map((c) => (_jsx("button", { onClick: () => setCatFilter(c), className: `text-xs px-2 py-1 rounded ${catFilter === c ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`, children: c === 'All' ? 'All Cats' : c }, c)))] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Title" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Category" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Version" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { size: 14, className: "text-gray-400 flex-shrink-0" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: r.title }), _jsx("div", { className: "text-xs text-gray-400", children: r.description || r.type })] })] }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded", children: r.category }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.date }), _jsxs("td", { className: "px-4 py-2.5 text-gray-600", children: ["v", r.version] }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("select", { value: r.status, onChange: (e) => updateStatus(r.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`, children: statuses.map((s) => _jsx("option", { value: s, children: s }, s)) }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => edit(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Document' : 'Upload Document' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Title ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Category ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select..." }), categories.map((c) => _jsx("option", { value: c, children: c }, c))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "report", children: "Report" }), _jsx("option", { value: "memorandum", children: "Memorandum" }), _jsx("option", { value: "circular", children: "Circular" }), _jsx("option", { value: "certificate", children: "Certificate" }), _jsx("option", { value: "other", children: "Other" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "File URL" }), _jsx("input", { type: "url", value: form.fileUrl, onChange: (e) => setForm({ ...form, fileUrl: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "https://" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.title || !form.category, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Upload'] })] })] }) }))] }));
}
