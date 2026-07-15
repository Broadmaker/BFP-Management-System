import { Link, useSearchParams } from 'react-router-dom';
import { Plus, BarChart3, Search, AlertTriangle, Clock, Users, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Active Incidents', value: '12', change: '+2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Avg Response', value: '4.2min', change: '-0.3', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Personnel Deployed', value: '48', change: '+6', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Resolved This Month', value: '87', change: '+12%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
];

const incidents = [
  { id: 'BFP-4001', type: 'Structural Fire', severity: 'Critical', location: 'National Highway, Ipil Heights', date: 'Jul 13, 2026', status: 'Active' as const },
  { id: 'BFP-4002', type: 'Medical Emergency', severity: 'Major', location: 'Quezon Blvd, Sanito', date: 'Jul 12, 2026', status: 'Resolved' as const },
  { id: 'BFP-4003', type: 'Vehicle Fire', severity: 'Moderate', location: 'Gov. Cerilles St, Poblacion', date: 'Jul 11, 2026', status: 'Dispatched' as const },
  { id: 'BFP-4004', type: 'False Alarm', severity: 'Minor', location: 'Serenity Dr, Bangkerohan', date: 'Jul 10, 2026', status: 'Closed' as const },
  { id: 'BFP-4005', type: 'Gas Leak', severity: 'Major', location: 'Cueto St, Upper Ipil', date: 'Jul 10, 2026', status: 'On Scene' as const },
];

const statusColors: Record<string, string> = {
  Active: 'bg-red-100 text-red-700',
  Dispatched: 'bg-yellow-100 text-yellow-700',
  'On Scene': 'bg-purple-100 text-purple-700',
  Resolved: 'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700'
};

const severityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  Major: 'bg-yellow-100 text-yellow-700',
  Moderate: 'bg-blue-100 text-blue-700',
  Minor: 'bg-green-100 text-green-700'
};

export default function IncidentList() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Incident Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">All Incidents</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="analytics" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <BarChart3 size={14} /> Analytics
          </Link>
          <Link to="new" className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
            <Plus size={14} /> Report Incident
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-xl font-semibold text-gray-900 mt-1">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.change} from last month</div>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Incident Records</div>
            <div className="text-xs text-gray-500 mt-0.5">Complete incident database</div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              defaultValue={query}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Incident #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{inc.id}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{inc.type}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${severityColors[inc.severity]}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{inc.location}</td>
                  <td className="px-4 py-2.5 text-gray-600">{inc.date}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[inc.status]}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Link to={inc.id} className="text-xs text-red-600 hover:text-red-700 font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
