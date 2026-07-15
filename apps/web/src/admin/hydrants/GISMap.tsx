import { useState } from 'react';
import { Search, MapPin, Droplets, Circle } from 'lucide-react';

const HYDRANT_KEY = 'bfp-hydrants';

function loadHydrants() {
  try { const raw = localStorage.getItem(HYDRANT_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

const statusColors: Record<string, string> = {
  Operational: 'text-green-600 bg-green-100 border-green-300',
  'Under Repair': 'text-yellow-600 bg-yellow-100 border-yellow-300',
  'Out of Service': 'text-red-600 bg-red-100 border-red-300',
};

export default function GISMap() {
  const [hydrants] = useState<any[]>(loadHydrants);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState('');

  const filtered = hydrants.filter((h) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return h.hydrantId.toLowerCase().includes(q) || h.barangay.toLowerCase().includes(q) || h.street?.toLowerCase().includes(q);
  });

  const operational = hydrants.filter((h) => h.status === 'Operational').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Fire Hydrants</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">GIS Map</h1>
          <p className="text-xs text-gray-400 mt-0.5">{hydrants.length} hydrants mapped · {operational} operational</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Total Hydrants</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{hydrants.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Operational</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{operational}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Under Repair / Out</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{hydrants.length - operational}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Hydrant Map View</div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 p-4">
              <div className="text-xs text-gray-400 mb-4">
                <MapPin size={14} className="inline mr-1" />
                Ipil, Zamboanga Sibugay — {filtered.length} hydrants
              </div>
              <div className="relative w-full h-[400px] bg-blue-50/50 rounded-lg border border-blue-100">
                {filtered.map((h: any) => {
                  if (!h.gpsLatitude || !h.gpsLongitude) return null;
                  const lat = parseFloat(h.gpsLatitude);
                  const lng = parseFloat(h.gpsLongitude);
                  const baseLat = 7.784;
                  const baseLng = 122.585;
                  const x = ((lng - baseLng) * 8000 + 200) % 540;
                  const y = ((baseLat - lat) * 8000 + 200) % 320;
                  const isOperational = h.status === 'Operational';
                  return (
                    <button key={h.id}
                      onClick={() => setSelected(h)}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center border-2 cursor-pointer transition-transform hover:scale-110 ${
                        isOperational ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                      } ${selected?.id === h.id ? 'ring-2 ring-offset-1 ring-red-500 scale-110' : ''}`}
                      title={`${h.hydrantId} - ${h.status}`}>
                      <Droplets size={14} className={isOperational ? 'text-green-600' : 'text-red-500'} />
                    </button>
                  );
                })}
                <div className="absolute bottom-3 left-3 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded">
                  <Circle size={6} className="inline fill-green-500 text-green-500 mr-1" />Operational
                  <Circle size={6} className="inline fill-red-500 text-red-500 ml-3 mr-1" />Non-Operational
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="space-y-1 max-h-[280px] overflow-y-auto">
              {filtered.map((h: any) => (
                <button key={h.id} onClick={() => setSelected(h)}
                  className={`w-full text-left p-2 rounded-lg text-xs border transition-colors ${
                    selected?.id === h.id ? 'border-red-300 bg-red-50' : 'border-transparent hover:bg-gray-50'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-gray-900">{h.hydrantId}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      h.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{h.status}</span>
                  </div>
                  <div className="text-gray-500 mt-1">{h.barangay}{h.street ? `, ${h.street}` : ''}</div>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 font-mono">{selected.hydrantId}</h3>
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Barangay</span><span className="text-gray-900 font-medium">{selected.barangay}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Street</span><span className="text-gray-900">{selected.street || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pressure</span><span className="text-gray-900 font-medium">{selected.waterPressure ? `${selected.waterPressure} PSI` : '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ownership</span><span className="text-gray-900">{selected.ownership}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GPS</span><span className="text-gray-900 font-mono text-[10px]">{selected.gpsLatitude}, {selected.gpsLongitude}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last Inspected</span><span className="text-gray-900">{selected.lastInspected || '—'}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
