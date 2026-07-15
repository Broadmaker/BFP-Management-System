import { useState } from 'react';
import { CheckCircle, AlertTriangle, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'bfp-hazard-reports';

function loadReports() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function makeId() { return `HAZ-${Date.now().toString(36).toUpperCase().slice(-5)}`; }

const hazardTypes = [
  'Unattended open burning',
  'Overloaded electrical outlet',
  'Blocked fire exit',
  'Improper LPG tank storage',
  'Accumulated combustible materials',
  'Defective wiring',
  'Chemical spill',
  'Suspected gas leak',
  'Other',
];

const barangays = ['Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil', 'Sanito', 'Makilas', 'Lumbia', 'Labi', 'Taway'];

export default function PublicHazards() {
  const [form, setForm] = useState({ type: 'Unattended open burning', location: '', barangay: 'Poblacion', description: '', reporter: '', contact: '' });
  const [submitted, setSubmitted] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoName, setPhotoName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const reports = loadReports();
      const id = makeId();
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      reports.unshift({ id, ...form, date, status: 'New', priority: 'Medium' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      setSubmitted(id);
      setForm({ type: 'Unattended open burning', location: '', barangay: 'Poblacion', description: '', reporter: '', contact: '' });
      setPhotoName('');
      setLoading(false);
    }, 800);
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} />
            </div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Report Submitted</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Hazard report received</h2>
            <p className="text-sm text-gray-500 mb-4">Your reference number:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
              <div className="text-xs text-gray-500 mb-1">Reference Number</div>
              <div className="text-2xl font-bold text-red-700 font-mono tracking-wider">{submitted}</div>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              An inspector will be assigned to verify the hazard. Use this reference number for follow-ups.
            </p>
            <button onClick={() => setSubmitted('')} className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
              Report Another Hazard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="text-xs text-gray-400 mb-1">
        <Link to="/public" className="hover:text-red-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Report a Hazard</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report a Fire Hazard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Help keep your community safe. Report fire hazards in Ipil, Zamboanga Sibugay for investigation and action.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Hazard Report Form</h2>
            <p className="text-xs text-gray-500 mt-0.5">Provide details about the fire hazard you observed.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                {hazardTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address <span className="text-red-500">*</span></label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Street, Barangay, Ipil, Zamboanga Sibugay" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay <span className="text-red-500">*</span></label>
                <select value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  {barangays.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
                <label className="flex items-center justify-center w-full h-10 border-2 border-gray-300 border-dashed rounded-lg text-sm text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhotoName(e.target.files?.[0]?.name || '')} />
                  {photoName || 'Upload photo'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe the hazard in detail. Include specific location markers if possible." />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (optional)</label>
                <input type="text" value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Anonymous if left blank" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number (optional)</label>
                <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>For ongoing fires or life-threatening emergencies, call 160 immediately.</strong> Do not use this form for emergencies.
            </div>

            <button type="submit" disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? 'Submitting...' : <><AlertTriangle size={16} /> Submit Hazard Report</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-red-800 text-sm font-semibold mb-2">
              <Phone size={16} /> Emergency
            </div>
            <p className="text-xs text-red-700 leading-relaxed mb-2">
              For ongoing fires or life-threatening emergencies, call <strong className="text-red-800">160</strong> immediately.
            </p>
            <div className="text-3xl font-bold text-red-700">160</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-gray-400" /> What Happens Next?
            </h3>
            <ol className="text-xs text-gray-600 space-y-2">
              {['Your report is received by our dispatch team', 'An inspector is assigned to verify the hazard', 'Corrective action is issued if necessary', 'You can follow up using your reference number'].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" /> Jurisdiction
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This reporting system covers the Municipality of Ipil, Zamboanga Sibugay. For hazards outside Ipil, please contact the nearest BFP station in your area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
