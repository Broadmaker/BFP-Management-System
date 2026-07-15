import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Users, Plus, ArrowRight, Globe, Megaphone, BarChart3, FileText, Calendar } from 'lucide-react';

function loadJSON(key: string, fallback: any[] = []) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {}
  return fallback;
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function Dashboard() {
  const [serviceRequests] = useState(() => loadJSON('bfp-service-requests'));
  const [appointments] = useState(() => loadJSON('bfp-appointments'));
  const [hazardReports] = useState(() => loadJSON('bfp-hazard-reports'));
  const [seminarRegs] = useState(() => loadJSON('bfp-seminar-registrations'));

  const pendingRequests = serviceRequests.filter((r: any) => r.status === 'Pending').length;
  const newHazards = hazardReports.filter((h: any) => h.status === 'New').length;
  const todayAppts = appointments.filter((a: any) => a.date === todayStr()).length;
  const totalRegs = seminarRegs.length;

  const stats = [
    { label: 'Pending Service Requests', value: String(pendingRequests), icon: FileText, color: 'text-red-600', bg: 'bg-red-50', to: '/admin/public-service' },
    { label: 'Appointments Today', value: String(todayAppts), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', to: '/admin/public-service/appointments' },
    { label: 'New Hazard Reports', value: String(newHazards), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', to: '/admin/public-service/hazards' },
    { label: 'Seminar Registrations', value: String(totalRegs), icon: Users, color: 'text-green-600', bg: 'bg-green-50', to: '/admin/public-service/seminars' },
  ];

  const recentHazards = hazardReports.slice(0, 3);
  const upcomingAppts = appointments.filter((a: any) => a.status === 'Confirmed' || a.status === 'Pending').slice(0, 4);

  const hazardStatusColors: Record<string, string> = {
    New: 'bg-red-100 text-red-700', 'Under Investigation': 'bg-yellow-100 text-yellow-700',
    Resolved: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">BFP Ipil Station</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Zamboanga Sibugay — {todayStr()}</p>
        </div>
        <Link to="/admin/incidents/new" className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Report Incident
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              </div>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon size={18} className={s.color} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Upcoming Appointments</div>
                <div className="text-xs text-gray-500 mt-0.5">Pending and confirmed inspection schedules</div>
              </div>
              <Link to="/admin/public-service/appointments" className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppts.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No appointments scheduled yet.</td></tr>
                )}
                {upcomingAppts.map((a: any) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-900">{a.name}</div>
                      <div className="text-xs text-gray-400">{a.business !== '—' ? a.business : ''}</div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{a.type}</td>
                    <td className="px-4 py-2.5 text-gray-600">{a.date}</td>
                    <td className="px-4 py-2.5 text-gray-600">{a.time}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                        a.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Record Incident', icon: Plus, to: '/admin/incidents/new', color: 'bg-red-600 hover:bg-red-700' },
                { label: 'Service Requests', icon: Globe, to: '/admin/public-service', color: 'bg-green-600 hover:bg-green-700' },
                { label: 'Book Appointment', icon: Calendar, to: '/admin/public-service/appointments', color: 'bg-blue-600 hover:bg-blue-700' },
                { label: 'Log Hazard', icon: AlertTriangle, to: '/admin/public-service/hazards', color: 'bg-orange-600 hover:bg-orange-700' },
                { label: 'Schedule Seminar', icon: Megaphone, to: '/admin/community', color: 'bg-purple-600 hover:bg-purple-700' },
                { label: 'Generate Report', icon: BarChart3, to: '/admin/reports', color: 'bg-teal-600 hover:bg-teal-700' },
              ].map((a) => (
                <Link key={a.label} to={a.to} className={`${a.color} text-white text-xs font-medium rounded-lg px-3 py-2.5 flex items-center gap-2 transition-colors`}>
                  <a.icon size={14} /> {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Recent Hazard Reports</h3>
              <Link to="/admin/public-service/hazards" className="text-xs text-red-600 hover:text-red-700 font-medium">View All</Link>
            </div>
            <div className="space-y-3">
              {recentHazards.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No hazard reports yet.</p>
              )}
              {recentHazards.map((h: any) => (
                <div key={h.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    h.priority === 'Critical' ? 'bg-red-50 text-red-600' : h.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    <AlertTriangle size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-900 truncate">{h.type}</div>
                    <div className="text-[11px] text-gray-500 truncate">{h.location}</div>
                    <span className={`text-[10px] font-medium px-1 py-0.5 rounded-full ${hazardStatusColors[h.status] || 'bg-gray-100 text-gray-600'}`}>
                      {h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Public Service Summary</h3>
            </div>
            <div className="space-y-3">
              <Link to="/admin/public-service" className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-600">Service Requests</span>
                <span className="text-xs font-semibold text-gray-900">{serviceRequests.length}</span>
              </Link>
              <Link to="/admin/public-service/appointments" className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-600">Appointments</span>
                <span className="text-xs font-semibold text-gray-900">{appointments.length}</span>
              </Link>
              <Link to="/admin/public-service/hazards" className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-600">Hazard Reports</span>
                <span className="text-xs font-semibold text-gray-900">{hazardReports.length}</span>
              </Link>
              <Link to="/admin/public-service/seminars" className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-600">Registrations</span>
                <span className="text-xs font-semibold text-gray-900">{seminarRegs.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
