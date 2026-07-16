import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { DocumentsApi } from '../../lib/api';

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  'For Approval': 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Released: 'bg-blue-100 text-blue-700',
  Archived: 'bg-red-100 text-red-700',
};

const statuses = ['Draft', 'For Approval', 'Approved', 'Released', 'Archived'];

function parseMeta(doc: any) {
  let meta: any = {};
  try { meta = JSON.parse(doc.description || '{}'); } catch {}
  return { ...doc, recipient: meta.recipient || '', tracking: meta.tracking || '', desc: meta.desc || '' };
}

export default function OutgoingDocuments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', recipient: '', description: '' });

  useEffect(() => {
    DocumentsApi.list().then((data) => {
      setItems(data.filter((d: any) => d.type === 'outgoing').map(parseMeta));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!form.title || !form.recipient) return;
    const count = items.length;
    const tracking = `OUT-${String(count + 1).padStart(3, '0')}`;
    const created = await DocumentsApi.create({
      title: form.title,
      type: 'outgoing',
      category: 'Outgoing',
      description: JSON.stringify({ recipient: form.recipient, tracking, desc: form.description }),
      status: 'Draft',
    });
    setItems((prev) => [parseMeta(created), ...prev]);
    setShowForm(false);
    setForm({ title: '', recipient: '', description: '' });
  }

  async function updateStatus(id: string, status: string) {
    const updated = await DocumentsApi.update(id, { status });
    setItems((prev) => prev.map((i) => i.id === id ? parseMeta({ ...i, ...updated }) : i));
  }

  async function remove(id: string) {
    if (confirm('Delete this document?')) {
      await DocumentsApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.title.toLowerCase().includes(q) || r.recipient.toLowerCase().includes(q) || r.tracking.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Document Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Outgoing Documents</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} outgoing documents</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Outgoing
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
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Document</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-900 font-semibold">{r.tracking}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.recipient}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">New Outgoing Document</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Recipient <span className="text-red-500">*</span></label>
                <input type="text" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.title || !form.recipient}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
