import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, ThumbsUp, ThumbsDown } from 'lucide-react';

const INSPECTION_KEY = 'bfp-hydrant-inspections';
const HYDRANT_KEY = 'bfp-hydrants';

function loadInspections() {
  try { const raw = localStorage.getItem(INSPECTION_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function loadHydrants() {
  try { const raw = localStorage.getItem(HYDRANT_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

export default function HydrantInspections() {
  const [items, setItems] = useState<any[]>(loadInspections);
  const [hydrants, setHydrants] = useState<any[]>(loadHydrants);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ hydrantId: '', waterPressure: '', isOperational: 'true' as string, remarks: '' });

  useEffect(() => { localStorage.setItem(INSPECTION_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.hydrantId) return;
    const hydrant = hydrants.find((h: any) => h.id === form.hydrantId);
    const isOp = form.isOperational === 'true';
    const id = crypto.randomUUID();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setItems((prev) => [{ id, ...form, hydrantName: hydrant?.hydrantId || 'Unknown', barangay: hydrant?.barangay || '', isOperational: isOp, date: dateStr }, ...prev]);
    setHydrants((prev) => prev.map((h) => h.id === form.hydrantId ? {
      ...h, lastInspected: dateStr, waterPressure: form.waterPressure || h.waterPressure,
      status: isOp ? 'Operational' : 'Under Repair',
    } : h));
    setShowForm(false);
    setForm({ hydrantId: '', waterPressure: '', isOperational: 'true', remarks: '' });
  }

  function remove(id: string) { if (confirm('Delete this inspection?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && (filter === 'Operational' ? !r.isOperational : r.isOperational)) return false;
    if (search) { const q = search.toLowerCase(); return r.hydrantName?.toLowerCase().includes(q) || r.barangay?.toLowerCase().includes(q); }
    return true;
  });

  const passed = items.filter((i) => i.isOperational).length;
  const failed = items.filter((i) => !i.isOperational).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Hydrants</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Hydrant Inspections</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} inspections · {passed} passed</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Inspection
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Total Inspections</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{items.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Operational</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{passed}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><ThumbsUp size={16} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Needs Repair</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{failed}</div>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><ThumbsDown size={16} className="text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', 'Operational', 'Needs Repair'].map((f) => (
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
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Hydrant</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Barangay</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Pressure</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-gray-900">{r.hydrantName}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.barangay}</td>
                  <td className="px-4 py-2.5 text-gray-900 font-medium">{r.waterPressure ? `${r.waterPressure} PSI` : '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${r.isOperational ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.isOperational ? 'Operational' : 'Needs Repair'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.remarks || '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">Record Hydrant Inspection</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hydrant <span className="text-red-500">*</span></label>
                <select value={form.hydrantId} onChange={(e) => setForm({ ...form, hydrantId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select hydrant...</option>
                  {hydrants.map((h: any) => <option key={h.id} value={h.id}>{h.hydrantId} — {h.barangay}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Water Pressure (PSI)</label>
                <input type="number" value={form.waterPressure} onChange={(e) => setForm({ ...form, waterPressure: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Operational Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setForm({ ...form, isOperational: 'true' })}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.isOperational === 'true' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <ThumbsUp size={14} className="inline mr-1" />Operational
                  </button>
                  <button onClick={() => setForm({ ...form, isOperational: 'false' })}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.isOperational === 'false' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <ThumbsDown size={14} className="inline mr-1" />Needs Repair
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.hydrantId}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
