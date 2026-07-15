import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ExternalLink, Award, Clock, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'bfp-training-records';
const PERSONNEL_KEY = 'bfp-personnel';

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function loadPersonnel() {
  try { const raw = localStorage.getItem(PERSONNEL_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function isExpired(dateStr: string) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function TrainingRecords() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [personnel] = useState<any[]>(loadPersonnel);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.personnelId || !form.title) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const id = crypto.randomUUID();
      const person = personnel.find((p: any) => p.id === form.personnelId);
      setItems((prev) => [{ id, ...form, name: person?.name || 'Unknown' }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' });
  }

  function editItem(item: any) {
    setForm({
      personnelId: item.personnelId, title: item.title, provider: item.provider || '',
      completedDate: item.completedDate || '', expiryDate: item.expiryDate || '', certificateUrl: item.certificateUrl || ''
    });
    setEditing(item); setShowForm(true);
  }

  function remove(id: string) {
    if (confirm('Delete this training record?')) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = items.filter((r) => {
    if (filter === 'Expired' && !isExpired(r.expiryDate)) return false;
    if (filter === 'Valid' && isExpired(r.expiryDate)) return false;
    if (search) { const q = search.toLowerCase(); return r.title.toLowerCase().includes(q) || (r.name || '').toLowerCase().includes(q); }
    return true;
  });

  const expired = items.filter((i) => isExpired(i.expiryDate)).length;
  const valid = items.filter((i) => i.expiryDate && !isExpired(i.expiryDate)).length;
  const noExpiry = items.filter((i) => !i.expiryDate).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Personnel & Shifts</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Training Records</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} training records</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ personnelId: '', title: '', provider: '', completedDate: '', expiryDate: '', certificateUrl: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add Training
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Total Training</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{items.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50"><Award size={16} className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Valid</div>
              <div className="text-xl font-semibold text-green-600 mt-1">{valid}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><Check size={16} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Expired</div>
              <div className="text-xl font-semibold text-red-600 mt-1">{expired}</div>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><AlertCircle size={16} className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">No Expiry</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{noExpiry}</div>
            </div>
            <div className="p-2 rounded-lg bg-gray-50"><Clock size={16} className="text-gray-400" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', 'Valid', 'Expired'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search training..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Personnel</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Training Title</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Completed</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Cert</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">No training records found.</td></tr>
              )}
              {filtered.map((r) => {
                const expired = isExpired(r.expiryDate);
                return (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-900">{r.name}</div>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{r.title}</td>
                    <td className="px-4 py-2.5 text-gray-600">{r.provider || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatDate(r.completedDate)}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatDate(r.expiryDate)}</td>
                    <td className="px-4 py-2.5">
                      {r.expiryDate ? (
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {expired ? 'Expired' : 'Valid'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.certificateUrl ? (
                        <a href={r.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                          <ExternalLink size={14} />
                        </a>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => editItem(r)} className="p-1 text-gray-400 hover:text-blue-600"><X size={14} className="rotate-45" /></button>
                        <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-600"><X size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Training' : 'Add Training Record'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Personnel <span className="text-red-500">*</span></label>
                <select value={form.personnelId} onChange={(e) => setForm({ ...form, personnelId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select personnel...</option>
                  {personnel.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Training Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Basic Fire Fighting Course" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                <input type="text" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. BFP National Training Institute" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Completed Date</label>
                  <input type="date" value={form.completedDate} onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Certificate URL</label>
                <input type="url" value={form.certificateUrl} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.personnelId || !form.title}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
