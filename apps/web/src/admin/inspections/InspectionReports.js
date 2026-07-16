import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { InspectionsApi, EstablishmentsApi } from '../../lib/api';
export default function InspectionReports() {
    const [inspections, setInspections] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([InspectionsApi.list(), EstablishmentsApi.list()])
            .then(([i, e]) => { setInspections(i); setEstablishments(e); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const total = inspections.length;
    const passed = inspections.filter((i) => i.result === 'Passed').length;
    const failed = inspections.filter((i) => i.result === 'Failed').length;
    const pending = inspections.filter((i) => i.result === 'Scheduled' || i.result === 'Pending Compliance').length;
    const passRate = total ? Math.round((passed / total) * 100) : 0;
    const uniqueEst = new Set(inspections.map((i) => i.establishmentId)).size;
    const resultCounts = {};
    inspections.forEach((i) => { resultCounts[i.result] = (resultCounts[i.result] || 0) + 1; });
    function estName(id) {
        const e = establishments.find((x) => x.id === id);
        return e?.businessName || id;
    }
    const topInspected = establishments
        .map((e) => ({
        name: e.businessName,
        count: inspections.filter((i) => i.establishmentId === e.id).length,
        status: e.complianceStatus,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Fire Safety Inspection" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Inspection Reports" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Summary of all inspection activities" })] }), _jsxs("button", { className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Download, { size: 14 }), " Export Report"] })] }), _jsxs("div", { className: "grid grid-cols-5 gap-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Total Inspections" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: total }), _jsxs("div", { className: "flex items-center gap-1 mt-1", children: [_jsx(BarChart3, { size: 12, className: "text-gray-400" }), _jsx("span", { className: "text-xs text-gray-400", children: "All time" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Passed" }), _jsx("div", { className: "text-2xl font-bold text-green-600 mt-1", children: passed }), _jsxs("div", { className: "text-xs text-green-600 mt-1", children: [passRate, "% pass rate"] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Failed" }), _jsx("div", { className: "text-2xl font-bold text-red-600 mt-1", children: failed })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Pending" }), _jsx("div", { className: "text-2xl font-bold text-yellow-600 mt-1", children: pending })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: "Establishments" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 mt-1", children: uniqueEst }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Inspected" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-3", children: "Results Breakdown" }), _jsxs("div", { className: "space-y-2", children: [Object.entries(resultCounts).length === 0 && _jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "No inspection data yet." }), Object.entries(resultCounts).map(([result, count]) => {
                                        const pct = total ? Math.round((count / total) * 100) : 0;
                                        const barColor = result === 'Passed' ? 'bg-green-500' :
                                            result === 'Failed' ? 'bg-red-500' :
                                                result === 'Reinspection Required' ? 'bg-orange-500' :
                                                    result === 'Pending Compliance' ? 'bg-yellow-500' : 'bg-blue-500';
                                        return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between text-xs mb-1", children: [_jsx("span", { className: "text-gray-700", children: result }), _jsxs("span", { className: "font-medium text-gray-900", children: [count, " (", pct, "%)"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-100 rounded-full", children: _jsx("div", { className: `h-2 rounded-full ${barColor}`, style: { width: `${pct}%` } }) })] }, result));
                                    })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-3", children: "Most Inspected Establishments" }), _jsxs("div", { className: "space-y-2", children: [topInspected.length === 0 && _jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "No inspections conducted yet." }), topInspected.map((e) => (_jsxs("div", { className: "flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-medium text-gray-900", children: e.name }), _jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full ${e.status === 'Compliant' ? 'bg-green-100 text-green-700' : e.status === 'Non-Compliant' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`, children: e.status })] }), _jsxs("span", { className: "text-xs font-semibold text-gray-900", children: [e.count, "x"] })] }, e.name)))] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsx("div", { className: "px-4 py-3 border-b border-gray-200", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: "Recent Inspections" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Establishment" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Result" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Notes" })] }) }), _jsx("tbody", { children: inspections.slice(0, 10).map((r) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: estName(r.establishmentId) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: r.scheduledDate }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${r.result === 'Passed' ? 'bg-green-100 text-green-700' :
                                                        r.result === 'Failed' ? 'bg-red-100 text-red-700' :
                                                            r.result === 'Reinspection Required' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-blue-100 text-blue-700'}`, children: r.result }) }), _jsx("td", { className: "px-4 py-2.5 text-gray-500 text-xs", children: r.notes || '—' })] }, r.id))) })] }) })] })] }));
}
