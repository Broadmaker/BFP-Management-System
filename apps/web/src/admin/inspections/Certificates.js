import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { CertificatesApi, EstablishmentsApi } from '../../lib/api';
const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Expired: 'bg-red-100 text-red-700',
    Revoked: 'bg-gray-100 text-gray-500',
};
function formatDate(d) {
    if (!d)
        return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
export default function Certificates() {
    const [items, setItems] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ establishmentId: '', certificateNumber: '', issuedDate: '', expiryDate: '' });
    useEffect(() => {
        Promise.all([CertificatesApi.list(), EstablishmentsApi.list()])
            .then(([c, e]) => { setItems(c); setEstablishments(e); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    function estName(id) {
        const e = establishments.find((x) => x.id === id);
        return e?.businessName || id;
    }
    async function save() {
        if (!form.establishmentId || !form.certificateNumber || !form.issuedDate || !form.expiryDate)
            return;
        const created = await CertificatesApi.create(form);
        setItems((prev) => [created, ...prev]);
        setShowForm(false);
        setForm({ establishmentId: '', certificateNumber: '', issuedDate: '', expiryDate: '' });
    }
    async function updateStatus(id, status) {
        const updated = await CertificatesApi.update(id, { status });
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
    }
    async function remove(id) {
        if (confirm('Delete this certificate?')) {
            await CertificatesApi.delete(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
        }
    }
    const filtered = items.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return (estName(r.establishmentId) || '').toLowerCase().includes(q) || r.certificateNumber.toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: items.length, Active: 0, Expired: 0, Revoked: 0 };
    items.forEach((i) => { if (counts[i.status] !== undefined)
        counts[i.status]++; });
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Fire Safety Inspection" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Certificates (FSIC)" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " certificates issued"] })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Issue Certificate"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k === 'All' ? 'Total' : k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Active', 'Expired', 'Revoked'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by establishment or cert #...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Certificate #" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Establishment" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Issued" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Expiry" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-gray-900 font-semibold", children: r.certificateNumber }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: estName(r.establishmentId) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(r.issuedDate) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(r.expiryDate) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("select", { value: r.status, onChange: (e) => updateStatus(r.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`, children: [_jsx("option", { value: "Active", children: "Active" }), _jsx("option", { value: "Expired", children: "Expired" }), _jsx("option", { value: "Revoked", children: "Revoked" })] }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) }) })] }, r.id))) })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Issue FSIC Certificate" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Establishment ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.establishmentId, onChange: (e) => setForm({ ...form, establishmentId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select..." }), establishments.map((e) => _jsx("option", { value: e.id, children: e.businessName }, e.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Certificate # ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.certificateNumber, onChange: (e) => setForm({ ...form, certificateNumber: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "e.g. FSIC-2026-0001" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Issued Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: form.issuedDate, onChange: (e) => setForm({ ...form, issuedDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Expiry Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: form.expiryDate, onChange: (e) => setForm({ ...form, expiryDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.establishmentId || !form.certificateNumber || !form.issuedDate || !form.expiryDate, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Issue"] })] })] }) }))] }));
}
