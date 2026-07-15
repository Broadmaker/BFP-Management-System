import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const STORAGE_KEY = 'bfp-service-requests';
const SEED = [
  { id: 'SR-2026-001', type: 'FSIC Application', requester: 'Juan Dela Cruz', business: 'Sari-Sari Store', contact: '0917-123-4567', date: 'Jul 12, 2026', status: 'Pending' },
  { id: 'SR-2026-002', type: 'FSIC Renewal', requester: 'Maria Santos', business: 'Riverside Eatery', contact: '0928-234-5678', date: 'Jul 11, 2026', status: 'Under Review' },
  { id: 'SR-2026-003', type: 'Inspection Request', requester: 'Pedro Reyes', business: '—', contact: '0939-345-6789', date: 'Jul 10, 2026', status: 'Approved' },
  { id: 'SR-2026-004', type: 'Document Request', requester: 'Ana Gonzales', business: '—', contact: '0940-456-7890', date: 'Jul 9, 2026', status: 'Completed' },
  { id: 'SR-2026-005', type: 'FSIC Application', requester: 'Carlos Lim', business: 'Sibugay Hardware', contact: '0951-567-8901', date: 'Jul 8, 2026', status: 'Rejected' },
];

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}

function makeId() {
  const n = Date.now().toString(36).toUpperCase();
  return `SR-${n.slice(-5)}`;
}

const statuses = ['Pending', 'Under Review', 'Approved', 'Completed', 'Rejected'];
const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700', 'Under Review': 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700', Completed: 'bg-gray-100 text-gray-600',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ServiceRequests() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ type: '', requester: '', business: '', contact: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [{ id: makeId(), ...form, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'Pending' }, ...prev]);
    }
    setShowForm(false); setEditing(null); setForm({ type: '', requester: '', business: '', contact: '' });
  }

  function edit(item: any) { setForm({ type: item.type, requester: item.requester, business: item.business, contact: item.contact }); setEditing(item); setShowForm(true); }

  function remove(id: string) { if (confirm('Delete this request?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  function updateStatus(id: string, status: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.requester.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.business.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Public Service</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Service Requests</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} total requests</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ type: '', requester: '', business: '', contact: '' }); setShowForm(true); }} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-lg font-semibold text-gray-900 mt-0.5">{v}</div>
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
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Requester</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{r.id}</td>
                <td className="px-4 py-2.5 text-gray-900">{r.type}</td>
                <td className="px-4 py-2.5"><div className="font-medium text-gray-900">{r.requester}</div><div className="text-xs text-gray-400">{r.contact}</div></td>
                <td className="px-4 py-2.5 text-gray-600">{r.business}</td>
                <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                <td className="px-4 py-2.5">
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Request' : 'New Service Request'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Request Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select type...</option>
                  <option>FSIC Application</option><option>FSIC Renewal</option><option>Inspection Request</option><option>Document Request</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Requester Name</label>
                <input type="text" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact #</label>
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Business (optional)</label>
                  <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="—" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.type || !form.requester || !form.contact} className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"><Check size={14} /> {editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
