import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { EstablishmentsApi } from '../../lib/api';

const statusColors: Record<string, string> = {
  Compliant: 'bg-green-100 text-green-700',
  'Non-Compliant': 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  'Under Review': 'bg-blue-100 text-blue-700',
};

const statuses = ['Compliant', 'Non-Compliant', 'Pending', 'Under Review'];
const occupancyTypes = ['Commercial', 'Residential', 'Institutional', 'Industrial', 'Open Area', 'Mixed-Use'];

export default function Establishments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' });

  useEffect(() => {
    EstablishmentsApi.list().then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function save() {
    if (!form.businessName || !form.ownerName || !form.address || !form.barangay || !form.occupancyType) return;
    if (editing) {
      const updated = await EstablishmentsApi.update(editing.id, form);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...updated } : i));
    } else {
      const created = await EstablishmentsApi.create(form);
      setItems((prev) => [created, ...prev]);
    }
    setShowForm(false); setEditing(null);
    setForm({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' });
  }

  function edit(item: any) {
    setForm({ businessName: item.businessName, ownerName: item.ownerName, ownerContact: item.ownerContact || '', address: item.address, barangay: item.barangay, occupancyType: item.occupancyType, classification: item.classification || '' });
    setEditing(item); setShowForm(true);
  }

  async function remove(id: string) {
    if (confirm('Delete this establishment?')) {
      await EstablishmentsApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function updateStatus(id: string, status: string) {
    const updated = await EstablishmentsApi.update(id, { complianceStatus: status });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updated } : i));
  }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.complianceStatus !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.businessName.toLowerCase().includes(q) || r.ownerName.toLowerCase().includes(q) || r.barangay.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length };
  statuses.forEach((s) => { counts[s] = items.filter((i) => i.complianceStatus === s).length; });

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Safety Inspection</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Establishments</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} registered establishments</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ businessName: '', ownerName: '', ownerContact: '', address: '', barangay: '', occupancyType: 'Commercial', classification: '' }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Add Establishment
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
            <input type="text" placeholder="Search establishments..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Business Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Barangay</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Classification</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.businessName}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-gray-900">{r.ownerName}</div>
                    <div className="text-xs text-gray-400">{r.ownerContact}</div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{r.barangay}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.occupancyType}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.classification || '—'}</td>
                  <td className="px-4 py-2.5">
                    <select value={r.complianceStatus} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.complianceStatus]} cursor-pointer outline-none`}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit Establishment' : 'Add Establishment'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Owner Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact #</label>
                  <input type="text" value={form.ownerContact} onChange={(e) => setForm({ ...form, ownerContact: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barangay <span className="text-red-500">*</span></label>
                  <input type="text" value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Occupancy Type <span className="text-red-500">*</span></label>
                  <select value={form.occupancyType} onChange={(e) => setForm({ ...form, occupancyType: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    {occupancyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Classification</label>
                <input type="text" value={form.classification} onChange={(e) => setForm({ ...form, classification: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Retail, Food Service, Educational" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.businessName || !form.ownerName || !form.address || !form.barangay}
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
