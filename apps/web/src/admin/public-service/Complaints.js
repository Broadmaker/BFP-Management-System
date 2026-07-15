import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText } from 'lucide-react';
export default function Complaints() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Public Service" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Complaints & Feedback" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Citizen-submitted complaints and suggestions" })] }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-12 text-center", children: [_jsx(FileText, { size: 40, className: "mx-auto text-gray-300 mb-3" }), _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "No complaints submitted yet" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "This section will populate once citizens submit feedback through the public portal." })] })] }));
}
