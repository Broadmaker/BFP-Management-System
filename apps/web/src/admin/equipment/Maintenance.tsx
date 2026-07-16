import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { MaintenanceApi, EquipmentApi, VehiclesApi } from '../../lib/api';

const typeColors: Record<string, string> = {
  Preventive: 'bg-blue-100 text-blue-700',
  Repair: 'bg-orange-100 text-orange-700',
};

export default function Maintenance() {
  const [items, setItems] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetType: 'equipment', assetId: '', type: 'Preventive', description: '', cost: '', nextScheduledDate: '' });

  useEffect(() => {
    Promise.all([MaintenanceApi.list(), EquipmentApi.list(), VehiclesApi.list()])
      .then(([r, e, v]) => { setItems(r); setEquipment(e); setVehicles(v); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!form.assetId || !form.type) return;
    const created = await MaintenanceApi.create(form);
    setItems((prev) => [created, ...prev]);
    setShowForm(false);
    setForm({ assetType: 'equipment', assetId: '', type: 'Preventive', description: '', cost: '', nextScheduledDate: '' });
  }

  async function remove(id: string) {
    if (confirm('Delete this maintenance record?')) {
      await MaintenanceApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.type !== filter) return false;
    if (search) { const q = search.toLowerCase(); return (r.description || '').toLowerCase().includes(q) || r.assetType?.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length, Preventive: 0, Repair: 0 };
  items.forEach((i) => { if (counts[i.type] !== undefined) counts[i.type]++; });

  const assets = form.assetType === 'equipment' ? equipment : vehicles;

  function assetName(id: string) {
    return equipment.find((e: any) => e.id === id)?.name || vehicles.find((v: any) => v.id === id)?.name || id;
  }

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Equipment & Vehicles</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Maintenance Records</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} total records</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Log Maintenance
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
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
            {['All', 'Preventive', 'Repair'].map((f) => (
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
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-600">{r.performedDate || r.date || '—'}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{assetName(r.assetId)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.description || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.cost ? `₱${Number(r.cost).toLocaleString()}` : '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">Log Maintenance</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Asset Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setForm({ ...form, assetType: 'equipment', assetId: '' }); }}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.assetType === 'equipment' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Equipment
                  </button>
                  <button onClick={() => { setForm({ ...form, assetType: 'vehicle', assetId: '' }); }}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.assetType === 'vehicle' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Vehicle
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Asset <span className="text-red-500">*</span></label>
                <select value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select {form.assetType}...</option>
                  {assets.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setForm({ ...form, type: 'Preventive' })}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.type === 'Preventive' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Preventive
                  </button>
                  <button onClick={() => setForm({ ...form, type: 'Repair' })}
                    className={`px-3 py-2 text-sm rounded-lg border ${form.type === 'Repair' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Repair
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost (₱)</label>
                  <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Next Schedule</label>
                  <input type="date" value={form.nextScheduledDate} onChange={(e) => setForm({ ...form, nextScheduledDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.assetId}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
