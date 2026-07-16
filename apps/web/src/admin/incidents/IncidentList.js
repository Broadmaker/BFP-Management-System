import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, BarChart3, Search, AlertTriangle, Clock, Users, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { IncidentsApi } from '../../lib/api';

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
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    IncidentsApi.list({ limit, offset: page * limit }).then((data) => {
      setIncidents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Incident Management" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "All Incidents" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Link, { to: "analytics", className: "px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5", children: [_jsx(BarChart3, { size: 14 }), " Analytics"] }), _jsxs(Link, { to: "new", className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Report Incident"] })] })] }), loading ? _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." }) : _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: "Incident Records" }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: "Complete incident database" })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search incidents...", className: "pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 w-48" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-100 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Incident #" }), _jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Severity" }), _jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Location" }), _jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Date" }), _jsx("th", { className: "text-left px-4 py-2.5 font-medium text-gray-600", children: "Status" }), _jsx("th", { className: "text-right px-4 py-2.5 font-medium text-gray-600", children: "Actions" })] }) }), _jsx("tbody", { children: incidents.length === 0 ? _jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center text-gray-400 py-8", children: "No incidents found." }) }) : incidents.map((inc) => (_jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: inc.incidentNumber }), _jsx("td", { className: "px-4 py-3 text-gray-700", children: inc.type }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-medium ${severityColors[inc.severity] || ''}`, children: inc.severity }) }), _jsx("td", { className: "px-4 py-3 text-gray-700 max-w-[200px] truncate", children: inc.location }), _jsx("td", { className: "px-4 py-3 text-gray-500", children: new Date(inc.dateReported).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[inc.status] || ''}`, children: inc.status }) }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsx(Link, { to: `/admin/incidents/${inc.id}`, className: "text-red-600 hover:text-red-700 font-medium", children: "View" }) })] }, inc.id))) ] }) }), _jsxs("div", { className: "px-4 py-3 border-t border-gray-200 flex items-center justify-between", children: [_jsx("div", { className: "text-xs text-gray-500", children: `Showing ${page * limit + 1}-${page * limit + incidents.length}` }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setPage(Math.max(0, page - 1)), disabled: page === 0, className: "px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1", children: _jsx(ChevronLeft, { size: 12 }) }), _jsx("span", { className: "text-xs text-gray-600", children: `Page ${page + 1}` }), _jsx("button", { onClick: () => setPage(page + 1), disabled: incidents.length < limit, className: "px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1", children: _jsx(ChevronRight, { size: 12 }) })] })] })] })] }));
}
