import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle, X, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SEMINARS = [
  { title: 'Fire Prevention Seminar', date: 'Aug 15, 2026', time: '9:00 AM - 12:00 PM', location: 'Poblacion Barangay Hall', slots: 45, desc: 'Learn fire prevention techniques, proper use of fire extinguishers, and emergency evacuation procedures.' },
  { title: 'Earthquake & Fire Drill', date: 'Aug 20, 2026', time: '8:00 AM - 11:00 AM', location: 'Don Basilio Elementary School', slots: 100, desc: 'Hands-on drill combining earthquake preparedness and fire evacuation protocols.' },
  { title: 'Home Fire Safety Workshop', date: 'Sep 5, 2026', time: '1:00 PM - 4:00 PM', location: 'Ipil Heights Covered Court', slots: 50, desc: 'Practical workshop on home fire safety, electrical safety, and family emergency planning.' },
  { title: 'Basic Life Support Training', date: 'Sep 12, 2026', time: '8:00 AM - 5:00 PM', location: 'BFP Ipil Station Training Room', slots: 30, desc: 'Full-day BLS training covering CPR, first aid, and emergency response techniques.' },
];

const STORAGE_KEY = 'bfp-seminar-registrations';

function loadRegistrations() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function getRegisteredCount(seminar: string) {
  return loadRegistrations().filter((r: any) => r.seminar === seminar).length;
}

const barangays = ['Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil', 'Sanito', 'Makilas', 'Lumbia', 'Labi', 'Taway'];

export default function PublicSeminars() {
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', barangay: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);

  function openRegister(seminar: any) {
    setSelected(seminar);
    setForm({ name: '', barangay: '', contact: '' });
    setSubmitted(false);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const registrations = loadRegistrations();
    const id = `REG-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    registrations.push({ id, seminar: selected.title, name: form.name, barangay: form.barangay, contact: form.contact, date: selected.date, attended: false });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    setSubmitted(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="text-xs text-gray-400 mb-1">
        <Link to="/public" className="hover:text-red-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Seminars & Training</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seminars & Training</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse upcoming fire prevention seminars, drills, and training events in Ipil, Zamboanga Sibugay.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {SEMINARS.map((s) => {
          const registered = getRegisteredCount(s.title);
          const full = registered >= s.slots;
          return (
            <div key={s.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    full ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {full ? 'Fully Booked' : `${s.slots - registered} slots left`}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{s.desc}</p>
                <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2"><Calendar size={13} className="text-gray-400" /> {s.date}</div>
                  <div className="flex items-center gap-2"><Clock size={13} className="text-gray-400" /> {s.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={13} className="text-gray-400" /> {s.location}</div>
                  <div className="flex items-center gap-2"><Users size={13} className="text-gray-400" /> {registered}/{s.slots} registered</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${full ? 'bg-red-500' : 'bg-red-600'}`}
                    style={{ width: `${Math.min((registered / s.slots) * 100, 100)}%` }}
                  />
                </div>
                <button
                  disabled={full}
                  onClick={() => openRegister(s)}
                  className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                    full ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'
                  }`}
                >
                  {full ? 'Sold Out' : 'Register Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && !submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Register</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selected.title}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-2 mb-1"><Calendar size={12} /> {selected.date} — {selected.time}</div>
                <div className="flex items-center gap-2"><MapPin size={12} /> {selected.location}</div>
              </div>
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Barangay <span className="text-red-500">*</span></label>
                    <select value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                      <option value="">Select...</option>
                      {barangays.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Contact # <span className="text-red-500">*</span></label>
                    <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setSelected(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800">Confirm Registration</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setSubmitted(false); }}>
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3"><CheckCircle size={28} /></div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Registration Complete!</h2>
            <p className="text-xs text-gray-500 mb-4">You are registered for <strong className="text-gray-900">{selected?.title}</strong>. We will contact you with event reminders.</p>
            <button onClick={() => { setSelected(null); setSubmitted(false); }} className="w-full py-2 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
