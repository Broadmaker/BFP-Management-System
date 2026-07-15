import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
const demoAccounts = [
    { label: 'Station Commander', email: 'commander@bfp.gov.ph', role: 'Station Commander', icon: Shield },
    { label: 'Fire Officer', email: 'fire.officer@bfp.gov.ph', role: 'Fire Officer', icon: User },
];
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selected, setSelected] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        if (email && password)
            navigate('/admin/dashboard');
    }
    function selectDemo(demo) {
        setEmail(demo.email);
        setPassword('demo1234');
        setSelected(demo.label);
    }
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm", children: [_jsxs("div", { className: "px-6 py-5 border-b border-gray-100 text-center", children: [_jsx("h1", { className: "text-lg font-bold text-gray-900", children: "Sign In" }), _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Access the BFP Ipil Station Management System" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "you@bfp.gov.ph", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "rounded border-gray-300 text-red-600 focus:ring-red-500" }), _jsx("span", { className: "text-gray-600", children: "Remember me" })] }), _jsx(Link, { to: "/auth/forgot", className: "text-red-700 hover:text-red-800 font-medium text-sm", children: "Forgot password?" })] }), _jsx("button", { type: "submit", className: "w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors", children: "Sign In" })] }), _jsxs("div", { className: "px-6 pb-2 text-center text-sm text-gray-500", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "text-red-700 hover:text-red-800 font-medium", children: "Register here" })] }), _jsx("div", { className: "border-t border-gray-100", children: _jsxs("div", { className: "px-6 py-4", children: [_jsxs("p", { className: "text-xs text-gray-400 text-center mb-3", children: [_jsx("span", { className: "font-medium text-gray-500", children: "Demo Access" }), " \u2014 Click a role then Sign In"] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: demoAccounts.map((demo) => {
                                const active = selected === demo.label;
                                return (_jsxs("button", { type: "button", onClick: () => selectDemo(demo), className: `flex items-center gap-2.5 px-3 py-3 border rounded-lg text-left transition-all ${active
                                        ? 'border-red-600 bg-red-50 ring-1 ring-red-600'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`, children: _jsx(demo.icon, { size: 16 }) }), _jsxs("div", { children: [_jsx("div", { className: `text-xs font-medium ${active ? 'text-red-700' : 'text-gray-900'}`, children: demo.label }), _jsx("div", { className: "text-[10px] text-gray-400", children: demo.role })] })] }, demo.label));
                            }) })] }) }), _jsx("div", { className: "px-6 pb-5 text-center", children: _jsxs(Link, { to: "/public", className: "text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1", children: [_jsx(ArrowLeft, { size: 11 }), " Back to public portal"] }) })] }));
}
