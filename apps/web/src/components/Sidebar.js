import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import { AlertTriangle, Users, Droplets, Megaphone, BarChart3, FileText, Shield, LayoutDashboard, Globe, Home, Settings, ChevronDown, ClipboardCheck, Wrench, BookOpen } from 'lucide-react';
import { useState, useMemo } from 'react';
const navGroups = [
    {
        label: 'BFP Ipil Station',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
            {
                label: 'Public Service', icon: Globe,
                children: [
                    { label: 'Service Requests', to: '/admin/public-service' },
                    { label: 'Inspection Appointments', to: '/admin/public-service/appointments' },
                    { label: 'Seminar Registration', to: '/admin/public-service/seminars' },
                    { label: 'Hazard Reports', to: '/admin/public-service/hazards' },
                ]
            },
            {
                label: 'Fire Safety Inspection', icon: ClipboardCheck,
                children: [
                    { label: 'Establishments', to: '/admin/inspections' },
                    { label: 'Schedule', to: '/admin/inspections/schedule' },
                    { label: 'Certificates', to: '/admin/inspections/certificates' },
                    { label: 'Inspection Reports', to: '/admin/inspections/reports' },
                ]
            },
            {
                label: 'Incident Management', icon: AlertTriangle, badge: '3',
                children: [
                    { label: 'All Incidents', to: '/admin/incidents' },
                    { label: 'Record Incident', to: '/admin/incidents/new' },
                    { label: 'Analytics', to: '/admin/incidents/analytics' },
                ]
            },
            { label: 'Fire Code Compliance', icon: Shield, to: '/admin/compliance' },
            {
                label: 'Personnel & Shifts', icon: Users,
                children: [
                    { label: 'Personnel Records', to: '/admin/personnel' },
                    { label: 'Duty Roster', to: '/admin/personnel/roster' },
                    { label: 'Attendance', to: '/admin/personnel/attendance' },
                    { label: 'Leave Management', to: '/admin/personnel/leave' },
                    { label: 'Training', to: '/admin/personnel/training' },
                ]
            },
            {
                label: 'Equipment & Vehicles', icon: Wrench,
                children: [
                    { label: 'Equipment', to: '/admin/equipment' },
                    { label: 'Vehicles', to: '/admin/vehicles' },
                    { label: 'Maintenance', to: '/admin/maintenance' },
                    { label: 'Fuel Monitoring', to: '/admin/fuel' },
                ]
            },
            {
                label: 'Fire Hydrants', icon: Droplets,
                children: [
                    { label: 'Hydrant Registry', to: '/admin/hydrants' },
                    { label: 'GIS Map', to: '/admin/hydrants/map' },
                    { label: 'Inspections', to: '/admin/hydrants/inspections' },
                ]
            },
            {
                label: 'Community Programs', icon: Megaphone,
                children: [
                    { label: 'Seminars & Drills', to: '/admin/community' },
                    { label: 'Outreach Programs', to: '/admin/community/outreach' },
                    { label: 'Volunteers', to: '/admin/community/volunteers' },
                    { label: 'Event Calendar', to: '/admin/community/calendar' },
                ]
            },
            {
                label: 'Reports & Analytics', icon: BarChart3,
                children: [
                    { label: 'Dashboards', to: '/admin/reports' },
                    { label: 'Incident Reports', to: '/admin/reports/incidents' },
                    { label: 'Inspection Reports', to: '/admin/reports/inspections' },
                    { label: 'Personnel Reports', to: '/admin/reports/personnel' },
                ]
            },
            {
                label: 'Document Management', icon: FileText,
                children: [
                    { label: 'Document Repository', to: '/admin/documents' },
                    { label: 'Incoming', to: '/admin/documents/incoming' },
                    { label: 'Outgoing', to: '/admin/documents/outgoing' },
                    { label: 'Memoranda', to: '/admin/documents/memoranda' },
                ]
            },
        ]
    },
    {
        label: 'System',
        items: [
            { label: 'User Management', icon: Users, to: '/admin/users' },
            { label: 'Audit Trail', icon: BookOpen, to: '/admin/audit' },
            { label: 'Settings', icon: Settings, to: '/admin/settings' },
        ]
    },
    {
        label: 'Public Portal',
        items: [
            { label: 'View Public Site', icon: Home, to: '/public' },
        ]
    }
];
export default function Sidebar() {
    const { pathname } = useLocation();
    const childPaths = useMemo(() => {
        const map = {};
        navGroups.forEach((g) => g.items.forEach((item) => {
            if (item.children)
                map[item.label] = item.children.map((c) => c.to);
        }));
        return map;
    }, []);
    const activeParent = useMemo(() => {
        for (const [label, paths] of Object.entries(childPaths)) {
            if (paths.some((p) => pathname.startsWith(p)))
                return label;
        }
        return null;
    }, [pathname, childPaths]);
    const [openTrees, setOpenTrees] = useState({
        'Incident Management': true
    });
    const toggle = (label) => setOpenTrees((prev) => ({ ...prev, [label]: !prev[label] }));
    const isParentActive = (label) => activeParent === label;
    // Auto-open parent when a child is active
    const open = (label) => openTrees[label] ?? isParentActive(label);
    return (_jsxs("aside", { className: "w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-30", children: [_jsxs("div", { className: "h-14 flex items-center gap-2 px-4 border-b border-gray-200", children: [_jsx("img", { src: "/bfp-logo.png", alt: "BFP", className: "w-8 h-8 rounded-lg object-cover" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold text-gray-900", children: "BFP Ipil Station" }), _jsx("div", { className: "text-[10px] text-gray-500", children: "Management System" })] })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-2 px-2 space-y-1", children: navGroups.map((group) => (_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-2", children: group.label }), group.items.map((item) => item.children ? (_jsxs("div", { children: [_jsxs("button", { onClick: () => toggle(item.label), className: `w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md ${isParentActive(item.label) ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(item.icon, { size: 16 }), _jsx("span", { className: "flex-1 text-left", children: item.label }), item.badge && (_jsx("span", { className: "text-[10px] font-medium bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full", children: item.badge })), _jsx(ChevronDown, { size: 14, className: `transition-transform ${open(item.label) ? 'rotate-0' : '-rotate-90'}` })] }), open(item.label) && (_jsx("div", { className: "ml-6 space-y-0.5", children: item.children.map((child) => (_jsx(NavLink, { to: child.to, end: true, className: ({ isActive }) => `block px-2 py-1 text-sm rounded-md ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`, children: child.label }, child.to))) }))] }, item.label)) : (_jsxs(NavLink, { to: item.to, className: ({ isActive }) => `flex items-center gap-2 px-2 py-1.5 text-sm rounded-md ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(item.icon, { size: 16 }), item.label] }, item.to)))] }, group.label))) }), _jsx("div", { className: "border-t border-gray-200 p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600", children: "AD" }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium text-gray-900", children: "Admin User" }), _jsx("div", { className: "text-[10px] text-gray-500", children: "Fire Officer" })] })] }) })] }));
}
