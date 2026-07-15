import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
const STORAGE_KEY = 'bfp-attendance';
const PERSONNEL_KEY = 'bfp-personnel';
function loadRecords() {
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
function todayStr() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
function todayISO() {
    return new Date().toISOString().split('T')[0];
}
const typeColors = {
    Present: 'bg-green-100 text-green-700',
    Absent: 'bg-red-100 text-red-700',
    Late: 'bg-yellow-100 text-yellow-700',
    'On Leave': 'bg-blue-100 text-blue-700',
    'Official Business': 'bg-purple-100 text-purple-700',
};
const types = ['Present', 'Absent', 'Late', 'On Leave', 'Official Business'];
export default function Attendance() {
    const [records, setRecords] = useState(loadRecords);
    const [personnel] = useState(loadPersonnel);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }, [records]);
    function save() {
        if (!form.personnelId || !form.date || !form.type)
            return;
        if (editing) {
            setRecords((prev) => prev.map((r) => r.id === editing.id ? { ...r, ...form } : r));
        }
        else {
            const id = crypto.randomUUID();
            const person = personnel.find((p) => p.id === form.personnelId);
            setRecords((prev) => [{ id, ...form, name: person?.name || 'Unknown' }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' });
    }
    function editRecord(r) {
        setForm({ personnelId: r.personnelId, date: r.date, type: r.type, timeIn: r.timeIn || '', timeOut: r.timeOut || '', remarks: r.remarks || '' });
        setEditing(r);
        setShowForm(true);
    }
    function remove(id) {
        if (confirm('Delete this attendance record?'))
            setRecords((prev) => prev.filter((r) => r.id !== id));
    }
    const filtered = records.filter((r) => {
        if (filter !== 'All' && r.type !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return (r.name || '').toLowerCase().includes(q);
        }
        return true;
    });
    const counts = { All: records.length };
    types.forEach((t) => { counts[t] = records.filter((r) => r.type === t).length; });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Personnel & Shifts" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Attendance" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [todayStr(), " \u2014 ", records.length, " records"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Log Attendance"] })] }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: Object.entries(counts).map(([k, v]) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3 cursor-pointer", onClick: () => setFilter(k), children: [_jsx("div", { className: "text-xs text-gray-500", children: k }), _jsx("div", { className: "text-lg font-semibold text-gray-900 mt-0.5", children: v })] }, k))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', ...types].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search personnel...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Personnel" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Time In" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Time Out" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Remarks" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsxs("tbody", { children: [filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-4 py-8 text-center text-sm text-gray-400", children: "No attendance records found." }) })), filtered.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5", children: _jsx("div", { className: "font-medium text-gray-900", children: r.name }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.date }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`, children: r.type }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.timeIn || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.timeOut || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-500 text-xs", children: r.remarks || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => editRecord(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(X, { size: 14, className: "rotate-45" }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) })] }) })] }, r.id)))] })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Attendance' : 'Log Attendance' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Personnel ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.personnelId, onChange: (e) => setForm({ ...form, personnelId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select personnel..." }), personnel.map((p) => _jsxs("option", { value: p.id, children: [p.name, " (", p.id, ")"] }, p.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm({ ...form, date: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("div", { className: "grid grid-cols-5 gap-1.5", children: types.map((t) => (_jsx("button", { onClick: () => setForm({ ...form, type: t }), className: `px-2 py-1.5 text-xs rounded-lg border ${form.type === t ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: t }, t))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Time In" }), _jsx("input", { type: "time", value: form.timeIn, onChange: (e) => setForm({ ...form, timeIn: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Time Out" }), _jsx("input", { type: "time", value: form.timeOut, onChange: (e) => setForm({ ...form, timeOut: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Remarks" }), _jsx("input", { type: "text", value: form.remarks, onChange: (e) => setForm({ ...form, remarks: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Optional" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.personnelId || !form.date, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Log'] })] })] }) }))] }));
}
