import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, FileText } from 'lucide-react';

const STORAGE_KEY = 'bfp-documents';
const SEED = [
  { id: '1', title: 'Monthly Incident Report - June 2026', type: 'report', category: 'Monthly Reports', description: 'Summary of all incidents for June 2026', status: 'Approved', version: 1, date: 'Jul 1, 2026' },
  { id: '2', title: 'Fire Safety Inspection Guidelines 2026', type: 'memorandum', category: 'Memoranda', description: 'Updated inspection protocols and checklists', status: 'Released', version: 2, date: 'Jun 28, 2026' },
  { id: '3', title: 'Station Maintenance Schedule Q3 2026', type: 'circular', category: 'Circulars', description: 'Equipment and vehicle maintenance schedule', status: 'Draft', version: 1, date: 'Jul 5, 2026' },
];

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return SEED;
}

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  'Pending Approval': 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Released: 'bg-blue-100 text-blue-700',
  Archived: 'bg-red-100 text-red-700',
};

const statuses = ['Draft', 'Pending Approval', 'Approved', 'Released', 'Archived'];
const categories = ['Monthly Reports', 'Memoranda', 'Circulars', 'Certificates', 'Reports', 'Others'];

export default function DocumentRepository() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', type: 'report', category: '', description: '', fileUrl: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.title || !form.category) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const id = crypto.randomUUID();
      setItems((prev) => [{ id, ...form, status: 'Draft', version: 1, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ title: '', type: 'report', category: '', description: '', fileUrl: '' });
  }

  function edit(item: any) {
    setForm({ title: item.title, type: item.type, category: item.category, description: item.description || '', fileUrl: item.fileUrl || '' });
    setEditing(item); setShowForm(true);
  }

  function remove(id: string) { if (confirm('Delete this document?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  function updateStatus(id: string, status: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status, version: status === 'Released' ? i.version + 1 : i.version } : i)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (catFilter !== 'All' && r.category !== catFilter) return false;
    if (search) { const q = search.toLowerCase(); return r.title.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Document Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Document Repository</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} documents</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', type: 'report', category: '', description: '', fileUrl: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer" onClick={() => setFilter(k)}>
            <div className="text-xs text-gray-500">{k === 'All' ? 'Total' : k}</div>
            <div className="text-lg font-semibold text-gray-900 mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...statuses].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
            <span className="w-px h-4 bg-gray-200 mx-1" />
            {['All', ...categories].map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`text-xs px-2 py-1 rounded ${catFilter === c ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>{c === 'All' ? 'All Cats' : c}</button>
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
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Version</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">{r.title}</div>
                        <div className="text-xs text-gray-400">{r.description || r.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{r.category}</span></td>
                  <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                  <td className="px-4 py-2.5 text-gray-600">v{r.version}</td>
                  <td className="px-4 py-2.5">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Document' : 'Upload Document'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="report">Report</option><option value="memorandum">Memorandum</option>
                    <option value="circular">Circular</option><option value="certificate">Certificate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">File URL</label>
                <input type="url" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.title || !form.category}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
