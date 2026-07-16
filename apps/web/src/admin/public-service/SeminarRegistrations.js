import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, Download, CheckCircle, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { ProgramsApi, ParticipantsApi } from '../../lib/api';
const SEMINAR_NAMES = ['Fire Prevention Seminar', 'Earthquake & Fire Drill', 'BLS Training', 'Home Fire Safety Workshop'];
const BARANGAYS = ['Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil', 'Sanito', 'Makilas', 'Lumbia'];
export default function SeminarRegistrations() {
    const [programs, setPrograms] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeminar, setSelectedSeminar] = useState(SEMINAR_NAMES[0]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
    const [search, setSearch] = useState('');
    useEffect(() => {
        Promise.all([ProgramsApi.list(), ParticipantsApi.list()])
            .then(([progs, parts]) => {
            setPrograms(progs || []);
            setParticipants(parts || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    function programLookup(seminar) {
        const existing = programs.find((p) => p.title === seminar);
        return existing;
    }
    const enriched = participants
        .map((p) => {
        const prog = programs.find((pr) => pr.id === p.programId);
        return { ...p, seminarName: prog?.title || '', seminarDate: prog?.scheduledDate || '' };
    })
        .filter((p) => p.seminarName === selectedSeminar);
    const filtered = enriched.filter((r) => {
        if (search) {
            const q = search.toLowerCase();
            return r.name.toLowerCase().includes(q) || (r.barangay || '').toLowerCase().includes(q);
        }
        return true;
    });
    const total = filtered.length;
    const attended = filtered.filter((r) => r.attended).length;
    async function save() {
        const prog = programLookup(form.seminar);
        let programId = prog?.id;
        if (!programId) {
            const created = await ProgramsApi.create({
                title: form.seminar,
                type: 'Seminar',
                scheduledDate: form.date ? new Date(form.date).toISOString() : null,
                status: 'Scheduled',
            });
            programId = created.id;
            setPrograms((prev) => [...prev, created]);
        }
        const payload = {
            programId,
            name: form.name,
            contactNumber: form.contact,
            barangay: form.barangay,
            attended: editing ? editing.attended : false,
        };
        if (editing) {
            await ParticipantsApi.update(editing.id, payload);
            setParticipants((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p));
        }
        else {
            const created = await ParticipantsApi.create(payload);
            setParticipants((prev) => [created, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
    }
    function edit(item) {
        setForm({ name: item.name, barangay: item.barangay || '', contact: item.contactNumber || '', seminar: item.seminarName, date: item.seminarDate || '' });
        setEditing(item);
        setShowForm(true);
    }
    async function remove(id) {
        if (confirm('Remove this registration?')) {
            await ParticipantsApi.delete(id);
            setParticipants((prev) => prev.filter((i) => i.id !== id));
        }
    }
    async function toggleAttendance(id) {
        const p = participants.find((x) => x.id === id);
        if (!p)
            return;
        const newVal = !p.attended;
        await ParticipantsApi.markAttended(id, newVal);
        setParticipants((prev) => prev.map((i) => i.id === id ? { ...i, attended: newVal } : i));
    }
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Public Service" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Seminar Registrations" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [participants.length, " total registrations"] })] }), _jsxs("button", { onClick: () => { setEditing(null); setForm({ name: '', barangay: '', contact: '', seminar: selectedSeminar, date: '' }); setShowForm(true); }, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Add Registration"] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3", children: [_jsx("div", { className: "flex items-center gap-2 flex-wrap", children: SEMINAR_NAMES.map((s) => (_jsx("button", { onClick: () => setSelectedSeminar(s), className: `text-xs font-medium px-3 py-1.5 rounded-md ${selectedSeminar === s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: s }, s))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "p-4 border-b border-gray-100 flex items-center gap-6 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { size: 14, className: "text-gray-400" }), " ", _jsx("span", { className: "text-gray-900 font-medium", children: total }), " registered"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { size: 14, className: "text-green-500" }), " ", _jsx("span", { className: "text-gray-900 font-medium", children: attended }), " attended"] }), _jsxs("button", { className: "ml-auto text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1", children: [_jsx(Download, { size: 12 }), " Export"] })] }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "#" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Name" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Barangay" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Contact" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Attended" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filtered.map((r, i) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 text-xs text-gray-400", children: i + 1 }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: r.name }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.barangay || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.contactNumber || '—' }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.seminarDate ? new Date(r.seminarDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: r.attended, onChange: () => toggleAttendance(r.id), className: "rounded border-gray-300 text-red-600 focus:ring-red-500" }), _jsx("span", { className: `text-xs ${r.attended ? 'text-green-700' : 'text-gray-400'}`, children: r.attended ? 'Present' : 'Mark' })] }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => edit(r), className: "p-1 text-gray-400 hover:text-blue-600", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => remove(r.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))) })] })] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: editing ? 'Edit Registration' : 'New Registration' }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Seminar" }), _jsx("select", { value: form.seminar, onChange: (e) => setForm({ ...form, seminar: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: SEMINAR_NAMES.map((s) => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Barangay" }), _jsxs("select", { value: form.barangay, onChange: (e) => setForm({ ...form, barangay: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select..." }), BARANGAYS.map((b) => _jsx("option", { children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Contact #" }), _jsx("input", { type: "text", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Event Date" }), _jsx("input", { type: "date", value: form.date ? new Date(form.date).toISOString().slice(0, 10) : '', onChange: (e) => {
                                                const d = new Date(e.target.value + 'T12:00:00');
                                                setForm({ ...form, date: d.toISOString() });
                                            }, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: save, disabled: !form.name || !form.barangay || !form.contact, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " ", editing ? 'Update' : 'Create'] })] })] }) }))] }));
}
