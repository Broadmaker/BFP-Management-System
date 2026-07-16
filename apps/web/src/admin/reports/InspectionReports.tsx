import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowLeft, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ReportsApi, EstablishmentsApi, CertificatesApi } from '../../lib/api';

const COLORS = ['#22c55e', '#dc2626', '#eab308', '#a855f7', '#0ea5e9', '#f97316'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function InspectionReports() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ReportsApi.inspections(),
      EstablishmentsApi.list(),
      CertificatesApi.list(),
    ]).then(([insp, est, cert]: any[]) => {
      setInspections(insp || []);
      setEstablishments(est || []);
      setCertificates(cert || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = inspections.length;
  const passed = inspections.filter((i) => i.result === 'Passed').length;
  const failed = inspections.filter((i) => i.result === 'Failed').length;
  const pending = inspections.filter((i) => !i.result || i.result === 'Pending Compliance' || i.result === 'Reinspection Required').length;
  const activeCertificates = certificates.filter((c) => c.status === 'Active').length;
  const compliant = establishments.filter((e) => e.complianceStatus === 'Compliant').length;
  const nonCompliant = establishments.filter((e) => e.complianceStatus === 'Non-Compliant').length;

  const resultMap: Record<string, number> = {};
  inspections.forEach((i) => { const r = i.result || 'Pending'; resultMap[r] = (resultMap[r] || 0) + 1; });
  const resultData = Object.entries(resultMap).map(([name, value]) => ({ name, value }));

  const monthMap: Record<string, number> = {};
  MONTHS.forEach(m => { monthMap[m] = 0; });
  inspections.forEach((i) => {
    if (i.completedDate || i.scheduledDate) {
      try { const d = new Date(i.completedDate || i.scheduledDate); monthMap[MONTHS[d.getMonth()]]++; } catch {}
    }
  });
  const trendData = MONTHS.map(m => ({ month: m, count: monthMap[m] }));

  const statusData = [
    { name: 'Compliant', value: compliant },
    { name: 'Non-Compliant', value: nonCompliant },
    { name: 'Pending', value: establishments.length - compliant - nonCompliant },
  ];

  const certStatus = [
    { name: 'Active', value: activeCertificates },
    { name: 'Expired', value: certificates.filter((c) => c.status === 'Expired').length },
    { name: 'Revoked', value: certificates.filter((c) => c.status === 'Revoked').length },
  ];

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Reports & Analytics</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Inspection Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fire safety inspection analytics</p>
        </div>
        <Link to="/admin/reports" className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Inspections', value: total, icon: Building2, color: 'bg-blue-500' },
          { label: 'Passed', value: passed, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Failed', value: failed, icon: XCircle, color: 'bg-red-500' },
          { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-500' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`}>
                <k.icon size={15} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Inspection Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="inspGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#inspGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inspection Results</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={resultData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {resultData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Establishment Compliance Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Certificate Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={certStatus} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {certStatus.map((_, idx) => <Cell key={idx} fill={['#22c55e', '#dc2626', '#eab308'][idx % 3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
