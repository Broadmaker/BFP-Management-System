import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
const frequencyData = [
    { month: 'Jan', thisYear: 18, lastYear: 22 },
    { month: 'Feb', thisYear: 24, lastYear: 20 },
    { month: 'Mar', thisYear: 22, lastYear: 26 },
    { month: 'Apr', thisYear: 31, lastYear: 28 },
    { month: 'May', thisYear: 28, lastYear: 32 },
    { month: 'Jun', thisYear: 35, lastYear: 30 },
    { month: 'Jul', thisYear: 42, lastYear: 28 },
    { month: 'Aug', thisYear: 38, lastYear: 34 },
    { month: 'Sep', thisYear: 30, lastYear: 36 },
    { month: 'Oct', thisYear: 26, lastYear: 30 },
    { month: 'Nov', thisYear: 24, lastYear: 28 },
    { month: 'Dec', thisYear: 20, lastYear: 26 },
];
const typeData = [
    { name: 'Structural Fire', value: 110, color: '#dc2626' },
    { name: 'Medical Emergency', value: 65, color: '#0ea5e9' },
    { name: 'Vehicle Fire', value: 48, color: '#eab308' },
    { name: 'Rescue Operation', value: 42, color: '#22c55e' },
    { name: 'False Alarm', value: 38, color: '#a855f7' },
    { name: 'HazMat', value: 24, color: '#ef4444' },
    { name: 'Other', value: 15, color: '#9ca3af' },
];
const responseTimeData = [
    { severity: 'Critical', minutes: 3.2 },
    { severity: 'Major', minutes: 4.5 },
    { severity: 'Moderate', minutes: 5.8 },
    { severity: 'Minor', minutes: 7.1 },
];
const trendData = [
    { month: 'Jan', critical: 4, nonCritical: 14 },
    { month: 'Feb', critical: 6, nonCritical: 18 },
    { month: 'Mar', critical: 5, nonCritical: 17 },
    { month: 'Apr', critical: 8, nonCritical: 23 },
    { month: 'May', critical: 7, nonCritical: 21 },
    { month: 'Jun', critical: 9, nonCritical: 26 },
    { month: 'Jul', critical: 11, nonCritical: 31 },
    { month: 'Aug', critical: 10, nonCritical: 28 },
    { month: 'Sep', critical: 8, nonCritical: 22 },
    { month: 'Oct', critical: 6, nonCritical: 20 },
    { month: 'Nov', critical: 5, nonCritical: 19 },
    { month: 'Dec', critical: 4, nonCritical: 16 },
];
export default function IncidentAnalytics() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Incident Management" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Incident Analytics" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Link, { to: "/admin/incidents", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(ArrowLeft, { size: 14 }), " Incidents List"] }), _jsxs("button", { className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Download, { size: 14 }), " Generate Report"] })] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [
                    { label: 'Total Incidents (YTD)', value: '342', change: '-5%', down: true },
                    { label: 'Avg Response Time', value: '4.8min', change: '-12s', down: true },
                    { label: 'Most Common Type', value: 'Structural Fire', sub: '32% of all incidents' },
                    { label: 'Response Rate', value: '88%', sub: 'Within target time' },
                ].map((stat) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: stat.label }), _jsx("div", { className: "text-xl font-semibold text-gray-900 mt-1", children: stat.value }), _jsxs("div", { className: `text-xs mt-0.5 ${stat.down ? 'text-green-600' : 'text-gray-400'}`, children: [stat.change, " ", stat.sub || 'year over year'] })] }, stat.label))) }), _jsxs("div", { className: "grid grid-cols-[1fr_320px] gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900 mb-1", children: "Incident Frequency" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Year-to-date incidents by month" }), _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: frequencyData, children: [_jsx(CartesianGrid, { strokeDasharray: "4 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11, fill: '#9ca3af' }, axisLine: { stroke: '#e5e7eb' }, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 11, fill: '#9ca3af' }, axisLine: false, tickLine: false }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "thisYear", stroke: "#dc2626", strokeWidth: 2, dot: false, name: "This Year" }), _jsx(Line, { type: "monotone", dataKey: "lastYear", stroke: "#9ca3af", strokeWidth: 1.5, strokeDasharray: "4 3", dot: false, name: "Last Year" })] }) }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900 mb-1", children: "By Incident Type" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Distribution this year" }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: typeData, cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, dataKey: "value", paddingAngle: 2, children: typeData.map((entry, i) => (_jsx(Cell, { fill: entry.color, strokeWidth: 0 }, i))) }), _jsx(Tooltip, {})] }) }) }), _jsx("div", { className: "mt-2 space-y-1", children: typeData.map((item) => (_jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { backgroundColor: item.color } }), _jsx("span", { className: "flex-1 text-gray-600", children: item.name }), _jsx("span", { className: "text-gray-900 font-medium", children: item.value })] }, item.name))) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900 mb-1", children: "Response Time Trends" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Average response time by severity (minutes)" }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: responseTimeData, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "4 3", stroke: "#e5e7eb", horizontal: false }), _jsx(XAxis, { type: "number", tick: { fontSize: 11, fill: '#9ca3af' }, axisLine: false, tickLine: false }), _jsx(YAxis, { dataKey: "severity", type: "category", tick: { fontSize: 11, fill: '#374151' }, axisLine: false, tickLine: false }), _jsx(Tooltip, {}), _jsxs(Bar, { dataKey: "minutes", radius: [0, 4, 4, 0], barSize: 20, children: [_jsx(Cell, { fill: "#dc2626" }), _jsx(Cell, { fill: "#eab308" }), _jsx(Cell, { fill: "#0ea5e9" }), _jsx(Cell, { fill: "#22c55e" })] })] }) }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900 mb-1", children: "Monthly Trends" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Critical vs Non-Critical incidents" }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: trendData, children: [_jsx(CartesianGrid, { strokeDasharray: "4 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11, fill: '#9ca3af' }, axisLine: { stroke: '#e5e7eb' }, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 11, fill: '#9ca3af' }, axisLine: false, tickLine: false }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "critical", stackId: "1", stroke: "#dc2626", fill: "#fecaca", name: "Critical" }), _jsx(Area, { type: "monotone", dataKey: "nonCritical", stackId: "1", stroke: "#0ea5e9", fill: "#bae6fd", name: "Non-Critical" })] }) }) })] })] })] }));
}
