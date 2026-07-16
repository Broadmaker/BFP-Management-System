import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { LeaveApi, PersonnelApi } from '../../lib/api';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

const typeColors: Record<string, string> = {
  Sick: 'bg-red-50 text-red-600',
  Vacation: 'bg-blue-50 text-blue-600',
  Personal: 'bg-purple-50 text-purple-600',
  Training: 'bg-amber-50 text-amber-600',
  Emergency: 'bg-orange-50 text-orange-600',
};

const statuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
const leaveTypes = ['Sick', 'Vacation', 'Personal', 'Training', 'Emergency'];

export default function LeaveManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ personnelId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    Promise.all([LeaveApi.list(), PersonnelApi.list()]).then(([r, p]) => {
      setItems(r);
      setPersonnel(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function personName(personnelId: string) {
    const p = personnel.find((x: any) => x.id === personnelId);
    return p ? (p.name || p.employeeNumber) : 'Unknown';
  }

  async function save() {
    if (!form.personnelId || !form.startDate || !form.endDate) return;
    if (editing) {
      const updated = await LeaveApi.update(editing.id, form);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
    } else {
      const created = await LeaveApi.create({ ...form, status: 'Pending' });
      setItems((prev) => [created, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ personnelId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
  }

  function editItem(item: any) {
    setForm({ personnelId: item.personnelId, type: item.type, startDate: item.startDate, endDate: item.endDate, reason: item.reason || '' });
    setEditing(item); setShowForm(true);
  }

  async function remove(id: string) {
    if (confirm('Delete this leave request?')) {
      await LeaveApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function updateStatus(id: string, status: string) {
    const updated = await LeaveApi.update(id, { status });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
  }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return personName(r.personnelId).toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Personnel & Shifts</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Leave Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} total requests</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ personnelId: '', type: 'Sick', startDate: '', endDate: '', reason: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> New Leave Request
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
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Personnel</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Filed</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No leave requests found.</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-gray-900">{personName(r.personnelId)}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.startDate}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.endDate}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                  <td className="px-4 py-2.5">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => editItem(r)} className="p-1 text-gray-400 hover:text-blue-600"><X size={14} className="rotate-45" /></button>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Leave Request' : 'New Leave Request'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Personnel <span className="text-red-500">*</span></label>
                <select value={form.personnelId} onChange={(e) => setForm({ ...form, personnelId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select personnel...</option>
                  {personnel.map((p: any) => <option key={p.id} value={p.id}>{p.name || p.employeeNumber}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Leave Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-5 gap-1.5">
                  {leaveTypes.map((t) => (
                    <button key={t} onClick={() => setForm({ ...form, type: t })}
                      className={`px-2 py-1.5 text-xs rounded-lg border ${form.type === t ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Optional" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.personnelId || !form.startDate || !form.endDate}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
