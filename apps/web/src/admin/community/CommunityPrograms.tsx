import { useState, useEffect } from 'react';
import { Search, Plus, Users, Calendar, MapPin, Clock, Award } from 'lucide-react';
import { ProgramsApi, ParticipantsApi } from '../../lib/api';

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Full: 'bg-red-100 text-red-700',
  Ongoing: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-yellow-100 text-yellow-700',
};

const typeColors: Record<string, string> = {
  Seminar: 'bg-indigo-100 text-indigo-700',
  'Fire Drill': 'bg-orange-100 text-orange-700',
  Outreach: 'bg-teal-100 text-teal-700',
  Campaign: 'bg-pink-100 text-pink-700',
};

export default function CommunityPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([ProgramsApi.list(), ParticipantsApi.list()]).then(([progs, parts]) => {
      setPrograms(progs);
      const counts: Record<string, number> = {};
      parts.forEach((p: any) => { counts[p.programId] = (counts[p.programId] || 0) + 1; });
      setParticipantCounts(counts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? programs : programs.filter((p) => p.status === filter);

  const activeSeminars = programs.filter((p) => p.type === 'Seminar' && p.status === 'Scheduled').length;
  const totalParticipants = Object.values(participantCounts).reduce((a, b) => a + b, 0);
  const upcomingDrills = programs.filter((p) => p.type === 'Fire Drill' && p.status === 'Scheduled').length;
  const thisMonth = programs.filter((p) => {
    if (!p.scheduledDate) return false;
    const d = new Date(p.scheduledDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: 'Active Seminars', value: String(activeSeminars), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Participants', value: String(totalParticipants), icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Upcoming Drills', value: String(upcomingDrills), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'This Month', value: String(thisMonth), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Community Programs</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Seminars & Drills</h1>
        </div>
        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Program
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-xl font-semibold text-gray-900 mt-1">{s.value}</div>
              </div>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon size={16} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', 'Scheduled', 'Full', 'Completed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search programs..." className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Program</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Participants</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[p.type] || 'bg-gray-100 text-gray-600'}`}>{p.type}</span>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                <td className="px-4 py-2.5 text-gray-600 max-w-[200px] truncate" title={p.location}>
                  <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{p.location}</div>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{participantCounts[p.id] || 0}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-2.5">
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
