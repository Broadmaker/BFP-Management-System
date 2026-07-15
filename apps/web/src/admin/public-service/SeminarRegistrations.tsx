import { useState, useEffect } from 'react';
import { Users, Download, CheckCircle, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';

const STORAGE_KEY = 'bfp-seminar-registrations';
const SEED = [
  { id: 'REG-001', seminar: 'Fire Prevention Seminar', date: 'Aug 15, 2026', name: 'Rolando Mercado', barangay: 'Poblacion', contact: '0912-345-6789', attended: false },
  { id: 'REG-002', seminar: 'Fire Prevention Seminar', date: 'Aug 15, 2026', name: 'Susan Villanueva', barangay: 'Ipil Heights', contact: '0923-456-7890', attended: false },
  { id: 'REG-003', seminar: 'Earthquake & Fire Drill', date: 'Aug 20, 2026', name: 'Danny Fernandez', barangay: 'Don Basilio', contact: '0934-567-8901', attended: false },
  { id: 'REG-004', seminar: 'BLS Training', date: 'Sep 12, 2026', name: 'Lorna Salvador', barangay: 'Bangkerohan', contact: '0945-678-9012', attended: false },
  { id: 'REG-005', seminar: 'Home Fire Safety Workshop', date: 'Sep 5, 2026', name: 'Charisse Go', barangay: 'Sanito', contact: '0967-890-1234', attended: false },
  { id: 'REG-006', seminar: 'Fire Prevention Seminar', date: 'Aug 15, 2026', name: 'Mark Anthony Cruz', barangay: 'Makilas', contact: '0978-901-2345', attended: false },
  { id: 'REG-007', seminar: 'BLS Training', date: 'Sep 12, 2026', name: 'Gloria Torres', barangay: 'Poblacion', contact: '0989-012-3456', attended: false },
  { id: 'REG-008', seminar: 'Earthquake & Fire Drill', date: 'Aug 20, 2026', name: 'Benito Reyes', barangay: 'Upper Ipil', contact: '0956-789-0123', attended: false },
];

const SEMINAR_NAMES = ['Fire Prevention Seminar', 'Earthquake & Fire Drill', 'BLS Training', 'Home Fire Safety Workshop'];

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return SEED;
}

function makeId() { return `REG-${Date.now().toString(36).toUpperCase().slice(-5)}`; }

export default function SeminarRegistrations() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [selectedSeminar, setSelectedSeminar] = useState(SEMINAR_NAMES[0]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    const data = { ...form, attended: editing ? editing.attended : false };
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...data } : i));
    } else {
      setItems((prev) => [{ id: makeId(), ...data }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
  }

  function edit(item: any) { setForm({ name: item.name, barangay: item.barangay, contact: item.contact, seminar: item.seminar, date: item.date }); setEditing(item); setShowForm(true); }

  function remove(id: string) { if (confirm('Remove this registration?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  function toggleAttendance(id: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, attended: !i.attended } : i)); }

  const filtered = items.filter((r) => {
    if (r.seminar !== selectedSeminar) return false;
    if (search) { const q = search.toLowerCase(); return r.name.toLowerCase().includes(q) || r.barangay.toLowerCase().includes(q); }
    return true;
  });

  const total = filtered.length;
  const attended = filtered.filter((r) => r.attended).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Public Service</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Seminar Registrations</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} total registrations</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', barangay: '', contact: '', seminar: selectedSeminar, date: '' }); setShowForm(true); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add Registration
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {SEMINAR_NAMES.map((s) => (
              <button key={s} onClick={() => setSelectedSeminar(s)} className={`text-xs font-medium px-3 py-1.5 rounded-md ${selectedSeminar === s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /> <span className="text-gray-900 font-medium">{total}</span> registered</div>
          <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> <span className="text-gray-900 font-medium">{attended}</span> attended</div>
          <button className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"><Download size={12} /> Export</button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Barangay</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Attended</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.barangay}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.contact}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                <td className="px-4 py-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={r.attended} onChange={() => toggleAttendance(r.id)} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className={`text-xs ${r.attended ? 'text-green-700' : 'text-gray-400'}`}>{r.attended ? 'Present' : 'Mark'}</span>
                  </label>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => edit(r)} className="p-1 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Registration' : 'New Registration'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Seminar</label>
                <select value={form.seminar} onChange={(e) => setForm({ ...form, seminar: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  {SEMINAR_NAMES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barangay</label>
                  <select value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select...</option>
                    <option>Poblacion</option><option>Ipil Heights</option><option>Don Basilio</option><option>Bangkerohan</option><option>Upper Ipil</option><option>Sanito</option><option>Makilas</option><option>Lumbia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact #</label>
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
                <input type="date" value={form.date} onChange={(e) => {
                  const d = new Date(e.target.value + 'T12:00:00');
                  setForm({ ...form, date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) });
                }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || !form.barangay || !form.contact} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"><Check size={14} /> {editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
