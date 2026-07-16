import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (email === import.meta.env.VITE_ADMIN_EMAIL &&
            password === import.meta.env.VITE_ADMIN_PASSWORD) {
            navigate('/admin/dashboard');
        }
        else {
            setError('Invalid email or password.');
        }
    }
    function fillAdmin() {
        setEmail(import.meta.env.VITE_ADMIN_EMAIL || '');
        setPassword(import.meta.env.VITE_ADMIN_PASSWORD || '');
    }
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm", children: [_jsxs("div", { className: "px-6 py-5 border-b border-gray-100 text-center", children: [_jsx("h1", { className: "text-lg font-bold text-gray-900", children: "Sign In" }), _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Access the BFP Ipil Station Management System" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "you@bfp.gov.ph", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "rounded border-gray-300 text-red-600 focus:ring-red-500" }), _jsx("span", { className: "text-gray-600", children: "Remember me" })] }), _jsx(Link, { to: "/auth/forgot", className: "text-red-700 hover:text-red-800 font-medium text-sm", children: "Forgot password?" })] }), _jsx("button", { type: "submit", className: "w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors", children: "Sign In" })] }), _jsxs("div", { className: "px-6 pb-2 text-center text-sm text-gray-500", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "text-red-700 hover:text-red-800 font-medium", children: "Register here" })] }), import.meta.env.VITE_ADMIN_EMAIL && (_jsx("div", { className: "border-t border-gray-100", children: _jsx("div", { className: "px-6 py-4", children: _jsxs("button", { type: "button", onClick: fillAdmin, className: "w-full flex items-center justify-center gap-2 px-3 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all", children: [_jsx(Shield, { size: 16, className: "text-red-600" }), "Sign in as Administrator"] }) }) })), _jsx("div", { className: "px-6 pb-5 text-center", children: _jsxs(Link, { to: "/public", className: "text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1", children: [_jsx(ArrowLeft, { size: 11 }), " Back to public portal"] }) })] }));
}
