import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Plus, Users, Calendar, MapPin, Clock, Award } from 'lucide-react';
const stats = [
    { label: 'Active Seminars', value: '6', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Participants', value: '184', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Upcoming Drills', value: '3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'This Month', value: '8', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
];
const programs = [
    { id: 'PRG-001', title: 'Fire Prevention Seminar', type: 'Seminar', date: 'Aug 15, 2026', location: 'Poblacion Barangay Hall', barangay: 'Poblacion', participants: 28, slots: 45, status: 'Scheduled' },
    { id: 'PRG-002', title: 'Earthquake & Fire Drill', type: 'Fire Drill', date: 'Aug 20, 2026', location: 'Don Basilio School Inc.', barangay: 'Don Basilio', participants: 0, slots: 200, status: 'Scheduled' },
    { id: 'PRG-003', title: 'Home Fire Safety Workshop', type: 'Seminar', date: 'Sep 5, 2026', location: 'Ipil Heights Covered Court', barangay: 'Ipil Heights', participants: 15, slots: 50, status: 'Scheduled' },
    { id: 'PRG-004', title: 'BLS Training', type: 'Seminar', date: 'Sep 12, 2026', location: 'BFP Ipil Station Training Room', barangay: 'Poblacion', participants: 30, slots: 30, status: 'Full' },
    { id: 'PRG-005', title: 'Barangay Bangkerohan Outreach', type: 'Outreach', date: 'Jul 28, 2026', location: 'Bangkerohan Barangay Hall', barangay: 'Bangkerohan', participants: 52, slots: 100, status: 'Completed' },
    { id: 'PRG-006', title: 'School Fire Safety Campaign', type: 'Campaign', date: 'Jul 15, 2026', location: 'Ipil Central School', barangay: 'Poblacion', participants: 340, slots: 500, status: 'Completed' },
    { id: 'PRG-007', title: 'Makilas Barangay Fire Drill', type: 'Fire Drill', date: 'Oct 10, 2026', location: 'Makilas Barangay Plaza', barangay: 'Makilas', participants: 0, slots: 150, status: 'Scheduled' },
    { id: 'PRG-008', title: 'Upper Ipil Fire Safety Forum', type: 'Seminar', date: 'Oct 22, 2026', location: 'Upper Ipil Barangay Hall', barangay: 'Upper Ipil', participants: 0, slots: 40, status: 'Scheduled' },
];
const statusColors = {
    Scheduled: 'bg-blue-100 text-blue-700',
    'Full': 'bg-red-100 text-red-700',
    Ongoing: 'bg-green-100 text-green-700',
    Completed: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-yellow-100 text-yellow-700',
};
const typeColors = {
    Seminar: 'bg-indigo-100 text-indigo-700',
    'Fire Drill': 'bg-orange-100 text-orange-700',
    Outreach: 'bg-teal-100 text-teal-700',
    Campaign: 'bg-pink-100 text-pink-700',
};
export default function CommunityPrograms() {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? programs : programs.filter((p) => p.status === filter);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Community Programs" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Seminars & Drills" })] }), _jsxs("button", { className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " New Program"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: stats.map((s) => (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: s.label }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: s.value })] }), _jsx("div", { className: `p-2 rounded-lg ${s.bg}`, children: _jsx(s.icon, { size: 16, className: s.color }) })] }) }, s.label))) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: ['All', 'Scheduled', 'Full', 'Completed'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search programs...", className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Program" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Location" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Participants" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Action" })] }) }), _jsx("tbody", { children: filtered.map((p) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: p.title }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[p.type]}`, children: p.type }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: p.date }), _jsx("td", { className: "px-4 py-2.5 text-gray-600 max-w-[200px] truncate", title: p.location, children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11, className: "text-gray-400" }), p.location] }) }), _jsxs("td", { className: "px-4 py-2.5 text-gray-600", children: [p.participants, "/", p.slots] }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[p.status]}`, children: p.status }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { className: "text-xs text-red-600 hover:text-red-700 font-medium", children: "Manage" }) })] }, p.id))) })] })] })] }));
}
