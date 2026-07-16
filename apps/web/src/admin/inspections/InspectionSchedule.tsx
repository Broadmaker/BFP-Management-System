import { useState, useEffect } from 'react';
import { Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { InspectionsApi, EstablishmentsApi } from '../../lib/api';

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

const resultColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Passed: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
  'Pending Compliance': 'bg-yellow-100 text-yellow-700',
  'Reinspection Required': 'bg-orange-100 text-orange-700',
};

const results = ['Scheduled', 'Passed', 'Failed', 'Pending Compliance', 'Reinspection Required'];

export default function InspectionSchedule() {
  const [items, setItems] = useState<any[]>([]);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' });
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    Promise.all([InspectionsApi.list(), EstablishmentsApi.list()])
      .then(([i, e]) => { setItems(i); setEstablishments(e); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d;
  });

  function estName(id: string) {
    const e = establishments.find((x: any) => x.id === id);
    return e?.businessName || id;
  }

  function getInspectionsForDate(dateStr: string) {
    return items.filter((s: any) => s.scheduledDate === dateStr);
  }

  async function save() {
    if (!form.establishmentId || !form.scheduledDate) return;
    if (editing) {
      const updated = await InspectionsApi.update(editing.id, form);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
    } else {
      const created = await InspectionsApi.create(form);
      setItems((prev) => [created, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' });
  }

  function edit(item: any) {
    setForm({ establishmentId: item.establishmentId, scheduledDate: item.scheduledDate, result: item.result, inspector: item.inspector || '', notes: item.notes || '' });
    setEditing(item); setShowForm(true);
  }

  async function remove(id: string) {
    if (confirm('Delete this inspection?')) {
      await InspectionsApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Safety Inspection</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Inspection Schedule</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} total inspections</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ establishmentId: '', scheduledDate: '', result: 'Scheduled', inspector: '', notes: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Schedule Inspection
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-1 hover:text-gray-900"><ChevronLeft size={16} /></button>
            <span className="font-medium text-gray-900">{formatDate(weekDates[0])} — {formatDate(weekDates[6])}</span>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1 hover:text-gray-900"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 divide-x divide-gray-200">
          {weekDates.map((d, i) => {
            const dateStr = d.toISOString().split('T')[0];
            const dayInspections = getInspectionsForDate(dateStr);
            const isToday = d.toDateString() === today.toDateString();
            return (
              <div key={i} className={`${isToday ? 'bg-red-50/30' : ''}`}>
                <div className={`text-center py-2 text-xs font-medium border-b border-gray-200 ${isToday ? 'text-red-600' : 'text-gray-500'}`}>
                  <div>{weekdays[d.getDay()]}</div>
                  <div className={`text-sm font-semibold ${isToday ? 'text-red-600' : 'text-gray-900'}`}>{d.getDate()}</div>
                </div>
                <div className="p-1 space-y-1 min-h-[120px]">
                  {dayInspections.length === 0 && <div className="text-[10px] text-gray-300 text-center pt-4">—</div>}
                  {dayInspections.slice(0, 3).map((ins: any) => (
                    <div key={ins.id}
                      onClick={() => edit(ins)}
                      className={`text-[10px] p-1 rounded cursor-pointer border ${resultColors[ins.result] || 'bg-gray-100'} border-transparent hover:opacity-80`}>
                      <div className="font-medium truncate">{estName(ins.establishmentId)}</div>
                      <div className="opacity-75">{ins.result}</div>
                    </div>
                  ))}
                  {dayInspections.length > 3 && <div className="text-[10px] text-gray-400 text-center">+{dayInspections.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900">All Scheduled Inspections</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Establishment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Inspector</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Notes</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No inspections scheduled.</td></tr>}
              {items.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{estName(r.establishmentId)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.scheduledDate}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.inspector || '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${resultColors[r.result]}`}>{r.result}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.notes || '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Inspection' : 'Schedule Inspection'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Establishment <span className="text-red-500">*</span></label>
                <select value={form.establishmentId} onChange={(e) => setForm({ ...form, establishmentId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select...</option>
                  {establishments.map((e: any) => <option key={e.id} value={e.id}>{e.businessName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Inspector</label>
                <input type="text" value={form.inspector} onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
                <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  {results.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.establishmentId || !form.scheduledDate}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> {editing ? 'Update' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
