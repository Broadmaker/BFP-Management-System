import { useState, useEffect } from 'react';
import { Search, Plus, X, Check, Shield, AlertTriangle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { ComplianceApi, EstablishmentsApi } from '../../lib/api';

const statusColors: Record<string, string> = {
  Open: 'bg-red-100 text-red-700',
  Resolved: 'bg-green-100 text-green-700',
  Overdue: 'bg-orange-100 text-orange-700',
};

const complianceStatusColors: Record<string, string> = {
  Compliant: 'bg-green-100 text-green-700',
  'Non-Compliant': 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  'Under Review': 'bg-blue-100 text-blue-700',
};

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function Compliance() {
  const [violations, setViolations] = useState<any[]>([]);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState<'violations' | 'establishments'>('violations');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ establishmentId: '', description: '', complianceDeadline: '', correctiveActions: '' });

  useEffect(() => {
    Promise.all([ComplianceApi.list(), EstablishmentsApi.list()]).then(([v, e]) => {
      setViolations(v);
      setEstablishments(e);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function saveViolation() {
    if (!form.establishmentId || !form.description) return;
    const created = await ComplianceApi.create({
      establishmentId: form.establishmentId,
      description: form.description,
      complianceDeadline: form.complianceDeadline || undefined,
      correctiveActions: form.correctiveActions || undefined,
    });
    setViolations((prev) => [created, ...prev]);
    setShowForm(false);
    setForm({ establishmentId: '', description: '', complianceDeadline: '', correctiveActions: '' });
  }

  async function updateViolationStatus(id: string, status: string) {
    const updated = await ComplianceApi.update(id, { status });
    setViolations((prev) => prev.map((v) => v.id === id ? { ...v, ...updated } : v));
    if (status === 'Resolved') {
      const v = violations.find((x) => x.id === id);
      if (v && v.establishmentId) {
        const est = establishments.find((e) => e.id === v.establishmentId);
        if (est && est.complianceStatus !== 'Compliant') {
          const updatedEst = await EstablishmentsApi.update(v.establishmentId, { complianceStatus: 'Compliant' });
          setEstablishments((prev) => prev.map((e) => e.id === v.establishmentId ? { ...e, ...updatedEst } : e));
        }
      }
    }
  }

  async function deleteViolation(id: string) {
    if (confirm('Delete this violation?')) {
      await ComplianceApi.delete(id);
      setViolations((prev) => prev.filter((v) => v.id !== id));
    }
  }

  async function updateEstablishmentStatus(id: string, status: string) {
    const updated = await EstablishmentsApi.update(id, { complianceStatus: status });
    setEstablishments((prev) => prev.map((e) => e.id === id ? { ...e, ...updated } : e));
  }

  function getEstName(v: any) {
    const est = establishments.find((e) => e.id === v.establishmentId);
    return est?.businessName || 'Unknown';
  }

  const filteredViolations = violations.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return getEstName(r).toLowerCase().includes(q) || r.description.toLowerCase().includes(q); }
    return true;
  });

  const filteredEst = establishments.filter((r) => {
    if (filter !== 'All' && r.complianceStatus !== filter) return false;
    if (search) { const q = search.toLowerCase(); return r.businessName.toLowerCase().includes(q) || r.ownerName.toLowerCase().includes(q); }
    return true;
  });

  const vCounts: Record<string, number> = { All: violations.length, Open: 0, Resolved: 0, Overdue: 0 };
  violations.forEach((v) => { if (vCounts[v.status] !== undefined) vCounts[v.status]++; });

  const eCounts: Record<string, number> = { All: establishments.length };
  ['Compliant', 'Non-Compliant', 'Pending', 'Under Review'].forEach((s) => { eCounts[s] = establishments.filter((e: any) => e.complianceStatus === s).length; });

  const highRisk = establishments.filter((e: any) => e.complianceStatus === 'Non-Compliant' || e.complianceStatus === 'Pending');

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Compliance</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Fire Code Compliance</h1>
          <p className="text-xs text-gray-400 mt-0.5">{establishments.length} establishments · {violations.length} violations</p>
        </div>
        {tab === 'violations' && (
          <button onClick={() => setShowForm(true)}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
            <Plus size={14} /> Record Violation
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Compliant</div>
              <div className="text-xl font-bold text-green-600 mt-1">{eCounts['Compliant']}</div>
              <div className="text-xs text-gray-400 mt-0.5">{establishments.length ? Math.round((eCounts['Compliant'] / establishments.length) * 100) : 0}% of total</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><CheckCircle size={16} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Non-Compliant</div>
              <div className="text-xl font-bold text-red-600 mt-1">{eCounts['Non-Compliant']}</div>
              <div className="text-xs text-red-500 mt-0.5">Requires attention</div>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><AlertTriangle size={16} className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Open Violations</div>
              <div className="text-xl font-bold text-orange-600 mt-1">{vCounts['Open'] + vCounts['Overdue']}</div>
              <div className="text-xs text-orange-500 mt-0.5">{vCounts['Overdue']} overdue</div>
            </div>
            <div className="p-2 rounded-lg bg-orange-50"><Clock size={16} className="text-orange-600" /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">High-Risk</div>
              <div className="text-xl font-bold text-gray-900 mt-1">{highRisk.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">Establishments</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-50"><Shield size={16} className="text-purple-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button onClick={() => { setTab('violations'); setFilter('All'); setSearch(''); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 ${tab === 'violations' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Violations
            </button>
            <button onClick={() => { setTab('establishments'); setFilter('All'); setSearch(''); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 ${tab === 'establishments' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Establishments
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {tab === 'violations' ? ['All', 'Open', 'Resolved', 'Overdue'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            )) : ['All', 'Compliant', 'Non-Compliant', 'Pending', 'Under Review'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={tab === 'violations' ? 'Search violations...' : 'Search establishments...'} value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>

        {tab === 'violations' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Establishment</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Violation</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Notice Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Corrective Actions</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredViolations.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{getEstName(v)}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-[200px] truncate">{v.description}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatDate(v.noticeDate)}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatDate(v.complianceDeadline)}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[200px] truncate">{v.correctiveActions || '—'}</td>
                    <td className="px-4 py-2.5">
                      <select value={v.status} onChange={(e) => updateViolationStatus(v.id, e.target.value)}
                        className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${statusColors[v.status]} cursor-pointer outline-none`}>
                        <option value="Open">Open</option><option value="Resolved">Resolved</option><option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => deleteViolation(v.id)} className="p-1 text-gray-400 hover:text-red-600"><X size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Barangay</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEst.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{e.businessName}</td>
                    <td className="px-4 py-2.5 text-gray-600">{e.ownerName}</td>
                    <td className="px-4 py-2.5 text-gray-600">{e.barangay}</td>
                    <td className="px-4 py-2.5 text-gray-600">{e.occupancyType}</td>
                    <td className="px-4 py-2.5">
                      <select value={e.complianceStatus} onChange={(e2) => updateEstablishmentStatus(e.id, e2.target.value)}
                        className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full border-0 ${complianceStatusColors[e.complianceStatus]} cursor-pointer outline-none`}>
                        <option value="Compliant">Compliant</option><option value="Non-Compliant">Non-Compliant</option>
                        <option value="Pending">Pending</option><option value="Under Review">Under Review</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => { const v = violations.find((x: any) => x.establishmentId === e.id); if (v) updateViolationStatus(v.id, 'Resolved'); }}
                        className="p-1 text-gray-400 hover:text-green-600" title="Mark as resolved"><Check size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Record Violation</h2>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Violation Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Describe the violation" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Compliance Deadline</label>
                <input type="date" value={form.complianceDeadline} onChange={(e) => setForm({ ...form, complianceDeadline: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Corrective Actions</label>
                <textarea value={form.correctiveActions} onChange={(e) => setForm({ ...form, correctiveActions: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Required corrective measures" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={saveViolation} disabled={!form.establishmentId || !form.description}
                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5">
                <Check size={14} /> Record
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">High-Risk Establishments</h3>
        <p className="text-xs text-gray-500 mb-3">Non-compliant or pending establishments requiring priority attention</p>
        {highRisk.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">All establishments are compliant.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {highRisk.map((e: any) => (
              <div key={e.id} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${e.complianceStatus === 'Non-Compliant' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                  <Building2 size={16} className={e.complianceStatus === 'Non-Compliant' ? 'text-red-500' : 'text-yellow-500'} />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-900">{e.businessName}</div>
                  <div className="text-[10px] text-gray-500">{e.occupancyType} · {e.barangay}</div>
                  <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${complianceStatusColors[e.complianceStatus]}`}>{e.complianceStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
