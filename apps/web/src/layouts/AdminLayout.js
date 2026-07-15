import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
export default function AdminLayout() {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "ml-64", children: [_jsxs("header", { className: "h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx("span", { children: "BFP Ipil Station" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-gray-900 font-medium", children: "Incidents" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { className: "text-sm text-gray-600 hover:text-gray-900", children: "Docs" }), _jsx("button", { className: "text-sm text-gray-600 hover:text-gray-900", children: "Notifications" }), _jsx("div", { className: "w-7 h-7 rounded-full bg-gray-200" })] })] }), _jsx("main", { className: "p-6", children: _jsx(Outlet, {}) })] })] }));
}
