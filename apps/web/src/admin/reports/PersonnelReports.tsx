import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { ReportsApi, PersonnelApi, AttendanceApi, LeaveApi } from '../../lib/api';

const COLORS = ['#0ea5e9', '#dc2626', '#eab308', '#22c55e', '#a855f7', '#f97316'];

export default function PersonnelReports() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leave, setLeave] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ReportsApi.personnel().catch(() => []),
      PersonnelApi.list().catch(() => []),
      AttendanceApi.list().catch(() => []),
      LeaveApi.list().catch(() => []),
    ]).then(([reportsPersonnel, pers, att, lv]: any[]) => {
      setPersonnel(reportsPersonnel.length ? reportsPersonnel : pers || []);
      setAttendance(att || []);
      setLeave(lv || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = personnel.length;
  const active = personnel.filter((p) => p.isActive !== false).length;
  const onLeave = leave.filter((l) => l.status === 'Approved' && (!l.endDate || new Date(l.endDate) >= new Date())).length;

  const attMap: Record<string, number> = {};
  attendance.forEach((a) => { attMap[a.type] = (attMap[a.type] || 0) + 1; });
  const attData = Object.entries(attMap).map(([name, value]) => ({ name, value }));

  const leaveMap: Record<string, number> = {};
  leave.forEach((l) => { leaveMap[l.type] = (leaveMap[l.type] || 0) + 1; });
  const leaveData = Object.entries(leaveMap).map(([name, value]) => ({ name, value }));

  const leaveStatusMap: Record<string, number> = {};
  leave.forEach((l) => { const s = l.status || 'Pending'; leaveStatusMap[s] = (leaveStatusMap[s] || 0) + 1; });
  const leaveStatusData = Object.entries(leaveStatusMap).map(([name, value]) => ({ name, value }));

  const rankMap: Record<string, number> = {};
  personnel.forEach((p) => { if (p.rank) rankMap[p.rank] = (rankMap[p.rank] || 0) + 1; });
  const rankData = Object.entries(rankMap).map(([name, value]) => ({ name, value }));

  const presentCount = attendance.filter((a) => a.type === 'Present').length;
  const absentCount = attendance.filter((a) => a.type === 'Absent').length;
  const lateCount = attendance.filter((a) => a.type === 'Late').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Reports & Analytics</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Personnel Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Workforce analytics and attendance insights</p>
        </div>
        <Link to="/admin/reports" className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Personnel', value: total, icon: Users, color: 'bg-blue-500' },
          { label: 'Active', value: active, icon: UserCheck, color: 'bg-emerald-500' },
          { label: 'On Leave', value: onLeave, icon: UserX, color: 'bg-orange-500' },
          { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: Clock, color: 'bg-purple-500' },
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
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={attData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {attData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="flex items-center justify-center h-[250px] gap-8">
            {[
              { label: 'Present', value: presentCount, color: 'bg-emerald-500' },
              { label: 'Absent', value: absentCount, color: 'bg-red-500' },
              { label: 'Late', value: lateCount, color: 'bg-yellow-500' },
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

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Leave Requests by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leaveStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {leaveStatusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Leave by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leaveData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {leaveData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {rankData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Personnel by Rank</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {rankData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
