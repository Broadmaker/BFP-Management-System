import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle, Calendar, Clock, FileText, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
const STORAGE_KEY = 'bfp-appointments';
function loadAppointments() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
function makeId() { return `APP-${Date.now().toString(36).toUpperCase().slice(-5)}`; }
const barangays = [
    'Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil',
    'Sanito', 'Makilas', 'Lumbia', 'Labi', 'Taway',
];
export default function PublicAppointments() {
    const [form, setForm] = useState({
        name: '', contact: '', barangay: '', address: '',
        business: '', type: 'Initial Inspection',
        preferredDate: '', preferredTime: '',
    });
    const [submitted, setSubmitted] = useState('');
    const [loading, setLoading] = useState(false);
    function formatDate(dateStr) {
        if (!dateStr)
            return '';
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }
    function formatTime(timeStr) {
        if (!timeStr)
            return '';
        const [h, m] = timeStr.split(':');
        const ampm = +h >= 12 ? 'PM' : 'AM';
        const h12 = +h % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    }
    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const appointments = loadAppointments();
            const id = makeId();
            const date = formatDate(form.preferredDate);
            const time = formatTime(form.preferredTime);
            appointments.unshift({
                id, name: form.name, contact: form.contact,
                barangay: form.barangay, address: form.address,
                business: form.business || '—',
                type: form.type, date, time, status: 'Pending',
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
            setSubmitted(id);
            setForm({ name: '', contact: '', barangay: '', address: '', business: '', type: 'Initial Inspection', preferredDate: '', preferredTime: '' });
            setLoading(false);
        }, 600);
    }
    if (submitted) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12", children: _jsx("div", { className: "max-w-lg mx-auto", children: _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5", children: _jsx(CheckCircle, { size: 32 }) }), _jsx("div", { className: "text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1", children: "Appointment Booked" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-1", children: "Your inspection has been scheduled" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Please save your reference number:" }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5", children: [_jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Reference Number" }), _jsx("div", { className: "text-2xl font-bold text-red-700 font-mono tracking-wider", children: submitted })] }), _jsx("p", { className: "text-xs text-gray-400 mb-6", children: "Our team will review your appointment and contact you for confirmation." }), _jsx("button", { onClick: () => setSubmitted(''), className: "w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors", children: "Book Another Appointment" })] }) }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12", children: [_jsxs("div", { className: "text-xs text-gray-400 mb-1", children: [_jsx(Link, { to: "/public", className: "hover:text-red-600", children: "Home" }), _jsx("span", { className: "mx-1", children: "/" }), _jsx("span", { className: "text-gray-600", children: "Inspection Appointments" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Inspection Appointments" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Schedule a fire safety inspection for your establishment or property in Ipil, Zamboanga Sibugay." })] }), _jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-8", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Appointment Details" }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: ["All fields marked with ", _jsx("span", { className: "text-red-500", children: "*" }), " are required."] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Full Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "e.g. Juan B. Dela Cruz" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Contact Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", value: form.contact, onChange: (e) => setForm({ ...form, contact: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "e.g. 0917-123-4567" })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Barangay ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.barangay, onChange: (e) => setForm({ ...form, barangay: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white", children: [_jsx("option", { value: "", children: "Select barangay..." }), barangays.map((b) => _jsx("option", { children: b }, b))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Business Name (optional)" }), _jsx("input", { type: "text", value: form.business, onChange: (e) => setForm({ ...form, business: e.target.value }), className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "If applicable" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Inspection Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: form.address, onChange: (e) => setForm({ ...form, address: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "Street, Barangay, Ipil, Zamboanga Sibugay" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Inspection Type ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white", children: [_jsx("option", { children: "Initial Inspection" }), _jsx("option", { children: "Reinspection" }), _jsx("option", { children: "Annual Inspection" })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Preferred Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: form.preferredDate, onChange: (e) => setForm({ ...form, preferredDate: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Preferred Time ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "time", value: form.preferredTime, onChange: (e) => setForm({ ...form, preferredTime: e.target.value }), required: true, className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" })] })] }), _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800", children: [_jsx("strong", { children: "Note:" }), " Your preferred schedule is subject to confirmation. We will contact you to confirm the final appointment details."] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full sm:w-auto px-6 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2", children: loading ? 'Submitting...' : _jsxs(_Fragment, { children: [_jsx(Calendar, { size: 16 }), " Book Appointment"] }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-5", children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(FileText, { size: 14, className: "text-gray-400" }), " What to Prepare"] }), _jsx("ul", { className: "text-xs text-gray-600 space-y-2", children: ['Valid government-issued ID', 'Business permit (if applicable)', 'Previous FSIC (for renewal)', 'Floor plan or building sketch'].map((item, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5", children: i + 1 }), item] }, i))) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-5", children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Clock, { size: 14, className: "text-gray-400" }), " Process Flow"] }), _jsx("ol", { className: "text-xs text-gray-600 space-y-2", children: ['Submit your appointment request', 'Inspector assigned to your request', 'Receive confirmation call or text', 'Inspection conducted on scheduled date'].map((step, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5", children: i + 1 }), step] }, i))) })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-5", children: [_jsxs("h3", { className: "text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2", children: [_jsx(Phone, { size: 14 }), " Need to Reschedule?"] }), _jsxs("p", { className: "text-xs text-blue-700 leading-relaxed", children: ["Call ", _jsx("strong", { className: "text-blue-800", children: "(062) 333-1234" }), " or email ", _jsx("strong", { className: "text-blue-800", children: "ipil@bfp.gov.ph" }), " with your reference number."] })] })] })] })] }));
}
