import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Users, UserCheck, UserX, Clock } from 'lucide-react';
const STORAGE_KEYS = {
    personnel: 'bfp-personnel',
    attendance: 'bfp-attendance',
    leave: 'bfp-leave',
};
function loadItems(key) {
    try {
        const raw = localStorage.getItem(key);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
const COLORS = ['#0ea5e9', '#dc2626', '#eab308', '#22c55e', '#a855f7', '#f97316'];
export default function PersonnelReports() {
    const [personnel] = useState(loadItems(STORAGE_KEYS.personnel));
    const [attendance] = useState(loadItems(STORAGE_KEYS.attendance));
    const [leave] = useState(loadItems(STORAGE_KEYS.leave));
    const total = personnel.length;
    const active = personnel.filter((p) => p.isActive !== false).length;
    const onLeave = leave.filter((l) => l.status === 'Approved' && (!l.endDate || new Date(l.endDate) >= new Date())).length;
    const attMap = {};
    attendance.forEach((a) => { attMap[a.type] = (attMap[a.type] || 0) + 1; });
    const attData = Object.entries(attMap).map(([name, value]) => ({ name, value }));
    const leaveMap = {};
    leave.forEach((l) => { leaveMap[l.type] = (leaveMap[l.type] || 0) + 1; });
    const leaveData = Object.entries(leaveMap).map(([name, value]) => ({ name, value }));
    const leaveStatusMap = {};
    leave.forEach((l) => { const s = l.status || 'Pending'; leaveStatusMap[s] = (leaveStatusMap[s] || 0) + 1; });
    const leaveStatusData = Object.entries(leaveStatusMap).map(([name, value]) => ({ name, value }));
    const rankMap = {};
    personnel.forEach((p) => { if (p.rank)
        rankMap[p.rank] = (rankMap[p.rank] || 0) + 1; });
    const rankData = Object.entries(rankMap).map(([name, value]) => ({ name, value }));
    const presentCount = attendance.filter((a) => a.type === 'Present').length;
    const absentCount = attendance.filter((a) => a.type === 'Absent').length;
    const lateCount = attendance.filter((a) => a.type === 'Late').length;
    const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Reports & Analytics" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Personnel Reports" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Workforce analytics and attendance insights" })] }), _jsxs(Link, { to: "/admin/reports", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(ArrowLeft, { size: 14 }), " Back"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [
                    { label: 'Total Personnel', value: total, icon: Users, color: 'bg-blue-500' },
                    { label: 'Active', value: active, icon: UserCheck, color: 'bg-emerald-500' },
                    { label: 'On Leave', value: onLeave, icon: UserX, color: 'bg-orange-500' },
                    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: Clock, color: 'bg-purple-500' },
                ].map((k) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("div", { className: `w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`, children: _jsx(k.icon, { size: 15, className: "text-white" }) }) }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: k.value }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: k.label })] }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Attendance Breakdown" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: attData, cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 90, paddingAngle: 2, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: attData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Attendance Summary" }), _jsx("div", { className: "flex items-center justify-center h-[250px] gap-8", children: [
                                    { label: 'Present', value: presentCount, color: 'bg-emerald-500' },
                                    { label: 'Absent', value: absentCount, color: 'bg-red-500' },
                                    { label: 'Late', value: lateCount, color: 'bg-yellow-500' },
                                ].map((i) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `w-20 h-20 ${i.color} rounded-full flex items-center justify-center mx-auto mb-2`, children: _jsx("span", { className: "text-2xl font-bold text-white", children: i.value }) }), _jsx("div", { className: "text-xs text-gray-500", children: i.label })] }, i.label))) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Leave Requests by Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: leaveStatusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: leaveStatusData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Leave by Type" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: leaveData, cx: "50%", cy: "50%", outerRadius: 90, paddingAngle: 3, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: leaveData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) }), _jsx(Tooltip, {})] }) })] }), rankData.length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5 col-span-2", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Personnel by Rank" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: rankData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: rankData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }))] })] }));
}
