import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';

const STORAGE_KEY = 'bfp-incoming-docs';
const SEED = [
  { id: '1', title: 'Annual Fire Safety Report - Region IX', sender: 'BFP Regional Office IX', date: 'Jul 12, 2026', status: 'Received', deadline: 'Jul 30, 2026' },
  { id: '2', title: 'Directive on Updated Fire Code Implementation', sender: 'BFP National Headquarters', date: 'Jul 10, 2026', status: 'For Review', deadline: 'Jul 25, 2026' },
  { id: '3', title: 'Request for Station Inventory Report', sender: 'Provincial Fire Marshal', date: 'Jul 8, 2026', status: 'Completed', deadline: 'Jul 20, 2026' },
];

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return SEED;
}

const statusColors: Record<string, string> = {
  Received: 'bg-blue-100 text-blue-700',
  'For Review': 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Archived: 'bg-gray-100 text-gray-500',
};

const statuses = ['Received', 'For Review', 'Completed', 'Archived'];

export default function IncomingDocuments() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', sender: '', deadline: '', remarks: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.title || !form.sender) return;
    const id = crypto.randomUUID();
    setItems((prev) => [{ id, ...form, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'Received' }, ...prev]);
    setShowForm(false); setForm({ title: '', sender: '', deadline: '', remarks: '' });
  }

  function updateStatus(id: string, status: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }
  function remove(id: string) { if (confirm('Remove this document?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.title.toLowerCase().includes(q) || r.sender.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Document Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Incoming Documents</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} incoming documents</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Receive Document
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer" onClick={() => setFilter(k)}>
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-lg font-semibold text-gray-900 mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', ...statuses].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Document</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Sender</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Received</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.sender}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.deadline || '—'}</td>
                  <td className="px-4 py-2.5">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-600"><X size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Receive Document</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Document Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sender <span className="text-red-500">*</span></label>
                <input type="text" value={form.sender} onChange={(e) => setForm({ ...form, sender: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.title || !form.sender}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Receive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
