import { useState } from 'react';
import { Search, Plus, CheckCircle, XCircle } from 'lucide-react';

const volunteers = [
  { id: 'VOL-001', name: 'Rolando Mercado', barangay: 'Poblacion', contact: '0912-345-6789', skills: 'First Aid, Fire Safety', trained: true, active: true, registered: 'Jan 15, 2026' },
  { id: 'VOL-002', name: 'Susan Villanueva', barangay: 'Ipil Heights', contact: '0923-456-7890', skills: 'Community Organizing', trained: true, active: true, registered: 'Feb 3, 2026' },
  { id: 'VOL-003', name: 'Danny Fernandez', barangay: 'Don Basilio', contact: '0934-567-8901', skills: 'Driving, Logistics', trained: false, active: true, registered: 'Mar 20, 2026' },
  { id: 'VOL-004', name: 'Lorna Salvador', barangay: 'Bangkerohan', contact: '0945-678-9012', skills: 'First Aid, Nursing', trained: true, active: true, registered: 'Apr 5, 2026' },
  { id: 'VOL-005', name: 'Benito Reyes', barangay: 'Upper Ipil', contact: '0956-789-0123', skills: 'Carpentry, Rescue', trained: true, active: false, registered: 'Jan 28, 2026' },
  { id: 'VOL-006', name: 'Charisse Go', barangay: 'Sanito', contact: '0967-890-1234', skills: 'Teaching, Child Care', trained: false, active: true, registered: 'May 12, 2026' },
  { id: 'VOL-007', name: 'Mark Anthony Cruz', barangay: 'Makilas', contact: '0978-901-2345', skills: 'Communications, Radio', trained: true, active: true, registered: 'Jun 1, 2026' },
  { id: 'VOL-008', name: 'Gloria Torres', barangay: 'Poblacion', contact: '0989-012-3456', skills: 'Cooking, Logistics', trained: false, active: true, registered: 'Jul 10, 2026' },
];

export default function Volunteers() {
  const [query, setQuery] = useState('');

  const filtered = volunteers.filter(
    (v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.barangay.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Community Programs</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Volunteers</h1>
          <p className="text-xs text-gray-400 mt-0.5">{volunteers.filter((v) => v.active).length} active volunteers</p>
        </div>
        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Register Volunteer
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or barangay..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Barangay</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Skills</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Training</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 font-medium text-gray-900">{v.name}</td>
                <td className="px-4 py-2.5 text-gray-600">{v.barangay}</td>
                <td className="px-4 py-2.5 text-gray-600">{v.contact}</td>
                <td className="px-4 py-2.5 text-gray-600 max-w-[160px] truncate">{v.skills}</td>
                <td className="px-4 py-2.5">
                  {v.trained ? (
                    <span className="flex items-center gap-1 text-green-700"><CheckCircle size={12} /> Complete</span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-700"><XCircle size={12} /> Pending</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${v.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {v.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
