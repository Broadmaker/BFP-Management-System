import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, Shield, AlertTriangle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { ComplianceApi, EstablishmentsApi } from '../../lib/api';
const statusColors = {
    Open: 'bg-red-100 text-red-700',
    Resolved: 'bg-green-100 text-green-700',
    Overdue: 'bg-orange-100 text-orange-700',
};
const complianceStatusColors = {
    Compliant: 'bg-green-100 text-green-700',
    'Non-Compliant': 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'Under Review': 'bg-blue-100 text-blue-700',
};
function formatDate(d) {
    if (!d)
        return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
export default function Compliance() {
    const [violations, setViolations] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [tab, setTab] = useState('violations');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ establishmentId: '', description: '', complianceDeadline: '', correctiveActions: '' });
    useEffect(() => {
        Promise.all([ComplianceApi.list(), EstablishmentsApi.list()]).then(([v, e]) => {
            setViolations(v);
            setEstablishments(e);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    async function saveViolation() {
        if (!form.establishmentId || !form.description)
            return;
        const created = await ComplianceApi.create({
            establishmentId: form.establishmentId,
            description: form.description,
            complianceDeadline: form.complianceDeadline || undefined,
            correctiveActions: form.correctiveActions || undefined,
        });
        setViolations((prev) => [created, ...prev]);
        setShowForm(false);
        setForm({ establishmentId: '', description: '', complianceDeadline: '', correctiveActions: '' });
    }
    async function updateViolationStatus(id, status) {
        const updated = await ComplianceApi.update(id, { status });
        setViolations((prev) => prev.map((v) => v.id === id ? { ...v, ...updated } : v));
        if (status === 'Resolved') {
            const v = violations.find((x) => x.id === id);
            if (v && v.establishmentId) {
                const est = establishments.find((e) => e.id === v.establishmentId);
                if (est && est.complianceStatus !== 'Compliant') {
                    const updatedEst = await EstablishmentsApi.update(v.establishmentId, { complianceStatus: 'Compliant' });
                    setEstablishments((prev) => prev.map((e) => e.id === v.establishmentId ? { ...e, ...updatedEst } : e));
                }
            }
        }
    }
    async function deleteViolation(id) {
        if (confirm('Delete this violation?')) {
            await ComplianceApi.delete(id);
            setViolations((prev) => prev.filter((v) => v.id !== id));
        }
    }
    async function updateEstablishmentStatus(id, status) {
        const updated = await EstablishmentsApi.update(id, { complianceStatus: status });
        setEstablishments((prev) => prev.map((e) => e.id === id ? { ...e, ...updated } : e));
    }
    function getEstName(v) {
        const est = establishments.find((e) => e.id === v.establishmentId);
        return est?.businessName || 'Unknown';
    }
    const filteredViolations = violations.filter((r) => {
        if (filter !== 'All' && r.status !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return getEstName(r).toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
        }
        return true;
    });
    const filteredEst = establishments.filter((r) => {
        if (filter !== 'All' && r.complianceStatus !== filter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            return r.businessName.toLowerCase().includes(q) || r.ownerName.toLowerCase().includes(q);
        }
        return true;
    });
    const vCounts = { All: violations.length, Open: 0, Resolved: 0, Overdue: 0 };
    violations.forEach((v) => { if (vCounts[v.status] !== undefined)
        vCounts[v.status]++; });
    const eCounts = { All: establishments.length };
    ['Compliant', 'Non-Compliant', 'Pending', 'Under Review'].forEach((s) => { eCounts[s] = establishments.filter((e) => e.complianceStatus === s).length; });
    const highRisk = establishments.filter((e) => e.complianceStatus === 'Non-Compliant' || e.complianceStatus === 'Pending');
    if (loading)
        return _jsx("div", { className: "text-sm text-gray-500 p-4", children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Compliance" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Fire Code Compliance" }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [establishments.length, " establishments \u00B7 ", violations.length, " violations"] })] }), tab === 'violations' && (_jsxs("button", { onClick: () => setShowForm(true), className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Plus, { size: 14 }), " Record Violation"] }))] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Compliant" }), _jsx("div", { className: "text-xl font-bold text-green-600 mt-1", children: eCounts['Compliant'] }), _jsxs("div", { className: "text-xs text-gray-400 mt-0.5", children: [establishments.length ? Math.round((eCounts['Compliant'] / establishments.length) * 100) : 0, "% of total"] })] }), _jsx("div", { className: "p-2 rounded-lg bg-green-50", children: _jsx(CheckCircle, { size: 16, className: "text-green-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Non-Compliant" }), _jsx("div", { className: "text-xl font-bold text-red-600 mt-1", children: eCounts['Non-Compliant'] }), _jsx("div", { className: "text-xs text-red-500 mt-0.5", children: "Requires attention" })] }), _jsx("div", { className: "p-2 rounded-lg bg-red-50", children: _jsx(AlertTriangle, { size: 16, className: "text-red-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Open Violations" }), _jsx("div", { className: "text-xl font-bold text-orange-600 mt-1", children: vCounts['Open'] + vCounts['Overdue'] }), _jsxs("div", { className: "text-xs text-orange-500 mt-0.5", children: [vCounts['Overdue'], " overdue"] })] }), _jsx("div", { className: "p-2 rounded-lg bg-orange-50", children: _jsx(Clock, { size: 16, className: "text-orange-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "High-Risk" }), _jsx("div", { className: "text-xl font-bold text-gray-900 mt-1", children: highRisk.length }), _jsx("div", { className: "text-xs text-gray-400 mt-0.5", children: "Establishments" })] }), _jsx("div", { className: "p-2 rounded-lg bg-purple-50", children: _jsx(Shield, { size: 16, className: "text-purple-600" }) })] }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex", children: [_jsx("button", { onClick: () => { setTab('violations'); setFilter('All'); setSearch(''); }, className: `px-4 py-2.5 text-sm font-medium border-b-2 ${tab === 'violations' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: "Violations" }), _jsx("button", { onClick: () => { setTab('establishments'); setFilter('All'); setSearch(''); }, className: `px-4 py-2.5 text-sm font-medium border-b-2 ${tab === 'establishments' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: "Establishments" })] }) }), _jsxs("div", { className: "px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: tab === 'violations' ? ['All', 'Open', 'Resolved', 'Overdue'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) : ['All', 'Compliant', 'Non-Compliant', 'Pending', 'Under Review'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: f }, f))) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: tab === 'violations' ? 'Search violations...' : 'Search establishments...', value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" })] })] }), tab === 'violations' ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Establishment" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Violation" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Notice Date" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Deadline" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Corrective Actions" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filteredViolations.map((v) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: getEstName(v) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600 max-w-[200px] truncate", children: v.description }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(v.noticeDate) }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: formatDate(v.complianceDeadline) }), _jsx("td", { className: "px-4 py-2.5 text-gray-500 text-xs max-w-[200px] truncate", children: v.correctiveActions || '—' }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("select", { value: v.status, onChange: (e) => updateViolationStatus(v.id, e.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[v.status]} cursor-pointer outline-none`, children: [_jsx("option", { value: "Open", children: "Open" }), _jsx("option", { value: "Resolved", children: "Resolved" }), _jsx("option", { value: "Overdue", children: "Overdue" })] }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => deleteViolation(v.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx(X, { size: 14 }) }) })] }, v.id))) })] }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Business" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Owner" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Barangay" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Type" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: filteredEst.map((e) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2.5 font-medium text-gray-900", children: e.businessName }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: e.ownerName }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: e.barangay }), _jsx("td", { className: "px-4 py-2.5 text-gray-600", children: e.occupancyType }), _jsx("td", { className: "px-4 py-2.5", children: _jsxs("select", { value: e.complianceStatus, onChange: (e2) => updateEstablishmentStatus(e.id, e2.target.value), className: `text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${complianceStatusColors[e.complianceStatus]} cursor-pointer outline-none`, children: [_jsx("option", { value: "Compliant", children: "Compliant" }), _jsx("option", { value: "Non-Compliant", children: "Non-Compliant" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "Under Review", children: "Under Review" })] }) }), _jsx("td", { className: "px-4 py-2.5", children: _jsx("button", { onClick: () => { const v = violations.find((x) => x.establishmentId === e.id); if (v)
                                                        updateViolationStatus(v.id, 'Resolved'); }, className: "p-1 text-gray-400 hover:text-green-600", title: "Mark as resolved", children: _jsx(Check, { size: 14 }) }) })] }, e.id))) })] }) }))] }), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", onClick: () => setShowForm(false), children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-md p-6 mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-900", children: "Record Violation" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Establishment ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: form.establishmentId, onChange: (e) => setForm({ ...form, establishmentId: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [_jsx("option", { value: "", children: "Select..." }), establishments.map((e) => _jsx("option", { value: e.id, children: e.businessName }, e.id))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: ["Violation Description ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Describe the violation" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Compliance Deadline" }), _jsx("input", { type: "date", value: form.complianceDeadline, onChange: (e) => setForm({ ...form, complianceDeadline: e.target.value }), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Corrective Actions" }), _jsx("textarea", { value: form.correctiveActions, onChange: (e) => setForm({ ...form, correctiveActions: e.target.value }), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Required corrective measures" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: () => setShowForm(false), className: "px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: saveViolation, disabled: !form.establishmentId || !form.description, className: "px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5", children: [_jsx(Check, { size: 14 }), " Record"] })] })] }) })), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "High-Risk Establishments" }), _jsx("p", { className: "text-xs text-gray-500 mb-3", children: "Non-compliant or pending establishments requiring priority attention" }), highRisk.length === 0 ? (_jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "All establishments are compliant." })) : (_jsx("div", { className: "grid grid-cols-3 gap-3", children: highRisk.map((e) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-3 flex items-start gap-3", children: [_jsx("div", { className: `p-1.5 rounded-lg ${e.complianceStatus === 'Non-Compliant' ? 'bg-red-50' : 'bg-yellow-50'}`, children: _jsx(Building2, { size: 16, className: e.complianceStatus === 'Non-Compliant' ? 'text-red-500' : 'text-yellow-500' }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium text-gray-900", children: e.businessName }), _jsxs("div", { className: "text-[10px] text-gray-500", children: [e.occupancyType, " \u00B7 ", e.barangay] }), _jsx("span", { className: `inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${complianceStatusColors[e.complianceStatus]}`, children: e.complianceStatus })] })] }, e.id))) }))] })] }));
}
