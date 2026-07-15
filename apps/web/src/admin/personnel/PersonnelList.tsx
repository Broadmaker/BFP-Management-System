import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, Users, GraduationCap } from 'lucide-react';

const STORAGE_KEY = 'bfp-personnel';
const SEED = [
  { id: 'BFP-001', name: 'SUPT Juan Dela Cruz', rank: 'SUPT', position: 'Station Commander', assignment: 'Ipil Station', contact: '0917-000-0001', status: 'Active' },
  { id: 'BFP-002', name: 'SINSP Maria Santos', rank: 'SINSP', position: 'Fire Officer', assignment: 'Inspection Division', contact: '0917-000-0002', status: 'Active' },
  { id: 'BFP-003', name: 'FO3 Roberto Mendoza', rank: 'FO3', position: 'Fire Officer', assignment: 'Operations', contact: '0917-000-0003', status: 'Active' },
  { id: 'BFP-004', name: 'FO1 Pedro Reyes', rank: 'FO1', position: 'Fire Officer', assignment: 'Operations', contact: '0917-000-0004', status: 'Active' },
  { id: 'BFP-005', name: 'Ana Gonzales', rank: 'NUP', position: 'Admin Officer', assignment: 'Admin Division', contact: '0917-000-0005', status: 'Active' },
  { id: 'BFP-006', name: 'Carlos Lim', rank: 'NUP', position: 'Logistics Officer', assignment: 'Logistics Division', contact: '0917-000-0006', status: 'Active' },
  { id: 'BFP-007', name: 'FO2 Jose Reyes', rank: 'FO2', position: 'Fire Fighter', assignment: 'Ipil Station', contact: '0917-000-0007', status: 'Active' },
  { id: 'BFP-008', name: 'FO1 Ana Cruz', rank: 'FO1', position: 'Fire Fighter', assignment: 'Ipil Station', contact: '0917-000-0008', status: 'Active' },
  { id: 'BFP-009', name: 'FO2 Mark Tan', rank: 'FO2', position: 'Driver', assignment: 'Ipil Station', contact: '0917-000-0009', status: 'Active' },
  { id: 'BFP-010', name: 'FO1 Lisa Mendoza', rank: 'FO1', position: 'EMT', assignment: 'Ipil Station', contact: '0917-000-0010', status: 'Active' },
];

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
  'On Leave': 'bg-yellow-100 text-yellow-700',
};

export default function PersonnelList() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', rank: '', position: '', assignment: '', contact: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const id = `BFP-${String(items.length + 1).padStart(3, '0')}`;
      setItems((prev) => [{ id, ...form, status: 'Active' }, ...prev]);
    }
    setShowForm(false); setEditing(null); setForm({ name: '', rank: '', position: '', assignment: '', contact: '' });
  }

  function edit(item: any) {
    setForm({ name: item.name, rank: item.rank, position: item.position, assignment: item.assignment, contact: item.contact });
    setEditing(item); setShowForm(true);
  }

  function remove(id: string) {
    if (confirm('Remove this personnel record?')) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function toggleStatus(item: any) {
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: i.status === 'Active' ? 'Inactive' : 'Active' } : i));
  }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.position.toLowerCase().includes(q); }
    return true;
  });

  const active = items.filter((i) => i.status === 'Active').length;
  const inactive = items.filter((i) => i.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Personnel & Shifts</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Personnel Records</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} personnel on record</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', rank: '', position: '', assignment: '', contact: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add Personnel
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Total Personnel</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{items.length}</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50"><Users size={16} className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Active</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{active}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><Check size={16} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Inactive</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{inactive}</div>
            </div>
            <div className="p-2 rounded-lg bg-gray-50"><X size={16} className="text-gray-400" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Assignments</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{new Set(items.map((i: any) => i.assignment)).size}</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-50"><GraduationCap size={16} className="text-purple-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {['All', 'Active', 'Inactive'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, ID, position..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Assignment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{r.id}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.rank || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.position}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.assignment}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.contact}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => toggleStatus(r)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[r.status] || 'bg-gray-100 text-gray-600'} cursor-pointer`}>
                      {r.status}
                    </button>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Personnel' : 'Add Personnel'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Rank + Full Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rank</label>
                  <select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select rank...</option>
                    <option>SUPT</option><option>SINSP</option><option>INSP</option>
                    <option>FO3</option><option>FO2</option><option>FO1</option><option>NUP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Fire Officer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assignment</label>
                  <input type="text" value={form.assignment} onChange={(e) => setForm({ ...form, assignment: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Division / Unit" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact # <span className="text-red-500">*</span></label>
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="09XX-XXX-XXXX" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || !form.position || !form.contact}
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
