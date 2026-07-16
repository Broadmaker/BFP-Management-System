import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, X, Check, ChevronLeft, ChevronRight, Sun, Moon, Coffee } from 'lucide-react';
import { ShiftsApi, PersonnelApi } from '../../lib/api';
function formatDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
const shiftMeta = {
    Day: { icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    Night: { icon: Moon, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    Off: { icon: Coffee, color: 'bg-gray-100 text-gray-500 border-gray-200' },
};
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function DutyRoster() {
    const [roster, setRoster] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weekOffset, setWeekOffset] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ personnelId: '', shiftType: 'Day', startTime: '08:00', endTime: '20:00', notes: '' });
    useEffect(() => {
        Promise.all([PersonnelApi.list(), ShiftsApi.list()]).then(([p, s]) => {
            setPersonnel(p);
            setRoster(s);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay());
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });
    function dateISO(d) {
        return d.toISOString().split('T')[0];
    }
    function getShift(personId, date) {
        const ds = dateISO(date);
        return roster.find((s) => s.personnelId === personId && s.shiftDate === ds);
    }
    async function save() {
        if (!form.personnelId || !form.shiftType)
            return;
        const ds = dateISO(weekDates[0]);
        const existing = roster.find((s) => s.personnelId === form.personnelId && s.shiftDate === ds);
        if (existing) {
            const updated = await ShiftsApi.update(existing.id, form);
            setRoster((prev) => prev.map((s) => s.id === existing.id ? { ...s, ...updated } : s));
        }
        else {
            const created = await ShiftsApi.create({ ...form, shiftDate: ds });
            setRoster((prev) => [...prev, created]);
        }
        setShowForm(false);
        setForm({ personnelId: '', shiftType: 'Day', startTime: '08:00', endTime: '20:00', notes: '' });
    }
    async function removeShift(personId, date) {
        const ds = dateISO(date);
        const shift = roster.find((s) => s.personnelId === personId && s.shiftDate === ds);
        if (shift && confirm('Remove this shift?')) {
            await ShiftsApi.delete(shift.id);
            setRoster((prev) => prev.filter((s) => s.id !== shift.id));
        }
    }
    const activePersonnel = personnel.filter((p) => p.isActive);
    const ShiftIcon = ({ type }) => {
        const Icon = shiftMeta[type]?.icon;
        return Icon ? _jsx(Icon, { size: 12 }) : null;
    };
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Personnel & Shifts" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Duty Roster" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: ["Weekly shift schedule \u2014 ", formatDate(today)] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-500", children: [_jsx("button", { onClick: () => setWeekOffset(weekOffset - 1), className: "p-1 hover:text-gray-900", children: _jsx(ChevronLeft, { size: 16 }) }), _jsxs("span", { className: "font-medium text-gray-900 min-w-[140px] text-center", children: [formatDate(weekDates[0]), " \u2014 ", formatDate(weekDates[6])] }), _jsx("button", { onClick: () => setWeekOffset(weekOffset + 1), className: "p-1 hover:text-gray-900", children: _jsx(ChevronRight, { size: 16 }) })] }), _jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Assign Shift"] })] })] }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10", children: "Personnel" }), weekDates.map((d, i) => (_jsxs("th", { className: `text-center px-2 py-2.5 text-xs font-medium min-w-[100px] ${d.toDateString() === today.toDateString() ? 'text-red-600' : 'text-gray-500 uppercase'}`, children: [_jsx("div", { children: weekdays[d.getDay()] }), _jsx("div", { className: `text-sm font-semibold ${d.toDateString() === today.toDateString() ? 'text-red-600' : 'text-gray-900'}`, children: d.getDate() })] }, i)))] }) }), _jsxs("tbody", { children: [activePersonnel.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-4 py-8 text-center text-sm text-gray-400", children: "No active personnel. Add personnel records first." }) })), activePersonnel.map((p) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsxs("td", { className: "px-3 py-2 sticky left-0 bg-white border-r border-gray-100 z-10", children: [_jsx("div", { className: "font-medium text-gray-900 text-xs", children: p.name || p.employeeNumber }), _jsx("div", { className: "text-[10px] text-gray-400", children: p.position })] }), weekDates.map((d, i) => {
                                            const shift = getShift(p.id, d);
                                            const isToday = d.toDateString() === today.toDateString();
                                            return (_jsx("td", { className: `text-center px-2 py-2 ${isToday ? 'bg-red-50/30' : ''}`, children: shift ? (_jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium ${shiftMeta[shift.shiftType]?.color || 'bg-gray-100'}`, children: [_jsx(ShiftIcon, { type: shift.shiftType }), shift.shiftType, shift.startTime && shift.shiftType !== 'Off' && (_jsxs("span", { className: "text-[10px] opacity-75", children: [shift.startTime, "-", shift.endTime] })), _jsx("button", { onClick: () => removeShift(p.id, d), className: "ml-0.5 hover:text-red-600", children: _jsx(X, { size: 10 }) })] })) : (_jsx("span", { className: "text-[11px] text-gray-300", children: "\u2014" })) }, i));
                                        })] }, p.id)))] })] }) }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Sun, { size: 12, className: "text-amber-500" }), " Day"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Moon, { size: 12, className: "text-indigo-500" }), " Night"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Coffee, { size: 12, className: "text-gray-400" }), " Off"] })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Assign Shift" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Personnel ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.personnelId, onChange: (e) => setForm({ ...form, personnelId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select personnel..." }), activePersonnel.map((p) => _jsx("option", { value: p.id, children: p.name || p.employeeNumber }, p.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Shift Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['Day', 'Night', 'Off'].map((t) => (_jsx("button", { onClick: () => setForm({ ...form, shiftType: t }), className: `px-3 py-2 text-sm rounded-lg border ${form.shiftType === t ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`, children: t }, t))) })] }), form.shiftType !== 'Off' && (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Start Time" }), _jsx("input", { type: "time", value: form.startTime, onChange: (e) => setForm({ ...form, startTime: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "End Time" }), _jsx("input", { type: "time", value: form.endTime, onChange: (e) => setForm({ ...form, endTime: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Notes" }), _jsx("input", { type: "text", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Optional" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.personnelId, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Assign"] })] })] }) }))] }));
}
