import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'bfp-incidents';

function loadItems() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

const COLORS = ['#dc2626', '#0ea5e9', '#eab308', '#22c55e', '#a855f7', '#f97316', '#6366f1', '#ec4899', '#14b8a6', '#78716c'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function IncidentReports() {
  const [incidents] = useState<any[]>(loadItems);

  const total = incidents.length;
  const critical = incidents.filter((i) => i.severity === 'Critical').length;
  const closed = incidents.filter((i) => i.status === 'Closed').length;
  const open = incidents.filter((i) => !i.status || i.status !== 'Closed').length;

  const typeMap: Record<string, number> = {};
  incidents.forEach((i) => { typeMap[i.type] = (typeMap[i.type] || 0) + 1; });
  const typeData = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  const sevMap: Record<string, number> = {};
  incidents.forEach((i) => { sevMap[i.severity] = (sevMap[i.severity] || 0) + 1; });
  const sevData = Object.entries(sevMap).map(([name, value]) => ({ name, value }));

  const statusMap: Record<string, number> = {};
  incidents.forEach((i) => { const s = i.status || 'New'; statusMap[s] = (statusMap[s] || 0) + 1; });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const monthMap: Record<string, number> = {};
  MONTHS.forEach(m => { monthMap[m] = 0; });
  incidents.forEach((i) => {
    if (i.date) {
      try { const d = new Date(i.date); monthMap[MONTHS[d.getMonth()]]++; } catch {}
    }
  });
  const trendData = MONTHS.map(m => ({ month: m, count: monthMap[m] }));

  const barangayMap: Record<string, number> = {};
  incidents.forEach((i) => { if (i.barangay) barangayMap[i.barangay] = (barangayMap[i.barangay] || 0) + 1; });
  const barangayData = Object.entries(barangayMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '...' : name, value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Reports & Analytics</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Incident Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Comprehensive incident data analysis</p>
        </div>
        <Link to="/admin/reports" className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents', value: total, icon: Activity, color: 'bg-blue-500' },
          { label: 'Critical', value: critical, icon: AlertTriangle, color: 'bg-red-500' },
          { label: 'Open / Active', value: open, icon: TrendingUp, color: 'bg-orange-500' },
          { label: 'Closed', value: closed, icon: TrendingDown, color: 'bg-emerald-500' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`}><k.icon size={15} className="text-white" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} /><stop offset="95%" stopColor="#dc2626" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#dc2626" fill="url(#incGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">By Incident Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" width={100} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {typeData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sevData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {sevData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Breakdown</h3>
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

        {barangayData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Incidents by Barangay (Top 8)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barangayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barangayData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
