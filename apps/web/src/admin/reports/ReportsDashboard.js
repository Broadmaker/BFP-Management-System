import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, AlertTriangle, Building2, Truck, Flame } from 'lucide-react';
const STORAGE_KEYS = {
    incidents: 'bfp-incidents',
    inspections: 'bfp-inspections',
    personnel: 'bfp-personnel',
    equipment: 'bfp-equipment',
    vehicles: 'bfp-vehicles',
    hydrants: 'bfp-hydrants',
    violations: 'bfp-violations',
    certificates: 'bfp-certificates',
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
const COLORS = ['#dc2626', '#0ea5e9', '#eab308', '#22c55e', '#a855f7', '#f97316', '#6366f1', '#ec4899'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function ReportsDashboard() {
    const [data, setData] = useState({});
    useEffect(() => {
        const incidents = loadItems(STORAGE_KEYS.incidents);
        const inspections = loadItems(STORAGE_KEYS.inspections);
        const personnel = loadItems(STORAGE_KEYS.personnel);
        const equipment = loadItems(STORAGE_KEYS.equipment);
        const vehicles = loadItems(STORAGE_KEYS.vehicles);
        const hydrants = loadItems(STORAGE_KEYS.hydrants);
        const violations = loadItems(STORAGE_KEYS.violations);
        const certificates = loadItems(STORAGE_KEYS.certificates);
        const attendance = loadItems(STORAGE_KEYS.attendance);
        const leave = loadItems(STORAGE_KEYS.leave);
        // Incident type breakdown
        const typeMap = {};
        incidents.forEach((i) => { typeMap[i.type] = (typeMap[i.type] || 0) + 1; });
        const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
        // Incident severity breakdown
        const sevMap = {};
        incidents.forEach((i) => { sevMap[i.severity] = (sevMap[i.severity] || 0) + 1; });
        const sevData = Object.entries(sevMap).map(([name, value]) => ({ name, value }));
        // Monthly incident trend
        const monthMap = {};
        MONTHS.forEach(m => { monthMap[m] = 0; });
        incidents.forEach((i) => {
            if (i.date) {
                try {
                    const d = new Date(i.date);
                    const m = MONTHS[d.getMonth()];
                    monthMap[m] = (monthMap[m] || 0) + 1;
                }
                catch { }
            }
        });
        const trendData = MONTHS.map(m => ({ month: m, incidents: monthMap[m] || 0 }));
        // Inspection results
        const passCount = inspections.filter((i) => i.result === 'Passed').length;
        const failCount = inspections.filter((i) => i.result === 'Failed').length;
        const pendingInsp = inspections.filter((i) => !i.result || i.result === 'Pending Compliance' || i.result === 'Reinspection Required').length;
        // Attendance
        const present = attendance.filter((a) => a.type === 'Present').length;
        const absent = attendance.filter((a) => a.type === 'Absent').length;
        const late = attendance.filter((a) => a.type === 'Late').length;
        const onLeaveCount = attendance.filter((a) => a.type === 'On Leave').length;
        setData({
            incidents, inspections, personnel, equipment, vehicles, hydrants, violations, certificates, attendance, leave,
            typeData, sevData, trendData, passCount, failCount, pendingInsp, present, absent, late, onLeaveCount,
        });
    }, []);
    const kpis = [
        { label: 'Total Incidents', value: data.incidents?.length || 0, icon: Flame, color: 'bg-red-500', trend: 'up', pct: '+12%', link: '/admin/reports/incidents' },
        { label: 'Open Violations', value: data.violations?.filter((v) => v.status === 'Open').length || 0, icon: AlertTriangle, color: 'bg-orange-500', trend: 'up', pct: '+3%', link: '/admin/compliance' },
        { label: 'Active Personnel', value: data.personnel?.length || 0, icon: Users, color: 'bg-blue-500', trend: 'up', pct: '+5%', link: '/admin/reports/personnel' },
        { label: 'Inspections Done', value: data.inspections?.length || 0, icon: Building2, color: 'bg-emerald-500', trend: 'down', pct: '+8%', link: '/admin/reports/inspections' },
        { label: 'Equipment', value: data.equipment?.length || 0, icon: Activity, color: 'bg-purple-500', trend: 'neutral', pct: '0%', link: '/admin/equipment' },
        { label: 'Vehicles', value: data.vehicles?.length || 0, icon: Truck, color: 'bg-cyan-500', trend: 'neutral', pct: '0%', link: '/admin/vehicles' },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Reports & Analytics" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Reports Dashboard" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Overview of all station operations" })] }) }), _jsx("div", { className: "grid grid-cols-6 gap-4", children: kpis.map((k) => (_jsxs(Link, { to: k.link, className: "bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: `w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`, children: _jsx(k.icon, { size: 15, className: "text-white" }) }), _jsxs("span", { className: `text-xs font-medium flex items-center gap-0.5 ${k.trend === 'up' ? 'text-red-500' : k.trend === 'down' ? 'text-green-500' : 'text-gray-400'}`, children: [k.trend === 'up' ? _jsx(TrendingUp, { size: 12 }) : k.trend === 'down' ? _jsx(TrendingDown, { size: 12 }) : null, k.pct] })] }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: k.value }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: k.label })] }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Monthly Incident Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(AreaChart, { data: data.trendData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "incidentGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#dc2626", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#dc2626", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "incidents", stroke: "#dc2626", fill: "url(#incidentGrad)", strokeWidth: 2 })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Incidents by Type" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data.typeData, cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 90, paddingAngle: 2, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: data.typeData?.map((_, idx) => (_jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Incident Severity" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: data.sevData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: data.sevData?.map((_, idx) => (_jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx))) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Inspection Results" }), _jsx("div", { className: "flex items-center justify-center h-[250px] gap-8", children: [
                                    { label: 'Passed', value: data.passCount, color: 'bg-emerald-500' },
                                    { label: 'Failed', value: data.failCount, color: 'bg-red-500' },
                                    { label: 'Pending', value: data.pendingInsp, color: 'bg-yellow-500' },
                                ].map((i) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `w-20 h-20 ${i.color} rounded-full flex items-center justify-center mx-auto mb-2`, children: _jsx("span", { className: "text-2xl font-bold text-white", children: i.value }) }), _jsx("div", { className: "text-xs text-gray-500", children: i.label })] }, i.label))) })] })] })] }));
}
