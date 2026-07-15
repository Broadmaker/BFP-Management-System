import { Plus, MapPin, Users, Building, School } from 'lucide-react';

const outreaches = [
  { id: 'OUT-001', type: 'Barangay Visit', title: 'Bangkerohan Barangay Outreach', barangay: 'Bangkerohan', date: 'Jul 28, 2026', households: 52, attendees: 134, status: 'Completed' as const },
  { id: 'OUT-002', type: 'School Visit', title: 'Fire Safety Lecture — Ipil Central School', barangay: 'Poblacion', date: 'Jul 15, 2026', households: null, attendees: 340, status: 'Completed' as const },
  { id: 'OUT-003', type: 'Business Seminar', title: 'Commercial Estab. Fire Compliance', barangay: 'Ipil Heights', date: 'Aug 5, 2026', households: null, attendees: 28, status: 'Scheduled' as const },
  { id: 'OUT-004', type: 'Barangay Visit', title: 'Don Basilio Home Safety Check', barangay: 'Don Basilio', date: 'Aug 28, 2026', households: 40, attendees: 0, status: 'Scheduled' as const },
  { id: 'OUT-005', type: 'School Visit', title: 'Earthquake Drill — Don Basilio School', barangay: 'Don Basilio', date: 'Aug 20, 2026', households: null, attendees: 0, status: 'Scheduled' as const },
  { id: 'OUT-006', type: 'Campaign', title: 'Fire Prevention Month Caravan', barangay: 'Poblacion', date: 'Mar 15, 2026', households: 200, attendees: 500, status: 'Completed' as const },
];

const typeIcons: Record<string, any> = {
  'Barangay Visit': Building,
  'School Visit': School,
  'Business Seminar': Users,
  'Campaign': MapPin,
};

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Ongoing: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
};

export default function Outreach() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Community Programs</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Outreach Programs</h1>
        </div>
        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Schedule Outreach
        </button>
      </div>

      <div className="grid gap-4">
        {outreaches.map((o) => {
          const Icon = typeIcons[o.type];
          return (
            <div key={o.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600`}>{o.type}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1">{o.title}</h3>
                  </div>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {o.barangay}</span>
                  <span>{o.date}</span>
                  {o.households !== null && <span>{o.households} households</span>}
                  {o.attendees > 0 && <span>{o.attendees} attendees</span>}
                </div>
              </div>
              <button className="text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap">View Details</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
