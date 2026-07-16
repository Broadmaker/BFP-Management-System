import { useState, useEffect } from 'react';
import { Users, Download, CheckCircle, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { ProgramsApi, ParticipantsApi } from '../../lib/api';

const SEMINAR_NAMES = ['Fire Prevention Seminar', 'Earthquake & Fire Drill', 'BLS Training', 'Home Fire Safety Workshop'];
const BARANGAYS = ['Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil', 'Sanito', 'Makilas', 'Lumbia'];

export default function SeminarRegistrations() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeminar, setSelectedSeminar] = useState(SEMINAR_NAMES[0]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([ProgramsApi.list(), ParticipantsApi.list()])
      .then(([progs, parts]: any[]) => {
        setPrograms(progs || []);
        setParticipants(parts || []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  function programLookup(seminar: string) {
    const existing = programs.find((p) => p.title === seminar);
    return existing;
  }

  const enriched = participants
    .map((p) => {
      const prog = programs.find((pr) => pr.id === p.programId);
      return { ...p, seminarName: prog?.title || '', seminarDate: prog?.scheduledDate || '' };
    })
    .filter((p) => p.seminarName === selectedSeminar);

  const filtered = enriched.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || (r.barangay || '').toLowerCase().includes(q);
    }
    return true;
  });

  const total = filtered.length;
  const attended = filtered.filter((r) => r.attended).length;

  async function save() {
    const prog = programLookup(form.seminar);
    let programId = prog?.id;
    if (!programId) {
      const created = await ProgramsApi.create({
        title: form.seminar,
        type: 'Seminar',
        scheduledDate: form.date ? new Date(form.date).toISOString() : null,
        status: 'Scheduled',
      });
      programId = created.id;
      setPrograms((prev) => [...prev, created]);
    }

    const payload = {
      programId,
      name: form.name,
      contactNumber: form.contact,
      barangay: form.barangay,
      attended: editing ? editing.attended : false,
    };

    if (editing) {
      await ParticipantsApi.update(editing.id, payload);
      setParticipants((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p));
    } else {
      const created = await ParticipantsApi.create(payload);
      setParticipants((prev) => [created, ...prev]);
    }

    setShowForm(false);
    setEditing(null);
    setForm({ name: '', barangay: '', contact: '', seminar: SEMINAR_NAMES[0], date: '' });
  }

  function edit(item: any) {
    setForm({ name: item.name, barangay: item.barangay || '', contact: item.contactNumber || '', seminar: item.seminarName, date: item.seminarDate || '' });
    setEditing(item);
    setShowForm(true);
  }

  async function remove(id: string) {
    if (confirm('Remove this registration?')) {
      await ParticipantsApi.delete(id);
      setParticipants((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function toggleAttendance(id: string) {
    const p = participants.find((x) => x.id === id);
    if (!p) return;
    const newVal = !p.attended;
    await ParticipantsApi.markAttended(id, newVal);
    setParticipants((prev) => prev.map((i) => i.id === id ? { ...i, attended: newVal } : i));
  }

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Public Service</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Seminar Registrations</h1>
          <p className="text-xs text-gray-400 mt-0.5">{participants.length} total registrations</p>
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
                <td className="px-4 py-2.5 text-gray-600">{r.barangay || '—'}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.contactNumber || '—'}</td>
                <td className="px-4 py-2.5 text-gray-600">
                  {r.seminarDate ? new Date(r.seminarDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}
                </td>
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
                    {BARANGAYS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact #</label>
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
                <input type="date" value={form.date ? new Date(form.date).toISOString().slice(0, 10) : ''} onChange={(e) => {
                  const d = new Date(e.target.value + 'T12:00:00');
                  setForm({ ...form, date: d.toISOString() });
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
