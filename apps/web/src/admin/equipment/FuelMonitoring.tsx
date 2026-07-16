import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, Fuel, Gauge, TrendingDown } from 'lucide-react';
import { FuelApi, VehiclesApi } from '../../lib/api';

export default function FuelMonitoring() {
  const [items, setItems] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', liters: '', cost: '', mileage: '', remarks: '' });

  useEffect(() => {
    Promise.all([FuelApi.list(), VehiclesApi.list()])
      .then(([f, v]) => { setItems(f); setVehicles(v); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!form.vehicleId || !form.liters) return;
    const created = await FuelApi.create(form);
    setItems((prev) => [created, ...prev]);
    setShowForm(false);
    setForm({ vehicleId: '', liters: '', cost: '', mileage: '', remarks: '' });
  }

  async function remove(id: string) {
    if (confirm('Delete this fuel log?')) {
      await FuelApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  function vehicleName(id: string) {
    const v = vehicles.find((x: any) => x.id === id);
    return v ? `${v.name} (${v.plateNumber})` : id;
  }

  function plateNumber(id: string) {
    const v = vehicles.find((x: any) => x.id === id);
    return v?.plateNumber || '—';
  }

  const filtered = items.filter((r) => {
    if (search) { const q = search.toLowerCase(); return vehicleName(r.vehicleId).toLowerCase().includes(q); }
    return true;
  });

  const totalLiters = items.reduce((s: number, i: any) => s + Number(i.liters || 0), 0);
  const totalCost = items.reduce((s: number, i: any) => s + Number(i.cost || 0), 0);

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Equipment & Vehicles</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Fuel Monitoring</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} fuel logs</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Log Fuel
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Total Fuel (L)</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{totalLiters.toLocaleString()} L</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50"><Fuel size={16} className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Total Cost</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">₱{totalCost.toLocaleString()}</div>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><TrendingDown size={16} className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Vehicles Tracked</div>
              <div className="text-xl font-semibold text-gray-900 mt-1">{new Set(items.map((i: any) => i.vehicleId)).size}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><Gauge size={16} className="text-green-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm font-medium text-gray-900">Fuel Logs</div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search vehicle..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Plate #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Liters</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Mileage</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-600">{r.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{vehicleName(r.vehicleId)}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{plateNumber(r.vehicleId)}</td>
                  <td className="px-4 py-2.5 text-gray-900 font-medium">{Number(r.liters).toLocaleString()} L</td>
                  <td className="px-4 py-2.5 text-gray-600">₱{Number(r.cost || 0).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.mileage ? `${Number(r.mileage).toLocaleString()} km` : '—'}</td>
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
              <h2 className="text-base font-semibold text-gray-900">Log Fuel</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle <span className="text-red-500">*</span></label>
                <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select vehicle...</option>
                  {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.name} ({v.plateNumber})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Liters <span className="text-red-500">*</span></label>
                  <input type="number" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost (₱)</label>
                  <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mileage (km)</label>
                <input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.vehicleId || !form.liters}
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
