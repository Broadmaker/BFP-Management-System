import { useState, useEffect } from 'react';
import { Plus, X, Check, ChevronLeft, ChevronRight, Sun, Moon, Coffee } from 'lucide-react';

const STORAGE_KEY = 'bfp-duty-roster';
const PERSONNEL_KEY = 'bfp-personnel';

function loadRoster() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function loadPersonnel() {
  try { const raw = localStorage.getItem(PERSONNEL_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

const shiftMeta: Record<string, { icon: any; color: string }> = {
  Day: { icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  Night: { icon: Moon, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  Off: { icon: Coffee, color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DutyRoster() {
  const [roster, setRoster] = useState<any[]>(loadRoster);
  const [personnel] = useState<any[]>(loadPersonnel);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ personnelId: '', shiftType: 'Day', startTime: '08:00', endTime: '20:00', notes: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(roster)); }, [roster]);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay());

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  function getShift(personId: string, date: Date) {
    const ds = formatDate(date);
    return roster.find((s: any) => s.personnelId === personId && s.date === ds);
  }

  function save() {
    if (!form.personnelId || !form.shiftType) return;
    const dateStr = formatDate(weekDates[0]);
    setRoster((prev) => {
      const existing = prev.findIndex((s: any) => s.personnelId === form.personnelId && s.date === dateStr);
      const entry = { ...form, date: dateStr, id: form.personnelId + '-' + dateStr };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...entry };
        return updated;
      }
      return [...prev, entry];
    });
    setShowForm(false);
    setForm({ personnelId: '', shiftType: 'Day', startTime: '08:00', endTime: '20:00', notes: '' });
  }

  function removeShift(personId: string, date: Date) {
    const ds = formatDate(date);
    setRoster((prev) => prev.filter((s: any) => !(s.personnelId === personId && s.date === ds)));
  }

  const activePersonnel = personnel.filter((p: any) => p.status === 'Active');
  const ShiftIcon = ({ type }: { type: string }) => {
    const Icon = shiftMeta[type]?.icon;
    return Icon ? <Icon size={12} /> : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Personnel & Shifts</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Duty Roster</h1>
          <p className="text-xs text-gray-400 mt-0.5">Weekly shift schedule — {todayStr()}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-1 hover:text-gray-900"><ChevronLeft size={16} /></button>
            <span className="font-medium text-gray-900 min-w-[140px] text-center">
              {formatDate(weekDates[0])} — {formatDate(weekDates[6])}
            </span>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1 hover:text-gray-900"><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => setShowForm(true)}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
            <Plus size={14} /> Assign Shift
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Personnel</th>
              {weekDates.map((d, i) => (
                <th key={i} className={`text-center px-2 py-2.5 text-xs font-medium min-w-[100px] ${d.toDateString() === today.toDateString() ? 'text-red-600' : 'text-gray-500 uppercase'}`}>
                  <div>{weekdays[d.getDay()]}</div>
                  <div className={`text-sm font-semibold ${d.toDateString() === today.toDateString() ? 'text-red-600' : 'text-gray-900'}`}>{d.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activePersonnel.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">No active personnel. Add personnel records first.</td></tr>
            )}
            {activePersonnel.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 sticky left-0 bg-white border-r border-gray-100 z-10">
                  <div className="font-medium text-gray-900 text-xs">{p.name}</div>
                  <div className="text-[10px] text-gray-400">{p.position}</div>
                </td>
                {weekDates.map((d, i) => {
                  const shift = getShift(p.id, d);
                  const isToday = d.toDateString() === today.toDateString();
                  return (
                    <td key={i} className={`text-center px-2 py-2 ${isToday ? 'bg-red-50/30' : ''}`}>
                      {shift ? (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium ${shiftMeta[shift.shiftType]?.color || 'bg-gray-100'}`}>
                          <ShiftIcon type={shift.shiftType} />
                          {shift.shiftType}
                          {shift.startTime && shift.shiftType !== 'Off' && (
                            <span className="text-[10px] opacity-75">{shift.startTime}-{shift.endTime}</span>
                          )}
                          <button onClick={() => removeShift(p.id, d)} className="ml-0.5 hover:text-red-600"><X size={10} /></button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Sun size={12} className="text-amber-500" /> Day</span>
        <span className="flex items-center gap-1"><Moon size={12} className="text-indigo-500" /> Night</span>
        <span className="flex items-center gap-1"><Coffee size={12} className="text-gray-400" /> Off</span>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Assign Shift</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Personnel <span className="text-red-500">*</span></label>
                <select value={form.personnelId} onChange={(e) => setForm({ ...form, personnelId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select personnel...</option>
                  {activePersonnel.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shift Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['Day', 'Night', 'Off'].map((t) => (
                    <button key={t} onClick={() => setForm({ ...form, shiftType: t })}
                      className={`px-3 py-2 text-sm rounded-lg border ${form.shiftType === t ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {form.shiftType !== 'Off' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                    <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                    <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Optional" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.personnelId}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
