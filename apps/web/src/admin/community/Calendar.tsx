import { Calendar as CalendarIcon, MapPin, Clock, Users } from 'lucide-react';

const months = [
  {
    month: 'August 2026',
    events: [
      { date: 'Aug 5', title: 'Commercial Estab. Fire Compliance Seminar', time: '9:00 AM - 12:00 PM', location: 'Ipil Heights Barangay Hall', type: 'Business Seminar', attendees: 28 },
      { date: 'Aug 15', title: 'Fire Prevention Seminar — Poblacion', time: '9:00 AM - 12:00 PM', location: 'Poblacion Barangay Hall', type: 'Seminar', attendees: 28 },
      { date: 'Aug 20', title: 'Earthquake & Fire Drill — Don Basilio School', time: '8:00 AM - 11:00 AM', location: 'Don Basilio School Inc.', type: 'Fire Drill', attendees: 62 },
      { date: 'Aug 28', title: 'Don Basilio Home Safety Check', time: '9:00 AM - 3:00 PM', location: 'Don Basilio Barangay', type: 'Outreach', attendees: 0 },
    ],
  },
  {
    month: 'September 2026',
    events: [
      { date: 'Sep 5', title: 'Home Fire Safety Workshop', time: '1:00 PM - 4:00 PM', location: 'Ipil Heights Covered Court', type: 'Seminar', attendees: 15 },
      { date: 'Sep 12', title: 'Basic Life Support Training', time: '8:00 AM - 5:00 PM', location: 'BFP Ipil Station Training Room', type: 'Seminar', attendees: 30 },
    ],
  },
  {
    month: 'October 2026',
    events: [
      { date: 'Oct 10', title: 'Makilas Barangay Fire Drill', time: '8:00 AM - 10:00 AM', location: 'Makilas Barangay Plaza', type: 'Fire Drill', attendees: 0 },
      { date: 'Oct 22', title: 'Upper Ipil Fire Safety Forum', time: '9:00 AM - 12:00 PM', location: 'Upper Ipil Barangay Hall', type: 'Seminar', attendees: 0 },
    ],
  },
];

const typeColors: Record<string, string> = {
  Seminar: 'border-l-indigo-500',
  'Fire Drill': 'border-l-orange-500',
  Outreach: 'border-l-teal-500',
  'Business Seminar': 'border-l-purple-500',
};

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-gray-500 font-medium">Community Programs</div>
        <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Event Calendar</h1>
        <p className="text-xs text-gray-400 mt-0.5">Upcoming programs, seminars, and drills</p>
      </div>

      <div className="space-y-8">
        {months.map((m) => (
          <div key={m.month}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon size={16} className="text-red-600" />
              <h2 className="text-sm font-semibold text-gray-900">{m.month}</h2>
            </div>
            <div className="space-y-3">
              {m.events.map((e) => (
                <div key={e.title} className={`bg-white border border-gray-200 rounded-lg p-4 border-l-4 ${typeColors[e.type] || 'border-l-gray-300'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-red-600">{e.date}</span>
                      <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{e.title}</h3>
                    </div>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{e.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {e.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {e.location}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {e.attendees} registered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
