import { useState, useEffect } from 'react';
import { Plus, X, Check, FileText, Users, Clock } from 'lucide-react';

const STORAGE_KEY = 'bfp-memoranda';
const SEED = [
  { id: '1', subject: 'Revised Fire Safety Guidelines 2026', from: 'SUPT Juan Dela Cruz', date: 'Jul 14, 2026', priority: 'High', status: 'Released' },
  { id: '2', subject: 'Schedule of Fire Drills for Q3 2026', from: 'SINSP Maria Santos', date: 'Jul 12, 2026', priority: 'Normal', status: 'Approved' },
  { id: '3', subject: 'Equipment Maintenance Reminder', from: 'FO3 Roberto Mendoza', date: 'Jul 10, 2026', priority: 'Normal', status: 'Draft' },
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
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Normal: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-500',
};

const statuses = ['Draft', 'Pending Approval', 'Approved', 'Released'];

export default function Memoranda() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', content: '', priority: 'Normal' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.subject) return;
    const id = crypto.randomUUID();
    setItems((prev) => [{ id, ...form, from: 'Station Commander', date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), status: 'Draft' }, ...prev]);
    setShowForm(false); setForm({ subject: '', content: '', priority: 'Normal' });
  }

  function updateStatus(id: string, s: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: s } : i)); }
  function remove(id: string) { if (confirm('Delete this memorandum?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.subject.toLowerCase().includes(q) || r.from?.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Document Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Memoranda</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} memoranda</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Memo
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer" onClick={() => setFilter(k)}>
            <div className="text-xs text-gray-500">{k === 'All' ? 'Total' : k}</div>
            <div className="text-lg font-semibold text-gray-900 mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{r.subject}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 ml-6">
                  <span className="flex items-center gap-1"><Users size={11} /> {r.from}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {r.date}</span>
                </div>
                {r.content && <p className="text-xs text-gray-600 mt-2 ml-6">{r.content}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                  className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-600"><X size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-sm text-gray-400 py-8">No memoranda found.</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">New Memorandum</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['High', 'Normal', 'Low'].map((p) => (
                    <button key={p} onClick={() => setForm({ ...form, priority: p })}
                      className={`px-3 py-2 text-sm rounded-lg border ${form.priority === p ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Memorandum content..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.subject}
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
