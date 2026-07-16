import { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, Clock, Pencil, Trash2, X, Check } from 'lucide-react';
import { HazardReportsApi } from '../../lib/api';

const statuses = ['New', 'Under Investigation', 'Resolved', 'Closed'];
const priorities = ['Critical', 'High', 'Medium', 'Low'];
const hazardTypes = ['Electrical Hazard', 'Gas Leak Suspected', 'Unattended Burning', 'Blocked Fire Exit', 'Improper LPG Storage', 'Chemical Spill', 'Other'];

const statusColors: Record<string, string> = {
  New: 'bg-red-100 text-red-700', 'Under Investigation': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500',
};
const priorityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700',
};

export default function HazardReports() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' });

  useEffect(() => {
    HazardReportsApi.list().then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (editing) {
      const updated = await HazardReportsApi.update(editing.id, form);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
    } else {
      const created = await HazardReportsApi.create(form);
      setItems((prev) => [created, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' });
  }

  function edit(item: any) { setForm({ type: item.type, location: item.location, barangay: item.barangay, reporter: item.reporter, priority: item.priority }); setEditing(item); setShowForm(true); }

  async function remove(id: string) {
    if (confirm('Delete this hazard report?')) {
      await HazardReportsApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function updateStatus(id: string, status: string) {
    const updated = await HazardReportsApi.update(id, { status });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
  }

  const filtered = items.filter((h) => {
    if (filter !== 'All' && h.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return h.type.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.barangay.toLowerCase().includes(q); }
    return true;
  });

  function getStyle(p: string) {
    return p === 'Critical' ? 'bg-red-50 text-red-600' : p === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600';
  }

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Public Service</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Hazard Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} reports</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ type: 'Electrical Hazard', location: '', barangay: 'Poblacion', reporter: '', priority: 'Medium' }); setShowForm(true); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <AlertTriangle size={14} /> Log Hazard
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'New', value: items.filter((i) => i.status === 'New').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Under Investigation', value: items.filter((i) => i.status === 'Under Investigation').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Resolved', value: items.filter((i) => i.status === 'Resolved').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total', value: items.length, color: 'text-gray-900', bg: 'bg-gray-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className={`text-lg font-semibold mt-0.5 ${s.color}`}>{s.value}</div>
          </div>
        ))}
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
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map((h) => (
            <div key={h.id} className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStyle(h.priority)}`}>
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{h.type}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{h.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${priorityColors[h.priority]}`}>{h.priority}</span>
                    <select value={h.status} onChange={(e) => updateStatus(h.id, e.target.value)} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[h.status]} cursor-pointer outline-none`}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => edit(h)} className="p-1 text-gray-400 hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => remove(h.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {h.barangay}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {h.date ? new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</span>
                  <span>{h.reporter}</span>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Hazard Report' : 'Log Hazard Report'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hazard Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  {hazardTypes.filter((t) => t !== 'Other').map((t) => <option key={t}>{t}</option>)}
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location / Address</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barangay</label>
                  <select value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>Poblacion</option><option>Ipil Heights</option><option>Don Basilio</option><option>Bangkerohan</option><option>Upper Ipil</option><option>Sanito</option><option>Makilas</option><option>Lumbia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    {priorities.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Reporter</label>
                <input type="text" value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Anonymous" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.type || !form.location} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"><Check size={14} /> {editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
