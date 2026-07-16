import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Users, Plus, ArrowRight, Globe, Megaphone, BarChart3, FileText, Calendar } from 'lucide-react';
import { ServiceRequestsApi, AppointmentsApi, HazardReportsApi, ReportsApi } from '../lib/api';
function todayStr() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
export default function Dashboard() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [hazardReports, setHazardReports] = useState([]);
    const [overview, setOverview] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            ServiceRequestsApi.list(),
            AppointmentsApi.list(),
            HazardReportsApi.list(),
            ReportsApi.overview(),
        ]).then(([sr, appt, haz, ov]) => {
            setServiceRequests(sr);
            setAppointments(appt);
            setHazardReports(haz);
            setOverview(ov);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const pendingRequests = serviceRequests.filter((r) => r.status === 'Pending').length;
    const newHazards = hazardReports.filter((h) => h.status === 'New').length;
    const todayAppts = appointments.filter((a) => {
        if (!a.date)
            return false;
        const d = new Date(a.date);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) === todayStr();
    }).length;
    const stats = [
        { label: 'Pending Service Requests', value: String(pendingRequests), icon: FileText, color: 'text-red-600', bg: 'bg-red-50', to: '/admin/public-service' },
        { label: 'Appointments Today', value: String(todayAppts), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', to: '/admin/public-service/appointments' },
        { label: 'New Hazard Reports', value: String(newHazards), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', to: '/admin/public-service/hazards' },
        { label: 'Total Incidents', value: String(overview.incidentsCount ?? 0), icon: Users, color: 'text-green-600', bg: 'bg-green-50', to: '/admin/reports/incidents' },
    ];
    const recentHazards = hazardReports.slice(0, 3);
    const upcomingAppts = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').slice(0, 4);
    const hazardStatusColors = {
        New: 'bg-red-100 text-red-700', 'Under Investigation': 'bg-yellow-100 text-yellow-700',
        Resolved: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500',
    };
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "BFP Ipil Station" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Dashboard" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: ["Zamboanga Sibugay \u2014 ", todayStr()] })] }), _jsxs(Link, { to: "/admin/incidents/new", className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Report Incident"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: stats.map((s) => (_jsx(Link, { to: s.to, className: "bg-white border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: s.label }), _jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: s.value })] }), _jsx("div", { className: `p-2 rounded-lg ${s.bg}`, children: _jsx(s.icon, { size: 18, className: s.color }) })] }) }, s.label))) }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { className: "col-span-2 space-y-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: "Upcoming Appointments" }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: "Pending and confirmed inspection schedules" })] }), _jsxs(Link, { to: "/admin/public-service/appointments", className: "text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1", children: ["View All ", _jsx(ArrowRight, { size: 12 })] })] }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase", children: "Client" }), _jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase", children: "Time" }), _jsx("th", { className: "text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase", children: "Status" })] }) }), _jsxs("tbody", { children: [upcomingAppts.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-sm text-gray-400", children: "No appointments scheduled yet." }) })), upcomingAppts.map((a) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsxs("td", { className: "px-4 py-2.5", children: [_jsx("div", { className: "font-medium text-gray-900", children: a.name }), _jsx("div", { className: "text-xs text-gray-400", children: a.business !== '—' ? a.business : '' })] }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: a.type }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: a.date }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: a.time }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${a.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`, children: a.status }) })] }, a.id)))] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-3", children: "Quick Actions" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                                            { label: 'Record Incident', icon: Plus, to: '/admin/incidents/new', color: 'bg-red-600 hover:bg-red-700' },
                                            { label: 'Service Requests', icon: Globe, to: '/admin/public-service', color: 'bg-green-600 hover:bg-green-700' },
                                            { label: 'Book Appointment', icon: Calendar, to: '/admin/public-service/appointments', color: 'bg-blue-600 hover:bg-blue-700' },
                                            { label: 'Log Hazard', icon: AlertTriangle, to: '/admin/public-service/hazards', color: 'bg-orange-600 hover:bg-orange-700' },
                                            { label: 'Schedule Seminar', icon: Megaphone, to: '/admin/community', color: 'bg-purple-600 hover:bg-purple-700' },
                                            { label: 'Generate Report', icon: BarChart3, to: '/admin/reports', color: 'bg-teal-600 hover:bg-teal-700' },
                                        ].map((a) => (_jsxs(Link, { to: a.to, className: `${a.color} text-white text-xs font-medium rounded-lg px-3 py-2.5 flex items-center gap-2 transition-colors`, children: [_jsx(a.icon, { size: 14 }), " ", a.label] }, a.label))) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Recent Hazard Reports" }), _jsx(Link, { to: "/admin/public-service/hazards", className: "text-xs text-red-600 hover:text-red-700 font-medium", children: "View All" })] }), _jsxs("div", { className: "space-y-3", children: [recentHazards.length === 0 && (_jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "No hazard reports yet." })), recentHazards.map((h) => (_jsxs("div", { className: "flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0", children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${h.priority === 'Critical' ? 'bg-red-50 text-red-600' : h.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600'}`, children: _jsx(AlertTriangle, { size: 14 }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-xs font-medium text-gray-900 truncate", children: h.type }), _jsx("div", { className: "text-[11px] text-gray-500 truncate", children: h.location }), _jsx("span", { className: `text-[10px] font-medium px-1 py-0.5 rounded-full ${hazardStatusColors[h.status] || 'bg-gray-100 text-gray-600'}`, children: h.status })] })] }, h.id)))] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Public Service Summary" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs(Link, { to: "/admin/public-service", className: "flex items-center justify-between py-1 border-b border-gray-100 last:border-0", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Service Requests" }), _jsx("span", { className: "text-xs font-semibold text-gray-900", children: serviceRequests.length })] }), _jsxs(Link, { to: "/admin/public-service/appointments", className: "flex items-center justify-between py-1 border-b border-gray-100 last:border-0", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Appointments" }), _jsx("span", { className: "text-xs font-semibold text-gray-900", children: appointments.length })] }), _jsxs(Link, { to: "/admin/public-service/hazards", className: "flex items-center justify-between py-1 border-b border-gray-100 last:border-0", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Hazard Reports" }), _jsx("span", { className: "text-xs font-semibold text-gray-900", children: hazardReports.length })] }), _jsxs(Link, { to: "/admin/public-service/seminars", className: "flex items-center justify-between py-1 border-b border-gray-100 last:border-0", children: [_jsx("span", { className: "text-xs text-gray-600", children: "Incidents" }), _jsx("span", { className: "text-xs font-semibold text-gray-900", children: overview.incidentsCount ?? 0 })] })] })] })] })] })] }));
}
