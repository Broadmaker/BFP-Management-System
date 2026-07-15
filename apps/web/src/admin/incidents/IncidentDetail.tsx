import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Dispatch & Timeline', 'Documentation', 'Investigation'] as const;
type Tab = typeof tabs[number];

export default function IncidentDetail() {
  const [activeTab, setActiveTab] = useState<Tab>('Dispatch & Timeline');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Incident Management</div>
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="text-xl font-semibold text-gray-900">#BFP-4001</h1>
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/incidents" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to List
          </Link>
          <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Incident Type', value: 'Structural Fire', icon: FileText },
          { label: 'Severity', value: 'Critical', icon: AlertTriangle, badge: true },
          { label: 'Date Reported', value: 'Jul 13, 2026', icon: Calendar },
          { label: 'Location', value: 'National Highway, Ipil Heights', icon: MapPin },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">{item.label}</div>
            <div className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-2">
              {item.badge ? (
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">{item.value}</span>
              ) : item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-red-600 text-red-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Dispatch & Timeline' && (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="border border-gray-200 rounded-lg">
              <div className="px-4 py-2.5 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Assigned Units</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Unit</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Personnel</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { unit: 'BFP-101', type: 'Fire Engine', personnel: 6, status: 'On Scene', color: 'bg-green-100 text-green-700' },
                    { unit: 'BFP-205', type: 'Ladder Truck', personnel: 4, status: 'On Scene', color: 'bg-green-100 text-green-700' },
                    { unit: 'BFP-309', type: 'Ambulance', personnel: 2, status: 'En Route', color: 'bg-yellow-100 text-yellow-700' },
                  ].map((u) => (
                    <tr key={u.unit} className="border-b border-gray-100">
                      <td className="px-4 py-2 font-mono text-xs">{u.unit}</td>
                      <td className="px-4 py-2 text-gray-600">{u.type}</td>
                      <td className="px-4 py-2 text-gray-600">{u.personnel}</td>
                      <td className="px-4 py-2"><span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${u.color}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <div className="px-4 py-2.5 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { time: '14:22', event: 'Incident Reported via emergency hotline', label: 'Reported', color: 'bg-red-500' },
                  { time: '14:24', event: 'Dispatch — Units BFP-101, BFP-205 assigned', label: 'Dispatch', color: 'bg-yellow-500' },
                  { time: '14:28', event: 'Arrival — BFP-101 on scene', label: 'Arrival', color: 'bg-blue-500' },
                  { time: '14:35', event: 'Backup requested — BFP-309 ambulance assigned', label: 'Backup', color: 'bg-purple-500' },
                ].map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${entry.color} mt-1.5`} />
                      {i < 3 && <div className="w-px h-full bg-gray-200" />}
                    </div>
                    <div className="pb-3">
                      <div className="text-xs text-gray-500">{entry.time}</div>
                      <div className="text-sm text-gray-900">{entry.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Documentation' && (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Photos & Videos</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                    Scene {i}
                  </div>
                ))}
              </div>
              <button className="text-xs px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                + Add Photos
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <div className="px-4 py-2.5 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Witness Information</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Contact</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Statement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2 font-medium">Juan Dela Cruz</td>
                      <td className="px-4 py-2 text-gray-600">0917-123-4567</td>
                      <td className="px-4 py-2 text-xs text-gray-600">Saw smoke coming from the 2nd floor...</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Maria Santos</td>
                      <td className="px-4 py-2 text-gray-600">0928-234-5678</td>
                      <td className="px-4 py-2 text-xs text-gray-600">Heard explosions before fire started...</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Damage Assessment</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div><strong className="text-gray-900">Affected Area:</strong> 2nd floor, approx 120 sqm</div>
                  <div><strong className="text-gray-900">Structural Damage:</strong> Moderate — roof and walls affected</div>
                  <div><strong className="text-gray-900">Casualties:</strong> 2 minor injuries</div>
                  <div><strong className="text-gray-900">Estimated Value:</strong> PHP 500,000</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Investigation' && (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Investigation Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Investigator</label>
                  <div className="text-sm font-medium text-gray-900">FO3 Roberto Mendoza</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cause Classification</label>
                  <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md">
                    <option>Accidental</option>
                    <option>Electrical</option>
                    <option>Arson (Suspected)</option>
                    <option>Natural</option>
                    <option>Undetermined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Investigation Notes</label>
                  <textarea rows={4} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" defaultValue="Preliminary findings indicate the fire originated from an electrical panel on the 2nd floor." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Recommendations</label>
                  <textarea rows={3} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" placeholder="Recommend thorough electrical inspection..." />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Case Status</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded-full">Under Investigation</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date Opened</span><span className="text-gray-900">13 Jul 2026</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Target Closure</span><span className="text-gray-900">27 Jul 2026</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Assigned Unit</span><span className="text-gray-900">Investigation Team A</span></div>
              </div>
              <button className="mt-6 px-4 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                Mark as Closed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
