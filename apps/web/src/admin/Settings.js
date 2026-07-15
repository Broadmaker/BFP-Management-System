import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';
const STORAGE_KEY = 'bfp-settings';
const DEFAULTS = {
    stationName: 'BFP Ipil Fire Station',
    stationAddress: 'National Highway, Poblacion, Ipil, Zamboanga Sibugay',
    stationContact: '(062) 333-1234',
    stationEmail: 'ipil.bfp@zamboangasibugay.gov.ph',
    stationCode: 'ZFRS-IPL-001',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    autoAssignIncidents: true,
    requireApprovalForLeave: true,
    sessionTimeout: 30,
    theme: 'light',
    dateFormat: 'MMM DD, YYYY',
    timeFormat: '12h',
    language: 'en',
};
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return { ...DEFAULTS, ...JSON.parse(raw) };
    }
    catch { }
    return DEFAULTS;
}
export default function Settings() {
    const [settings, setSettings] = useState(load);
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }, [settings]);
    function update(field, value) {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    }
    function handleSave() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }
    const tabs = [
        { key: 'general', label: 'Station Info', icon: Building2 },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'security', label: 'Security', icon: Shield },
        { key: 'display', label: 'Display', icon: Palette },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500 font-medium", children: "System" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 mt-0.5", children: "Settings" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Configure station preferences and system behavior" })] }), _jsxs("button", { onClick: handleSave, className: "px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5", children: [_jsx(Save, { size: 14 }), " ", saved ? 'Saved' : 'Save Changes'] })] }), _jsx("div", { className: "flex gap-4 border-b border-gray-200", children: tabs.map((t) => {
                    const Icon = t.icon;
                    return (_jsxs("button", { onClick: () => setActiveTab(t.key), className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [_jsx(Icon, { size: 16 }), " ", t.label] }, t.key));
                }) }), _jsxs("div", { className: "bg-white border border-gray-200 rounded-lg", children: [activeTab === 'general' && (_jsxs("div", { className: "p-6 space-y-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Station Information" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                                    { label: 'Station Name', field: 'stationName', type: 'text' },
                                    { label: 'Station Code', field: 'stationCode', type: 'text' },
                                    { label: 'Contact Number', field: 'stationContact', type: 'text' },
                                    { label: 'Email Address', field: 'stationEmail', type: 'email' },
                                ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: f.label }), _jsx("input", { type: f.type, value: settings[f.field], onChange: (e) => update(f.field, e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }, f.field))) }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Station Address" }), _jsx("textarea", { value: settings.stationAddress, onChange: (e) => update('stationAddress', e.target.value), rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] })] })), activeTab === 'notifications' && (_jsxs("div", { className: "p-6 space-y-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Notification Preferences" }), _jsx("div", { className: "space-y-3", children: [
                                    { label: 'In-app Notifications', field: 'notifications', desc: 'Show notifications within the application' },
                                    { label: 'Email Alerts', field: 'emailAlerts', desc: 'Send email notifications for important events' },
                                    { label: 'SMS Alerts', field: 'smsAlerts', desc: 'Send SMS alerts for critical incidents' },
                                    { label: 'Auto-assign Incidents', field: 'autoAssignIncidents', desc: 'Automatically assign new incidents to available units' },
                                    { label: 'Require Approval for Leave', field: 'requireApprovalForLeave', desc: 'Leave requests require station commander approval' },
                                ].map((t) => (_jsxs("div", { className: "flex items-center justify-between py-2", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-900", children: t.label }), _jsx("div", { className: "text-xs text-gray-500", children: t.desc })] }), _jsx("button", { onClick: () => update(t.field, !settings[t.field]), className: `w-10 h-5 rounded-full transition-colors ${settings[t.field] ? 'bg-red-600' : 'bg-gray-200'}`, children: _jsx("div", { className: `w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[t.field] ? 'translate-x-5' : 'translate-x-0.5'}` }) })] }, t.field))) })] })), activeTab === 'security' && (_jsxs("div", { className: "p-6 space-y-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Security Settings" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Session Timeout (minutes)" }), _jsx("select", { value: settings.sessionTimeout, onChange: (e) => update('sessionTimeout', Number(e.target.value)), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: [15, 30, 60, 120, 240].map((m) => _jsxs("option", { value: m, children: [m, " minutes", m >= 60 ? ` (${m / 60}h)` : ''] }, m)) }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Automatically log out inactive users after this period" })] }), _jsxs("div", { className: "border-t border-gray-100 pt-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: "Change Password" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                                            { label: 'Current Password', field: 'currentPw', type: 'password' },
                                            { label: 'New Password', field: 'newPw', type: 'password' },
                                        ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: f.label }), _jsx("input", { type: f.type, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" })] }, f.field))) }), _jsx("button", { className: "mt-3 px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800", children: "Update Password" })] })] })), activeTab === 'display' && (_jsxs("div", { className: "p-6 space-y-5", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Display Preferences" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                                    { label: 'Theme', field: 'theme', options: [
                                            { value: 'light', label: 'Light' },
                                            { value: 'dark', label: 'Dark' },
                                            { value: 'system', label: 'System Default' },
                                        ] },
                                    { label: 'Date Format', field: 'dateFormat', options: [
                                            { value: 'MMM DD, YYYY', label: 'Jul 15, 2026' },
                                            { value: 'DD/MM/YYYY', label: '15/07/2026' },
                                            { value: 'YYYY-MM-DD', label: '2026-07-15' },
                                        ] },
                                    { label: 'Time Format', field: 'timeFormat', options: [
                                            { value: '12h', label: '12-hour (2:30 PM)' },
                                            { value: '24h', label: '24-hour (14:30)' },
                                        ] },
                                    { label: 'Language', field: 'language', options: [
                                            { value: 'en', label: 'English' },
                                            { value: 'fil', label: 'Filipino' },
                                        ] },
                                ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: f.label }), _jsx("select", { value: settings[f.field], onChange: (e) => update(f.field, e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: f.options.map((o) => _jsx("option", { value: o.value, children: o.label }, o.value)) })] }, f.field))) }), _jsxs("div", { className: "border-t border-gray-100 pt-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: "Preview" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Date: ", _jsx("span", { className: "text-gray-900", children: "Jul 15, 2026" })] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Time: ", _jsx("span", { className: "text-gray-900", children: "2:30 PM" })] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Theme: ", _jsx("span", { className: "text-gray-900 capitalize", children: settings.theme })] })] })] })] }))] })] }));
}
