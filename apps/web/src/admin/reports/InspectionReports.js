import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowLeft, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ReportsApi, EstablishmentsApi, CertificatesApi } from '../../lib/api';
const COLORS = ['#22c55e', '#dc2626', '#eab308', '#a855f7', '#0ea5e9', '#f97316'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function InspectionReports() {
    const [inspections, setInspections] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            ReportsApi.inspections(),
            EstablishmentsApi.list(),
            CertificatesApi.list(),
        ]).then(([insp, est, cert]) => {
            setInspections(insp || []);
            setEstablishments(est || []);
            setCertificates(cert || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const total = inspections.length;
    const passed = inspections.filter((i) => i.result === 'Passed').length;
    const failed = inspections.filter((i) => i.result === 'Failed').length;
    const pending = inspections.filter((i) => !i.result || i.result === 'Pending Compliance' || i.result === 'Reinspection Required').length;
    const activeCertificates = certificates.filter((c) => c.status === 'Active').length;
    const compliant = establishments.filter((e) => e.complianceStatus === 'Compliant').length;
    const nonCompliant = establishments.filter((e) => e.complianceStatus === 'Non-Compliant').length;
    const resultMap = {};
    inspections.forEach((i) => { const r = i.result || 'Pending'; resultMap[r] = (resultMap[r] || 0) + 1; });
    const resultData = Object.entries(resultMap).map(([name, value]) => ({ name, value }));
    const monthMap = {};
    MONTHS.forEach(m => { monthMap[m] = 0; });
    inspections.forEach((i) => {
        if (i.completedDate || i.scheduledDate) {
            try {
                const d = new Date(i.completedDate || i.scheduledDate);
                monthMap[MONTHS[d.getMonth()]]++;
            }
            catch { }
        }
    });
    const trendData = MONTHS.map(m => ({ month: m, count: monthMap[m] }));
    const statusData = [
        { name: 'Compliant', value: compliant },
        { name: 'Non-Compliant', value: nonCompliant },
        { name: 'Pending', value: establishments.length - compliant - nonCompliant },
    ];
    const certStatus = [
        { name: 'Active', value: activeCertificates },
        { name: 'Expired', value: certificates.filter((c) => c.status === 'Expired').length },
        { name: 'Revoked', value: certificates.filter((c) => c.status === 'Revoked').length },
    ];
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Reports & Analytics" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Inspection Reports" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Fire safety inspection analytics" })] }), _jsxs(Link, { to: "/admin/reports", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(ArrowLeft, { size: 14 }), " Back"] })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [
                    { label: 'Total Inspections', value: total, icon: Building2, color: 'bg-blue-500' },
                    { label: 'Passed', value: passed, icon: CheckCircle, color: 'bg-emerald-500' },
                    { label: 'Failed', value: failed, icon: XCircle, color: 'bg-red-500' },
                    { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-500' },
                ].map((k) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("div", { className: `w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`, children: _jsx(k.icon, { size: 15, className: "text-white" }) }) }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: k.value }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: k.label })] }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Monthly Inspection Trend" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(AreaChart, { data: trendData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "inspGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#0ea5e9", stopOpacity: 0.2 }), _jsx("stop", { offset: "95%", stopColor: "#0ea5e9", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "count", stroke: "#0ea5e9", fill: "url(#inspGrad)", strokeWidth: 2 })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Inspection Results" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: resultData, cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 90, paddingAngle: 2, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: resultData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Establishment Compliance Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 }, stroke: "#9ca3af" }), _jsx(YAxis, { tick: { fontSize: 11 }, stroke: "#9ca3af", allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: statusData.map((_, idx) => _jsx(Cell, { fill: COLORS[idx % COLORS.length] }, idx)) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Certificate Status" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: certStatus, cx: "50%", cy: "50%", outerRadius: 90, paddingAngle: 3, dataKey: "value", label: ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`, children: certStatus.map((_, idx) => _jsx(Cell, { fill: ['#22c55e', '#dc2626', '#eab308'][idx % 3] }, idx)) }), _jsx(Tooltip, {})] }) })] })] })] }));
}
