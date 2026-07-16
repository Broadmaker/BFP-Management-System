import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Clock, Filter } from 'lucide-react';
import { AuditApi, UsersApi } from '../lib/api';
const MODULES = ['Incident Management', 'Fire Safety Inspection', 'Fire Code Compliance', 'Personnel Management', 'Equipment Management', 'Fire Hydrant Management', 'Community Programs', 'Reports & Analytics', 'Document Management', 'Public Service', 'System Administration'];
const ACTIONS = ['Create', 'Update', 'Delete', 'View', 'Approve', 'Reject', 'Login', 'Logout'];
const actionColors = {
    Create: 'bg-green-100 text-green-700',
    Update: 'bg-blue-100 text-blue-700',
    Delete: 'bg-red-100 text-red-700',
    View: 'bg-gray-100 text-gray-600',
    Approve: 'bg-emerald-100 text-emerald-700',
    Reject: 'bg-orange-100 text-orange-700',
    Login: 'bg-purple-100 text-purple-700',
    Logout: 'bg-gray-100 text-gray-500',
};
export default function AuditTrail() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterModule, setFilterModule] = useState('All');
    const [filterAction, setFilterAction] = useState('All');
    useEffect(() => {
        Promise.all([AuditApi.list(), UsersApi.list()]).then(([result, users]) => {
            const userMap = {};
            users.forEach((u) => { userMap[u.id] = u.name; });
            setLogs((result.items || []).map((l) => ({ ...l, user: userMap[l.userId] || l.userId || 'Unknown' })));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const filtered = logs.filter((l) => {
        if (filterModule !== 'All' && l.module !== filterModule)
            return false;
        if (filterAction !== 'All' && l.action !== filterAction)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return l.user.toLowerCase().includes(q) || (l.details || '').toLowerCase().includes(q) || l.module.toLowerCase().includes(q);
        }
        return true;
    });
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "System" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Audit Trail" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [logs.length, " logged events"] })] }) }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex-1 max-w-xs", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Search logs..." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { size: 14, className: "text-gray-400" }), _jsxs("select", { value: filterModule, onChange: (e) => setFilterModule(e.target.value), className: "px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "All", children: "All Modules" }), MODULES.map((m) => _jsx("option", { value: m, children: m }, m))] }), _jsxs("select", { value: filterAction, onChange: (e) => setFilterAction(e.target.value), className: "px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "All", children: "All Actions" }), ACTIONS.map((a) => _jsx("option", { value: a, children: a }, a))] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-100 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Timestamp" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "User" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Action" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Module" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "Details" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500", children: "IP Address" })] }) }), _jsx("tbody", { children: filtered.map((l) => (_jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-3 text-sm text-gray-500 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { size: 12, className: "text-gray-400" }), l.createdAt ? new Date(l.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-semibold", children: l.user.split(' ').map((n) => n[0]).slice(0, 2).join('') }), _jsx("span", { className: "text-sm text-gray-900", children: l.user })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full ${actionColors[l.action] || 'bg-gray-100 text-gray-600'}`, children: l.action }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: l.module }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500 max-w-xs truncate", children: l.details }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-400 font-mono", children: l.ipAddress || '—' })] }, l.id))) })] }) }), filtered.length === 0 && _jsx("div", { className: "text-center text-sm text-gray-400 py-8", children: "No audit logs found." })] })] }));
}
