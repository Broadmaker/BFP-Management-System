import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
const SCHEDULE_KEY = 'bfp-inspection-schedule';
const ESTABLISHMENT_KEY = 'bfp-establishments';
function loadItems() {
    try {
        const raw = localStorage.getItem(SCHEDULE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function loadEstablishments() {
    try {
        const raw = localStorage.getItem(ESTABLISHMENT_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function todayStr() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
function formatDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
const resultColors = {
    Scheduled: 'bg-blue-100 text-blue-700',
    Passed: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-700',
    'Pending Compliance': 'bg-yellow-100 text-yellow-700',
    'Reinspection Required': 'bg-orange-100 text-orange-700',
};
const results = ['Scheduled', 'Passed', 'Failed', 'Pending Compliance', 'Reinspection Required'];
export default function InspectionSchedule() {
    const [items, setItems] = useState(loadItems);
    const [establishments] = useState(loadEstablishments);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' });
    const [weekOffset, setWeekOffset] = useState(0);
    useEffect(() => { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(items)); }, [items]);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay());
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });
    function getInspectionsForDate(date) {
        return items.filter((s) => s.scheduledDate === date);
    }
    function save() {
        if (!form.establishmentId || !form.scheduledDate)
            return;
        const est = establishments.find((e) => e.id === form.establishmentId);
        if (editing) {
            setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form, establishmentName: est?.businessName || 'Unknown' } : i));
        }
        else {
            const id = crypto.randomUUID();
            setItems((prev) => [{ id, ...form, establishmentName: est?.businessName || 'Unknown', createdAt: todayStr() }, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' });
    }
    function edit(item) {
        setForm({ establishmentId: item.establishmentId, scheduledDate: item.scheduledDate, result: item.result, inspector: item.inspector || '', notes: item.notes || '' });
        setEditing(item);
        setShowForm(true);
    }
    function remove(id) { if (confirm('Delete this inspection?'))
        setItems((prev) => prev.filter((i) => i.id !== id)); }
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Fire Safety Inspection" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Inspection Schedule" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [items.length, " total inspections"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Schedule Inspection"] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsx("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx("button", { onClick: () => setWeekOffset(weekOffset - 1), className: "p-1 hover:text-gray-900", children: _jsx(ChevronLeft, { size: 16 }) }), _jsxs("span", { className: "font-medium text-gray-900", children: [formatDate(weekDates[0]), " \u2014 ", formatDate(weekDates[6])] }), _jsx("button", { onClick: () => setWeekOffset(weekOffset + 1), className: "p-1 hover:text-gray-900", children: _jsx(ChevronRight, { size: 16 }) })] }) }), _jsx("div", { className: "grid grid-cols-7 divide-x divide-gray-200", children: weekDates.map((d, i) => {
                            const dayInspections = getInspectionsForDate(formatDate(d));
                            const isToday = d.toDateString() === today.toDateString();
                            return (_jsxs("div", { className: `${isToday ? 'bg-red-50/30' : ''}`, children: [_jsxs("div", { className: `text-center py-2 text-xs font-medium border-b border-gray-200 ${isToday ? 'text-red-600' : 'text-gray-500'}`, children: [_jsx("div", { children: weekdays[d.getDay()] }), _jsx("div", { className: `text-sm font-semibold ${isToday ? 'text-red-600' : 'text-gray-900'}`, children: d.getDate() })] }), _jsxs("div", { className: "p-1 space-y-1 min-h-[120px]", children: [dayInspections.length === 0 && _jsx("div", { className: "text-[10px] text-gray-300 text-center pt-4", children: "\u2014" }), dayInspections.slice(0, 3).map((ins) => (_jsxs("div", { onClick: () => edit(ins), className: `text-[10px] p-1 rounded cursor-pointer border ${resultColors[ins.result] || 'bg-gray-100'} border-transparent hover:opacity-80`, children: [_jsx("div", { className: "font-medium truncate", children: ins.establishmentName }), _jsx("div", { className: "opacity-75", children: ins.result })] }, ins.id))), dayInspections.length > 3 && _jsxs("div", { className: "text-[10px] text-gray-400 text-center", children: ["+", dayInspections.length - 3, " more"] })] })] }, i));
                        }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsx("div", { className: "px-4 py-3 border-b border-gray-200", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: "All Scheduled Inspections" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Establishment" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Inspector" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Result" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Notes" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsxs("tbody", { children: [items.length === 0 && _jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-sm text-gray-400", children: "No inspections scheduled." }) }), items.map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.establishmentName }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.scheduledDate }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.inspector || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${resultColors[r.result]}`, children: r.result }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-500 text-xs", children: r.notes || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) }) })] }, r.id)))] })] }) })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Inspection' : 'Schedule Inspection' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Establishment ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.establishmentId, onChange: (e) => setForm({ ...form, establishmentId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select..." }), establishments.map((e) => _jsx("option", { value: e.id, children: e.businessName }, e.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: form.scheduledDate, onChange: (e) => setForm({ ...form, scheduledDate: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Inspector" }), _jsx("input", { type: "text", value: form.inspector, onChange: (e) => setForm({ ...form, inspector: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Result" }), _jsx("select", { value: form.result, onChange: (e) => setForm({ ...form, result: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: results.map((r) => _jsx("option", { value: r, children: r }, r)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Notes" }), _jsx("textarea", { value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.establishmentId || !form.scheduledDate, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Schedule'] })] })] }) }))] }));
}
