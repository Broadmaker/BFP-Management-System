import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, BarChart3, Search, AlertTriangle, Clock, Users, CheckCircle } from 'lucide-react';
const stats = [
    { label: 'Active Incidents', value: '12', change: '+2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Avg Response', value: '4.2min', change: '-0.3', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Personnel Deployed', value: '48', change: '+6', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved This Month', value: '87', change: '+12%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
];
const incidents = [
    { id: 'BFP-4001', type: 'Structural Fire', severity: 'Critical', location: 'National Highway, Ipil Heights', date: 'Jul 13, 2026', status: 'Active' },
    { id: 'BFP-4002', type: 'Medical Emergency', severity: 'Major', location: 'Quezon Blvd, Sanito', date: 'Jul 12, 2026', status: 'Resolved' },
    { id: 'BFP-4003', type: 'Vehicle Fire', severity: 'Moderate', location: 'Gov. Cerilles St, Poblacion', date: 'Jul 11, 2026', status: 'Dispatched' },
    { id: 'BFP-4004', type: 'False Alarm', severity: 'Minor', location: 'Serenity Dr, Bangkerohan', date: 'Jul 10, 2026', status: 'Closed' },
    { id: 'BFP-4005', type: 'Gas Leak', severity: 'Major', location: 'Cueto St, Upper Ipil', date: 'Jul 10, 2026', status: 'On Scene' },
];
const statusColors = {
    Active: 'bg-red-100 text-red-700',
    Dispatched: 'bg-yellow-100 text-yellow-700',
    'On Scene': 'bg-purple-100 text-purple-700',
    Resolved: 'bg-blue-100 text-blue-700',
    Closed: 'bg-green-100 text-green-700'
};
const severityColors = {
    Critical: 'bg-red-100 text-red-700',
    Major: 'bg-yellow-100 text-yellow-700',
    Moderate: 'bg-blue-100 text-blue-700',
    Minor: 'bg-green-100 text-green-700'
};
export default function IncidentList() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Incident Management" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "All Incidents" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Link, { to: "analytics", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(BarChart3, { size: 14 }), " Analytics"] }), _jsxs(Link, { to: "new", className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Report Incident"] })] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: stats.map((stat) => (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: stat.label }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: stat.value }), _jsxs("div", { className: "text-xs text-gray-400 mt-0.5", children: [stat.change, " from last month"] })] }), _jsx("div", { className: `p-2 rounded-lg ${stat.bg}`, children: _jsx(stat.icon, { size: 16, className: stat.color }) })] }) }, stat.label))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: "Incident Records" }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: "Complete incident database" })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search incidents...", defaultValue: query, className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Incident #" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Severity" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Location" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Action" })] }) }), _jsx("tbody", { children: incidents.map((inc) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-gray-900", children: inc.id }), _jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: inc.type }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${severityColors[inc.severity]}`, children: inc.severity }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: inc.location }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: inc.date }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[inc.status]}`, children: inc.status }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx(Link, { to: inc.id, className: "text-xs text-red-600 hover:text-red-700 font-medium", children: "View" }) })] }, inc.id))) })] }) })] })] }));
}
