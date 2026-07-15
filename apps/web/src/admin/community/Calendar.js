import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar as CalendarIcon, MapPin, Clock, Users } from 'lucide-react';
const months = [
    {
        month: 'August 2026',
        events: [
            { date: 'Aug 5', title: 'Commercial Estab. Fire Compliance Seminar', time: '9:00 AM - 12:00 PM', location: 'Ipil Heights Barangay Hall', type: 'Business Seminar', attendees: 28 },
            { date: 'Aug 15', title: 'Fire Prevention Seminar — Poblacion', time: '9:00 AM - 12:00 PM', location: 'Poblacion Barangay Hall', type: 'Seminar', attendees: 28 },
            { date: 'Aug 20', title: 'Earthquake & Fire Drill — Don Basilio School', time: '8:00 AM - 11:00 AM', location: 'Don Basilio School Inc.', type: 'Fire Drill', attendees: 62 },
            { date: 'Aug 28', title: 'Don Basilio Home Safety Check', time: '9:00 AM - 3:00 PM', location: 'Don Basilio Barangay', type: 'Outreach', attendees: 0 },
        ],
    },
    {
        month: 'September 2026',
        events: [
            { date: 'Sep 5', title: 'Home Fire Safety Workshop', time: '1:00 PM - 4:00 PM', location: 'Ipil Heights Covered Court', type: 'Seminar', attendees: 15 },
            { date: 'Sep 12', title: 'Basic Life Support Training', time: '8:00 AM - 5:00 PM', location: 'BFP Ipil Station Training Room', type: 'Seminar', attendees: 30 },
        ],
    },
    {
        month: 'October 2026',
        events: [
            { date: 'Oct 10', title: 'Makilas Barangay Fire Drill', time: '8:00 AM - 10:00 AM', location: 'Makilas Barangay Plaza', type: 'Fire Drill', attendees: 0 },
            { date: 'Oct 22', title: 'Upper Ipil Fire Safety Forum', time: '9:00 AM - 12:00 PM', location: 'Upper Ipil Barangay Hall', type: 'Seminar', attendees: 0 },
        ],
    },
];
const typeColors = {
    Seminar: 'border-l-indigo-500',
    'Fire Drill': 'border-l-orange-500',
    Outreach: 'border-l-teal-500',
    'Business Seminar': 'border-l-purple-500',
};
export default function Calendar() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Community Programs" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Event Calendar" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Upcoming programs, seminars, and drills" })] }), _jsx("div", { className: "space-y-8", children: months.map((m) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(CalendarIcon, { size: 16, className: "text-red-600" }), _jsx("h2", { className: "text-sm font-semibold text-gray-900", children: m.month })] }), _jsx("div", { className: "space-y-3", children: m.events.map((e) => (_jsxs("div", { className: `bg-white border border-gray-200 rounded-lg p-4 border-l-4 ${typeColors[e.type] || 'border-l-gray-300'}`, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-semibold text-red-600", children: e.date }), _jsx("h3", { className: "text-sm font-semibold text-gray-900 mt-0.5", children: e.title })] }), _jsx("span", { className: "text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600", children: e.type })] }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " ", e.time] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), " ", e.location] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 11 }), " ", e.attendees, " registered"] })] })] }, e.title))) })] }, m.month))) })] }));
}
