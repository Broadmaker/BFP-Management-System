import { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { InspectionsApi, EstablishmentsApi } from '../../lib/api';

export default function InspectionReports() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([InspectionsApi.list(), EstablishmentsApi.list()])
      .then(([i, e]) => { setInspections(i); setEstablishments(e); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = inspections.length;
  const passed = inspections.filter((i) => i.result === 'Passed').length;
  const failed = inspections.filter((i) => i.result === 'Failed').length;
  const pending = inspections.filter((i) => i.result === 'Scheduled' || i.result === 'Pending Compliance').length;
  const passRate = total ? Math.round((passed / total) * 100) : 0;
  const uniqueEst = new Set(inspections.map((i: any) => i.establishmentId)).size;

  const resultCounts: Record<string, number> = {};
  inspections.forEach((i) => { resultCounts[i.result] = (resultCounts[i.result] || 0) + 1; });

  function estName(id: string) {
    const e = establishments.find((x: any) => x.id === id);
    return e?.businessName || id;
  }

  const topInspected = establishments
    .map((e: any) => ({
      name: e.businessName,
      count: inspections.filter((i: any) => i.establishmentId === e.id).length,
      status: e.complianceStatus,
    }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Safety Inspection</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Inspection Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Summary of all inspection activities</p>
        </div>
        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Total Inspections</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{total}</div>
          <div className="flex items-center gap-1 mt-1"><BarChart3 size={12} className="text-gray-400" /><span className="text-xs text-gray-400">All time</span></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Passed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{passed}</div>
          <div className="text-xs text-green-600 mt-1">{passRate}% pass rate</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Failed</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{failed}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{pending}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Establishments</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{uniqueEst}</div>
          <div className="text-xs text-gray-400 mt-1">Inspected</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Results Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(resultCounts).length === 0 && <p className="text-xs text-gray-400 text-center py-4">No inspection data yet.</p>}
            {Object.entries(resultCounts).map(([result, count]) => {
              const pct = total ? Math.round((count as number / total) * 100) : 0;
              const barColor =
                result === 'Passed' ? 'bg-green-500' :
                result === 'Failed' ? 'bg-red-500' :
                result === 'Reinspection Required' ? 'bg-orange-500' :
                result === 'Pending Compliance' ? 'bg-yellow-500' : 'bg-blue-500';
              return (
                <div key={result}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-700">{result}</span>
                    <span className="font-medium text-gray-900">{count as number} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Most Inspected Establishments</h3>
          <div className="space-y-2">
            {topInspected.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No inspections conducted yet.</p>}
            {topInspected.map((e: any) => (
              <div key={e.name} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">{e.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    e.status === 'Compliant' ? 'bg-green-100 text-green-700' : e.status === 'Non-Compliant' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{e.status}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{e.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900">Recent Inspections</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Establishment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody>
              {inspections.slice(0, 10).map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{estName(r.establishmentId)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{r.scheduledDate}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                      r.result === 'Passed' ? 'bg-green-100 text-green-700' :
                      r.result === 'Failed' ? 'bg-red-100 text-red-700' :
                      r.result === 'Reinspection Required' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{r.result}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
