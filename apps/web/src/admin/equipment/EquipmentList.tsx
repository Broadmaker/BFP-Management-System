import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const STORAGE_KEY = 'bfp-equipment';
const SEED = [
  { id: '1', name: 'SCBA Set', category: 'Breathing Apparatus', serialNumber: 'SCBA-001', status: 'Operational', location: 'Ipil Station - Bay 1', purchaseDate: 'Jun 1, 2024', nextMaintenance: 'Aug 1, 2026' },
  { id: '2', name: 'Thermal Imaging Camera', category: 'Detection', serialNumber: 'TIC-001', status: 'Operational', location: 'Ipil Station - Bay 2', purchaseDate: 'Sep 15, 2024', nextMaintenance: 'Sep 15, 2026' },
  { id: '3', name: 'Portable Pump', category: 'Water Supply', serialNumber: 'PUMP-003', status: 'Under Maintenance', location: 'Workshop', purchaseDate: 'Nov 1, 2023', nextMaintenance: 'Jul 15, 2026' },
  { id: '4', name: 'Extrication Tools (Jaws of Life)', category: 'Rescue', serialNumber: 'EXT-001', status: 'Operational', location: 'Ipil Station - Bay 3', purchaseDate: 'Jan 20, 2025', nextMaintenance: 'Oct 20, 2026' },
  { id: '5', name: 'Generator 50kW', category: 'Power Supply', serialNumber: 'GEN-002', status: 'Operational', location: 'Ipil Station - Yard', purchaseDate: 'Apr 1, 2024', nextMaintenance: 'Aug 15, 2026' },
];

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return SEED;
}

const statusColors: Record<string, string> = {
  Operational: 'bg-green-100 text-green-700',
  'Under Maintenance': 'bg-yellow-100 text-yellow-700',
  'Out of Service': 'bg-red-100 text-red-700',
  Decommissioned: 'bg-gray-100 text-gray-500',
};

const categories = ['Breathing Apparatus', 'Detection', 'Water Supply', 'Rescue', 'Power Supply', 'Communication', 'Hose & Fittings', 'Hand Tools', 'Other'];
const statuses = ['Operational', 'Under Maintenance', 'Out of Service', 'Decommissioned'];

export default function EquipmentList() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', category: '', serialNumber: '', status: 'Operational', location: '', nextMaintenance: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.name || !form.category) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      const id = crypto.randomUUID();
      setItems((prev) => [{ id, ...form, purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: '', category: '', serialNumber: '', status: 'Operational', location: '', nextMaintenance: '' });
  }

  function edit(item: any) {
    setForm({ name: item.name, category: item.category, serialNumber: item.serialNumber || '', status: item.status, location: item.location || '', nextMaintenance: item.nextMaintenance || '' });
    setEditing(item); setShowForm(true);
  }

  function remove(id: string) { if (confirm('Delete this equipment?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.name.toLowerCase().includes(q) || r.serialNumber?.toLowerCase().includes(q) || r.category.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.status === s).length; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Equipment & Vehicles</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Equipment Inventory</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} items on record</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', category: '', serialNumber: '', status: 'Operational', location: '', nextMaintenance: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add Equipment
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
            <input type="text" placeholder="Search equipment..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Serial #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Next Maint.</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.category}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{r.serialNumber || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.location || '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.nextMaintenance || '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Equipment' : 'Add Equipment'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Serial Number</label>
                  <input type="text" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Next Maintenance Date</label>
                <input type="date" value={form.nextMaintenance} onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name || !form.category}
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
