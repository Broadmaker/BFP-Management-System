import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, MapPin, Users, Building, School } from 'lucide-react';
const outreaches = [
    { id: 'OUT-001', type: 'Barangay Visit', title: 'Bangkerohan Barangay Outreach', barangay: 'Bangkerohan', date: 'Jul 28, 2026', households: 52, attendees: 134, status: 'Completed' },
    { id: 'OUT-002', type: 'School Visit', title: 'Fire Safety Lecture — Ipil Central School', barangay: 'Poblacion', date: 'Jul 15, 2026', households: null, attendees: 340, status: 'Completed' },
    { id: 'OUT-003', type: 'Business Seminar', title: 'Commercial Estab. Fire Compliance', barangay: 'Ipil Heights', date: 'Aug 5, 2026', households: null, attendees: 28, status: 'Scheduled' },
    { id: 'OUT-004', type: 'Barangay Visit', title: 'Don Basilio Home Safety Check', barangay: 'Don Basilio', date: 'Aug 28, 2026', households: 40, attendees: 0, status: 'Scheduled' },
    { id: 'OUT-005', type: 'School Visit', title: 'Earthquake Drill — Don Basilio School', barangay: 'Don Basilio', date: 'Aug 20, 2026', households: null, attendees: 0, status: 'Scheduled' },
    { id: 'OUT-006', type: 'Campaign', title: 'Fire Prevention Month Caravan', barangay: 'Poblacion', date: 'Mar 15, 2026', households: 200, attendees: 500, status: 'Completed' },
];
const typeIcons = {
    'Barangay Visit': Building,
    'School Visit': School,
    'Business Seminar': Users,
    'Campaign': MapPin,
};
const statusColors = {
    Scheduled: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-green-100 text-green-700',
    Completed: 'bg-gray-100 text-gray-600',
};
export default function Outreach() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Community Programs" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Outreach Programs" })] }), _jsxs("button", { className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Schedule Outreach"] })] }), _jsx("div", { className: "grid gap-4", children: outreaches.map((o) => {
                    const Icon = typeIcons[o.type];
                    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:border-red-200 transition-colors", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0", children: _jsx(Icon, { size: 18 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600`, children: o.type }), _jsx("h3", { className: "text-sm font-semibold text-gray-900 mt-1", children: o.title })] }), _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[o.status]}`, children: o.status })] }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), " ", o.barangay] }), _jsx("span", { children: o.date }), o.households !== null && _jsxs("span", { children: [o.households, " households"] }), o.attendees > 0 && _jsxs("span", { children: [o.attendees, " attendees"] })] })] }), _jsx("button", { className: "text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap", children: "View Details" })] }, o.id));
                }) })] }));
}
