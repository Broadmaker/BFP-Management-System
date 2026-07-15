import { useState } from 'react';
import { Search, Plus, Users, Calendar, MapPin, Clock, Award } from 'lucide-react';

const stats = [
  { label: 'Active Seminars', value: '6', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Participants', value: '184', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Upcoming Drills', value: '3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'This Month', value: '8', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const programs = [
  { id: 'PRG-001', title: 'Fire Prevention Seminar', type: 'Seminar', date: 'Aug 15, 2026', location: 'Poblacion Barangay Hall', barangay: 'Poblacion', participants: 28, slots: 45, status: 'Scheduled' as const },
  { id: 'PRG-002', title: 'Earthquake & Fire Drill', type: 'Fire Drill', date: 'Aug 20, 2026', location: 'Don Basilio School Inc.', barangay: 'Don Basilio', participants: 0, slots: 200, status: 'Scheduled' as const },
  { id: 'PRG-003', title: 'Home Fire Safety Workshop', type: 'Seminar', date: 'Sep 5, 2026', location: 'Ipil Heights Covered Court', barangay: 'Ipil Heights', participants: 15, slots: 50, status: 'Scheduled' as const },
  { id: 'PRG-004', title: 'BLS Training', type: 'Seminar', date: 'Sep 12, 2026', location: 'BFP Ipil Station Training Room', barangay: 'Poblacion', participants: 30, slots: 30, status: 'Full' as const },
  { id: 'PRG-005', title: 'Barangay Bangkerohan Outreach', type: 'Outreach', date: 'Jul 28, 2026', location: 'Bangkerohan Barangay Hall', barangay: 'Bangkerohan', participants: 52, slots: 100, status: 'Completed' as const },
  { id: 'PRG-006', title: 'School Fire Safety Campaign', type: 'Campaign', date: 'Jul 15, 2026', location: 'Ipil Central School', barangay: 'Poblacion', participants: 340, slots: 500, status: 'Completed' as const },
  { id: 'PRG-007', title: 'Makilas Barangay Fire Drill', type: 'Fire Drill', date: 'Oct 10, 2026', location: 'Makilas Barangay Plaza', barangay: 'Makilas', participants: 0, slots: 150, status: 'Scheduled' as const },
  { id: 'PRG-008', title: 'Upper Ipil Fire Safety Forum', type: 'Seminar', date: 'Oct 22, 2026', location: 'Upper Ipil Barangay Hall', barangay: 'Upper Ipil', participants: 0, slots: 40, status: 'Scheduled' as const },
];

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  'Full': 'bg-red-100 text-red-700',
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
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? programs : programs.filter((p) => p.status === filter);

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
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
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
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[p.type]}`}>{p.type}</span>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{p.date}</td>
                <td className="px-4 py-2.5 text-gray-600 max-w-[200px] truncate" title={p.location}>
                  <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{p.location}</div>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{p.participants}/{p.slots}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[p.status]}`}>{p.status}</span>
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
