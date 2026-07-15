import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';

const STORAGE_KEY = 'bfp-certificates';
const ESTABLISHMENT_KEY = 'bfp-establishments';

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function loadEstablishments() {
  try { const raw = localStorage.getItem(ESTABLISHMENT_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Expired: 'bg-red-100 text-red-700',
  Revoked: 'bg-gray-100 text-gray-500',
};

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function isExpired(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function Certificates() {
  const [items, setItems] = useState<any[]>(loadItems);
  const [establishments] = useState<any[]>(loadEstablishments);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ establishmentId: '', certificateNumber: '', issuedDate: '', expiryDate: '' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function save() {
    if (!form.establishmentId || !form.certificateNumber || !form.issuedDate || !form.expiryDate) return;
    const est = establishments.find((e: any) => e.id === form.establishmentId);
    const id = crypto.randomUUID();
    setItems((prev) => [{ id, ...form, establishmentName: est?.businessName || 'Unknown', status: isExpired(form.expiryDate) ? 'Expired' : 'Active' }, ...prev]);
    setShowForm(false);
    setForm({ establishmentId: '', certificateNumber: '', issuedDate: '', expiryDate: '' });
  }

  function updateStatus(id: string, status: string) { setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i)); }

  function remove(id: string) { if (confirm('Delete this certificate?')) setItems((prev) => prev.filter((i) => i.id !== id)); }

  const filtered = items.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.establishmentName?.toLowerCase().includes(q) || r.certificateNumber.toLowerCase().includes(q); }
    return true;
  });

  const counts: Record<string, number> = { All: items.length, Active: 0, Expired: 0, Revoked: 0 };
  items.forEach((i) => { if (counts[i.status] !== undefined) counts[i.status]++; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Safety Inspection</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Certificates (FSIC)</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} certificates issued</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Plus size={14} /> Issue Certificate
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
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
            {['All', 'Active', 'Expired', 'Revoked'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by establishment or cert #..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Certificate #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Establishment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Issued</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-900 font-semibold">{r.certificateNumber}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.establishmentName}</td>
                  <td className="px-4 py-2.5 text-gray-600">{formatDate(r.issuedDate)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{formatDate(r.expiryDate)}</td>
                  <td className="px-4 py-2.5">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[r.status]} cursor-pointer outline-none`}>
                      <option value="Active">Active</option><option value="Expired">Expired</option><option value="Revoked">Revoked</option>
                    </select>
                  </td>
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
              <h2 className="text-base font-semibold text-gray-900">Issue FSIC Certificate</h2>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Certificate # <span className="text-red-500">*</span></label>
                <input type="text" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. FSIC-2026-0001" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Issued Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.issuedDate} onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.establishmentId || !form.certificateNumber || !form.issuedDate || !form.expiryDate}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
