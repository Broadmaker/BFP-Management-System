import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
const STORAGE_KEY = 'bfp-incidents';
function loadItems() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return [];
}
const COLORS = ['#dc2626', '#0ea5e9', '#eab308', '#22c55e', '#a855f7', '#f97316', '#6366f1', '#ec4899', '#14b8a6', '#78716c'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function IncidentReports() {
    const [incidents] = useState(loadItems);
    const total = incidents.length;
    const critical = incidents.filter((i) => i.severity === 'Critical').length;
    const closed = incidents.filter((i) => i.status === 'Closed').length;
    const open = incidents.filter((i) => !i.status || i.status !== 'Closed').length;
    const typeMap = {};
    incidents.forEach((i) => { typeMap[i.type] = (typeMap[i.type] || 0) + 1; });
    const typeData = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
    const sevMap = {};
    incidents.forEach((i) => { sevMap[i.severity] = (sevMap[i.severity] || 0) + 1; });
    const sevData = Object.entries(sevMap).map(([name, value]) => ({ name, value }));
    const statusMap = {};
    incidents.forEach((i) => { const s = i.status || 'New'; statusMap[s] = (statusMap[s] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
    const monthMap = {};
    MONTHS.forEach(m => { monthMap[m] = 0; });
    incidents.forEach((i) => {
        if (i.date) {
            try {
                const d = new Date(i.date);
                monthMap[MONTHS[d.getMonth()]]++;
            }
            catch { }
        }
    });
    const trendData = MONTHS.map(m => ({ month: m, count: monthMap[m] }));
    const barangayMap = {};
    incidents.forEach((i) => { if (i.barangay)
        barangayMap[i.barangay] = (barangayMap[i.barangay] || 0) + 1; });
    const barangayData = Object.entries(barangayMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '...' : name, value }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Reports & Analytics" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Incident Reports" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Comprehensive incident data analysis" })] }), _jsxs(Link, { to: "/admin/reports", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(ArrowLeft, { size: 14 }), " Back"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [
                    { label: 'Total Incidents', value: total, icon: Activity, color: 'bg-blue-500' },
                    { label: 'Critical', value: critical, icon: AlertTriangle, color: 'bg-red-500' },
                    { label: 'Open / Active', value: open, icon: TrendingUp, color: 'bg-orange-500' },
                    { label: 'Closed', value: closed, icon: TrendingDown, color: 'bg-emerald-500' },
                ].map((k) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("div", { className: `w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`, children: _jsx(k.icon, { size: 15, className: "text-white" }) }) }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: k.value }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: k.label })] }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Monthly Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(AreaChart, { data: trendData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "incGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#dc2626", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#dc2626", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "count", stroke: "#dc2626", fill: "url(#incGrad)", strokeWidth: 2 })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "By Incident Type" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: typeData, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { type: "number", tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fontSize: 10 }, stroke: "#9ca3af", width: 100 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [0, 4, 4, 0], children: typeData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Severity Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: sevData, cx: "50%", cy: "50%", outerRadius: 90, paddingAngle: 3, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: sevData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Status Breakdown" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: statusData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }), barangayData.length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5 col-span-2", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Incidents by Barangay (Top 8)" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: barangayData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: barangayData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }))] })] }));
}
