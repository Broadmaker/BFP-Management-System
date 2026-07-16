import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, AlertTriangle, Building2, Truck, Flame } from 'lucide-react';
import { ReportsApi } from '../../lib/api';

const COLORS = ['#dc2626', '#0ea5e9', '#eab308', '#22c55e', '#a855f7', '#f97316', '#6366f1', '#ec4899'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type KPI = { label: string; value: number; icon: any; color: string; trend: 'up' | 'down' | 'neutral'; pct: string; link: string };

export default function ReportsDashboard() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ReportsApi.overview(), ReportsApi.incidents(), ReportsApi.inspections()])
      .then(([overview, incidents, inspections]: any[]) => {
        const typeMap: Record<string, number> = {};
        (incidents || []).forEach((i: any) => { typeMap[i.type] = (typeMap[i.type] || 0) + 1; });
        const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

        const sevMap: Record<string, number> = {};
        (incidents || []).forEach((i: any) => { sevMap[i.severity] = (sevMap[i.severity] || 0) + 1; });
        const sevData = Object.entries(sevMap).map(([name, value]) => ({ name, value }));

        const monthMap: Record<string, number> = {};
        MONTHS.forEach(m => { monthMap[m] = 0; });
        (incidents || []).forEach((i: any) => {
          if (i.date) {
            try { const d = new Date(i.date); monthMap[MONTHS[d.getMonth()]]++; } catch {}
          }
        });
        const trendData = MONTHS.map(m => ({ month: m, incidents: monthMap[m] || 0 }));

        const passCount = (inspections || []).filter((i: any) => i.result === 'Passed').length;
        const failCount = (inspections || []).filter((i: any) => i.result === 'Failed').length;
        const pendingInsp = (inspections || []).filter((i: any) => !i.result || i.result === 'Pending Compliance' || i.result === 'Reinspection Required').length;

        setData({ overview, incidents, inspections, typeData, sevData, trendData, passCount, failCount, pendingInsp });
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const kpis: KPI[] = [
    { label: 'Total Incidents', value: data.overview?.incidentsCount ?? (data.incidents?.length || 0), icon: Flame, color: 'bg-red-500', trend: 'up', pct: '+12%', link: '/admin/reports/incidents' },
    { label: 'Open Violations', value: data.overview?.openViolations ?? 0, icon: AlertTriangle, color: 'bg-orange-500', trend: 'up', pct: '+3%', link: '/admin/compliance' },
    { label: 'Active Personnel', value: data.overview?.activePersonnel ?? 0, icon: Users, color: 'bg-blue-500', trend: 'up', pct: '+5%', link: '/admin/reports/personnel' },
    { label: 'Inspections Done', value: data.overview?.inspectionsCount ?? (data.inspections?.length || 0), icon: Building2, color: 'bg-emerald-500', trend: 'down', pct: '+8%', link: '/admin/reports/inspections' },
    { label: 'Equipment', value: data.overview?.equipmentCount ?? 0, icon: Activity, color: 'bg-purple-500', trend: 'neutral', pct: '0%', link: '/admin/equipment' },
    { label: 'Vehicles', value: data.overview?.vehiclesCount ?? 0, icon: Truck, color: 'bg-cyan-500', trend: 'neutral', pct: '0%', link: '/admin/vehicles' },
  ];

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Reports & Analytics</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Reports Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Overview of all station operations</p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {kpis.map((k) => (
          <Link key={k.label} to={k.link} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${k.color} rounded-lg flex items-center justify-center`}>
                <k.icon size={15} className="text-white" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${k.trend === 'up' ? 'text-red-500' : k.trend === 'down' ? 'text-green-500' : 'text-gray-400'}`}>
                {k.trend === 'up' ? <TrendingUp size={12} /> : k.trend === 'down' ? <TrendingDown size={12} /> : null}
                {k.pct}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Incident Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.trendData}>
              <defs>
                <linearGradient id="incidentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="incidents" stroke="#dc2626" fill="url(#incidentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Incidents by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.typeData?.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Incident Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.sevData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.sevData?.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inspection Results</h3>
          <div className="flex items-center justify-center h-[250px] gap-8">
            {[
              { label: 'Passed', value: data.passCount, color: 'bg-emerald-500' },
              { label: 'Failed', value: data.failCount, color: 'bg-red-500' },
              { label: 'Pending', value: data.pendingInsp, color: 'bg-yellow-500' },
            ].map((i) => (
              <div key={i.label} className="text-center">
                <div className={`w-20 h-20 ${i.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-2xl font-bold text-white">{i.value}</span>
                </div>
                <div className="text-xs text-gray-500">{i.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
