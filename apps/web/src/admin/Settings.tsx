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
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }; } catch {}
  return DEFAULTS;
}

type Tab = 'general' | 'notifications' | 'security' | 'display';

export default function Settings() {
  const [settings, setSettings] = useState<any>(load);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }, [settings]);

  function update(field: string, value: any) {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'general', label: 'Station Info', icon: Building2 },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'display', label: 'Display', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">System</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure station preferences and system behavior</p>
        </div>
        <button onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Save size={14} /> {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        {activeTab === 'general' && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Station Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Station Name', field: 'stationName', type: 'text' },
                { label: 'Station Code', field: 'stationCode', type: 'text' },
                { label: 'Contact Number', field: 'stationContact', type: 'text' },
                { label: 'Email Address', field: 'stationEmail', type: 'email' },
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={settings[f.field]} onChange={(e) => update(f.field, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Station Address</label>
              <textarea value={settings.stationAddress} onChange={(e) => update('stationAddress', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'In-app Notifications', field: 'notifications', desc: 'Show notifications within the application' },
                { label: 'Email Alerts', field: 'emailAlerts', desc: 'Send email notifications for important events' },
                { label: 'SMS Alerts', field: 'smsAlerts', desc: 'Send SMS alerts for critical incidents' },
                { label: 'Auto-assign Incidents', field: 'autoAssignIncidents', desc: 'Automatically assign new incidents to available units' },
                { label: 'Require Approval for Leave', field: 'requireApprovalForLeave', desc: 'Leave requests require station commander approval' },
              ].map((t) => (
                <div key={t.field} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm text-gray-900">{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                  <button onClick={() => update(t.field, !settings[t.field])}
                    className={`w-10 h-5 rounded-full transition-colors ${settings[t.field] ? 'bg-red-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[t.field] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Security Settings</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <select value={settings.sessionTimeout} onChange={(e) => update('sessionTimeout', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                {[15, 30, 60, 120, 240].map((m) => <option key={m} value={m}>{m} minutes{m >= 60 ? ` (${m / 60}h)` : ''}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">Automatically log out inactive users after this period</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Current Password', field: 'currentPw', type: 'password' },
                  { label: 'New Password', field: 'newPw', type: 'password' },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                ))}
              </div>
              <button className="mt-3 px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">Update Password</button>
            </div>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900">Display Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Theme', field: 'theme', options: [
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System Default' },
                ]},
                { label: 'Date Format', field: 'dateFormat', options: [
                  { value: 'MMM DD, YYYY', label: 'Jul 15, 2026' },
                  { value: 'DD/MM/YYYY', label: '15/07/2026' },
                  { value: 'YYYY-MM-DD', label: '2026-07-15' },
                ]},
                { label: 'Time Format', field: 'timeFormat', options: [
                  { value: '12h', label: '12-hour (2:30 PM)' },
                  { value: '24h', label: '24-hour (14:30)' },
                ]},
                { label: 'Language', field: 'language', options: [
                  { value: 'en', label: 'English' },
                  { value: 'fil', label: 'Filipino' },
                ]},
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <select value={settings[f.field]} onChange={(e) => update(f.field, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Date: <span className="text-gray-900">Jul 15, 2026</span></div>
                <div className="text-sm text-gray-500">Time: <span className="text-gray-900">2:30 PM</span></div>
                <div className="text-sm text-gray-500">Theme: <span className="text-gray-900 capitalize">{settings.theme}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
