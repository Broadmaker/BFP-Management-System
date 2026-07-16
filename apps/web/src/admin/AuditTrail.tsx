import { useState, useEffect } from 'react';
import { Search, Clock, Filter } from 'lucide-react';
import { AuditApi, UsersApi } from '../lib/api';

const MODULES = ['Incident Management', 'Fire Safety Inspection', 'Fire Code Compliance', 'Personnel Management', 'Equipment Management', 'Fire Hydrant Management', 'Community Programs', 'Reports & Analytics', 'Document Management', 'Public Service', 'System Administration'];
const ACTIONS = ['Create', 'Update', 'Delete', 'View', 'Approve', 'Reject', 'Login', 'Logout'];

const actionColors: Record<string, string> = {
  Create: 'bg-green-100 text-green-700',
  Update: 'bg-blue-100 text-blue-700',
  Delete: 'bg-red-100 text-red-700',
  View: 'bg-gray-100 text-gray-600',
  Approve: 'bg-emerald-100 text-emerald-700',
  Reject: 'bg-orange-100 text-orange-700',
  Login: 'bg-purple-100 text-purple-700',
  Logout: 'bg-gray-100 text-gray-500',
};

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    Promise.all([AuditApi.list(), UsersApi.list()]).then(([result, users]) => {
      const userMap: Record<string, string> = {};
      users.forEach((u: any) => { userMap[u.id] = u.name; });
      setLogs((result.items || []).map((l: any) => ({ ...l, user: userMap[l.userId] || l.userId || 'Unknown' })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) => {
    if (filterModule !== 'All' && l.module !== filterModule) return false;
    if (filterAction !== 'All' && l.action !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.user.toLowerCase().includes(q) || (l.details || '').toLowerCase().includes(q) || l.module.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">System</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Audit Trail</h1>
          <p className="text-xs text-gray-400 mt-0.5">{logs.length} logged events</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Search logs..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="All">All Modules</option>
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="All">All Actions</option>
            {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Action</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Module</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Details</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400" />
                      {l.createdAt ? new Date(l.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-semibold">
                        {l.user.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="text-sm text-gray-900">{l.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${actionColors[l.action] || 'bg-gray-100 text-gray-600'}`}>{l.action}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{l.module}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{l.details}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{l.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center text-sm text-gray-400 py-8">No audit logs found.</div>}
      </div>
    </div>
  );
}
