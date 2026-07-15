import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';

const STORAGE_KEY = 'bfp-attendance';
const PERSONNEL_KEY = 'bfp-personnel';

function loadRecords() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function loadPersonnel() {
  try { const raw = localStorage.getItem(PERSONNEL_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

const typeColors: Record<string, string> = {
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Late: 'bg-yellow-100 text-yellow-700',
  'On Leave': 'bg-blue-100 text-blue-700',
  'Official Business': 'bg-purple-100 text-purple-700',
};

const types = ['Present', 'Absent', 'Late', 'On Leave', 'Official Business'];

export default function Attendance() {
  const [records, setRecords] = useState<any[]>(loadRecords);
  const [personnel] = useState<any[]>(loadPersonnel);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }, [records]);

  function save() {
    if (!form.personnelId || !form.date || !form.type) return;
    if (editing) {
      setRecords((prev) => prev.map((r) => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      const id = crypto.randomUUID();
      const person = personnel.find((p: any) => p.id === form.personnelId);
      setRecords((prev) => [{ id, ...form, name: person?.name || 'Unknown' }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' });
  }

  function editRecord(r: any) {
    setForm({ personnelId: r.personnelId, date: r.date, type: r.type, timeIn: r.timeIn || '', timeOut: r.timeOut || '', remarks: r.remarks || '' });
    setEditing(r); setShowForm(true);
  }

  function remove(id: string) {
    if (confirm('Delete this attendance record?')) setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = records.filter((r) => {
    if (filter !== 'All' && r.type !== filter) return false;
    if (search) { const q = search.toLowerCase(); return (r.name || '').toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: records.length };
  types.forEach((t) => { counts[t] = records.filter((r) => r.type === t).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Personnel & Shifts</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Attendance</h1>
          <p className="text-xs text-gray-400 mt-0.5">{todayStr()} — {records.length} records</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ personnelId: '', date: todayISO(), type: 'Present', timeIn: '', timeOut: '', remarks: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Log Attendance
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
            {['All', ...types].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search personnel..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Personnel</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Time In</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Time Out</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No attendance records found.</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-gray-900">{r.name}</div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.timeIn || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.timeOut || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.remarks || '—'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => editRecord(r)} className="p-1 text-gray-400 hover:text-blue-600"><X size={14} className="rotate-45" /></button>
                      <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-600"><X size={14} /></button>
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
          <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Attendance' : 'Log Attendance'}</h2>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-5 gap-1.5">
                  {types.map((t) => (
                    <button key={t} onClick={() => setForm({ ...form, type: t })}
                      className={`px-2 py-1.5 text-xs rounded-lg border ${form.type === t ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time In</label>
                  <input type="time" value={form.timeIn} onChange={(e) => setForm({ ...form, timeIn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time Out</label>
                  <input type="time" value={form.timeOut} onChange={(e) => setForm({ ...form, timeOut: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Optional" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.personnelId || !form.date}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
