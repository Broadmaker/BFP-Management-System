import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, MapPin, Clock, Pencil, Trash2, X, Check } from 'lucide-react';
import { AppointmentsApi } from '../../lib/api';

const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-gray-100 text-gray-500',
};

export default function Appointments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' });

  useEffect(() => {
    AppointmentsApi.list().then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function save() {
    const data = { ...form, business: form.business || '—' };
    if (editing) {
      const updated = await AppointmentsApi.update(editing.id, data);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
    } else {
      const created = await AppointmentsApi.create(data);
      setItems((prev) => [created, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' });
  }

  function edit(item: any) { setForm({ name: item.name, business: item.business === '—' ? '' : item.business, type: item.type, date: item.date, time: item.time, address: item.address }); setEditing(item); setShowForm(true); }

  async function remove(id: string) {
    if (confirm('Cancel this appointment?')) {
      await AppointmentsApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function updateStatus(id: string, status: string) {
    const updated = await AppointmentsApi.update(id, { status });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
  }

  const filtered = items.filter((a) => {
    if (filter !== 'All' && a.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return a.name.toLowerCase().includes(q) || (a.business || '').toLowerCase().includes(q) || a.id.toLowerCase().includes(q); }
    return true;
  });

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Public Service</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Inspection Appointments</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} appointments</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', business: '', type: 'Initial Inspection', date: '', time: '', address: '' }); setShowForm(true); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Appointment
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', ...statuses].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((a) => (
            <div key={a.id} className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center text-xs font-bold flex-shrink-0">
                <span className="text-[10px] font-medium">{a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'short' }) : ''}</span>
                <span>{a.date ? new Date(a.date).getDate() : ''}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{a.business !== '—' ? a.business : a.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{a.type} — {a.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[a.status]} cursor-pointer outline-none`}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => edit(a)} className="p-1 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => remove(a.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {a.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {a.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {a.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Appointment' : 'New Appointment'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Client Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Business</label>
                  <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option>Initial Inspection</option><option>Reinspection</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date ? new Date(form.date).toISOString().split('T')[0] : ''} onChange={(e) => {
                    const d = new Date(e.target.value + 'T12:00:00');
                    setForm({ ...form, date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) });
                  }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={form.time ? (() => {
                    const m = form.time.match(/(\d+):(\d+)\s*(AM|PM)/);
                    if (!m) return '';
                    let h = +m[1];
                    if (m[3] === 'PM' && h !== 12) h += 12;
                    if (m[3] === 'AM' && h === 12) h = 0;
                    return `${String(h).padStart(2, '0')}:${m[2]}`;
                  })() : ''} onChange={(e) => {
                    const [h, m] = e.target.value.split(':');
                    const ampm = +h >= 12 ? 'PM' : 'AM';
                    const h12 = +h % 12 || 12;
                    setForm({ ...form, time: `${h12}:${m} ${ampm}` });
                  }} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || !form.date || !form.time || !form.address} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"><Check size={14} /> {editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
