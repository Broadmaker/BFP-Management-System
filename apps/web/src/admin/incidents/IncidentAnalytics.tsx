import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

const frequencyData = [
  { month: 'Jan', thisYear: 18, lastYear: 22 },
  { month: 'Feb', thisYear: 24, lastYear: 20 },
  { month: 'Mar', thisYear: 22, lastYear: 26 },
  { month: 'Apr', thisYear: 31, lastYear: 28 },
  { month: 'May', thisYear: 28, lastYear: 32 },
  { month: 'Jun', thisYear: 35, lastYear: 30 },
  { month: 'Jul', thisYear: 42, lastYear: 28 },
  { month: 'Aug', thisYear: 38, lastYear: 34 },
  { month: 'Sep', thisYear: 30, lastYear: 36 },
  { month: 'Oct', thisYear: 26, lastYear: 30 },
  { month: 'Nov', thisYear: 24, lastYear: 28 },
  { month: 'Dec', thisYear: 20, lastYear: 26 },
];

const typeData = [
  { name: 'Structural Fire', value: 110, color: '#dc2626' },
  { name: 'Medical Emergency', value: 65, color: '#0ea5e9' },
  { name: 'Vehicle Fire', value: 48, color: '#eab308' },
  { name: 'Rescue Operation', value: 42, color: '#22c55e' },
  { name: 'False Alarm', value: 38, color: '#a855f7' },
  { name: 'HazMat', value: 24, color: '#ef4444' },
  { name: 'Other', value: 15, color: '#9ca3af' },
];

const responseTimeData = [
  { severity: 'Critical', minutes: 3.2 },
  { severity: 'Major', minutes: 4.5 },
  { severity: 'Moderate', minutes: 5.8 },
  { severity: 'Minor', minutes: 7.1 },
];

const trendData = [
  { month: 'Jan', critical: 4, nonCritical: 14 },
  { month: 'Feb', critical: 6, nonCritical: 18 },
  { month: 'Mar', critical: 5, nonCritical: 17 },
  { month: 'Apr', critical: 8, nonCritical: 23 },
  { month: 'May', critical: 7, nonCritical: 21 },
  { month: 'Jun', critical: 9, nonCritical: 26 },
  { month: 'Jul', critical: 11, nonCritical: 31 },
  { month: 'Aug', critical: 10, nonCritical: 28 },
  { month: 'Sep', critical: 8, nonCritical: 22 },
  { month: 'Oct', critical: 6, nonCritical: 20 },
  { month: 'Nov', critical: 5, nonCritical: 19 },
  { month: 'Dec', critical: 4, nonCritical: 16 },
];

export default function IncidentAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Incident Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Incident Analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/incidents" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <ArrowLeft size={14} /> Incidents List
          </Link>
          <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1.5">
            <Download size={14} /> Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents (YTD)', value: '342', change: '-5%', down: true },
          { label: 'Avg Response Time', value: '4.8min', change: '-12s', down: true },
          { label: 'Most Common Type', value: 'Structural Fire', sub: '32% of all incidents' },
          { label: 'Response Rate', value: '88%', sub: 'Within target time' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className="text-xl font-semibold text-gray-900 mt-1">{stat.value}</div>
            <div className={`text-xs mt-0.5 ${stat.down ? 'text-green-600' : 'text-gray-400'}`}>
              {stat.change} {stat.sub || 'year over year'}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Incident Frequency</h2>
          <p className="text-xs text-gray-500 mb-4">Year-to-date incidents by month</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frequencyData}>
                <CartesianGrid strokeDasharray="4 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="thisYear" stroke="#dc2626" strokeWidth={2} dot={false} name="This Year" />
                <Line type="monotone" dataKey="lastYear" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Last Year" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">By Incident Type</h2>
          <p className="text-xs text-gray-500 mb-4">Distribution this year</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="flex-1 text-gray-600">{item.name}</span>
                <span className="text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Response Time Trends</h2>
          <p className="text-xs text-gray-500 mb-4">Average response time by severity (minutes)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="4 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="severity" type="category" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="minutes" radius={[0, 4, 4, 0]} barSize={20}>
                  <Cell fill="#dc2626" />
                  <Cell fill="#eab308" />
                  <Cell fill="#0ea5e9" />
                  <Cell fill="#22c55e" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Monthly Trends</h2>
          <p className="text-xs text-gray-500 mb-4">Critical vs Non-Critical incidents</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="4 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#dc2626" fill="#fecaca" name="Critical" />
                <Area type="monotone" dataKey="nonCritical" stackId="1" stroke="#0ea5e9" fill="#bae6fd" name="Non-Critical" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
