import { useState } from 'react';
import { Shield, Building2, FileText, CheckCircle, Search, ArrowLeft, Clock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'bfp-service-requests';

function loadRequests() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function makeId() {
  const n = Date.now().toString(36).toUpperCase();
  return `SR-${n.slice(-5)}`;
}

const serviceTypes = [
  { value: 'FSIC Application', label: 'Fire Safety Inspection Certificate (New)', icon: Shield, desc: 'Required for all business permits and building occupancy.', requirements: 'Valid ID, Business permit, Floor plan' },
  { value: 'FSIC Renewal', label: 'FSIC Renewal', icon: Shield, desc: 'Renew your expiring FSIC certificate.', requirements: 'Previous FSIC, Updated business info' },
  { value: 'Inspection Request', label: 'Request for Inspection', icon: Building2, desc: 'Schedule a fire safety inspection for your establishment.', requirements: 'Business name, Address, Contact details' },
  { value: 'Document Request', label: 'Official Documents / Records', icon: FileText, desc: 'Request certified copies of fire safety documents and records.', requirements: 'Document type, Purpose of request' },
];

export default function PublicServices() {
  const [mode, setMode] = useState<'browse' | 'form' | 'track' | 'done'>('browse');
  const [form, setForm] = useState({ type: 'FSIC Application', requester: '', contact: '', business: '' });
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [submittedId, setSubmittedId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const requests = loadRequests();
    const id = makeId();
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    requests.unshift({ id, ...form, date, status: 'Pending' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    setSubmittedId(id);
    setForm({ type: 'FSIC Application', requester: '', contact: '', business: '' });
    setMode('done');
  }

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const requests = loadRequests();
    const found = requests.find((r: any) => r.id.toLowerCase() === trackId.trim().toLowerCase());
    setTrackResult(found || null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-xs text-gray-400 mb-1">
          <Link to="/public" className="hover:text-red-600">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Service Requests</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Submit and track your fire safety service requests online.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setMode('track'); setTrackResult(null); setTrackId(''); }}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                mode === 'track' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Track Request
            </button>
            <button
              onClick={() => setMode('form')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                mode === 'form' || mode === 'done' ? 'bg-gray-100 text-gray-400' : 'bg-red-700 text-white hover:bg-red-800'
              }`}
            >
              New Request
            </button>
          </div>
        </div>
      </div>

      {mode === 'browse' && (
        <>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {serviceTypes.map((s) => (
              <div key={s.value} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
                    <s.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.label}</h3>
                    <p className="text-xs text-gray-500 mb-2">{s.desc}</p>
                    <div className="text-[11px] text-gray-400 mb-3">
                      <span className="font-medium text-gray-600">Requirements:</span> {s.requirements}
                    </div>
                    <button
                      onClick={() => { setForm({ ...form, type: s.value }); setMode('form'); }}
                      className="text-xs font-medium text-red-700 hover:text-red-800 inline-flex items-center gap-1"
                    >
                      Submit Request →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold mb-1">
                <Clock size={14} /> Processing Time
              </div>
              <p className="text-xs text-blue-700">Standard processing takes 3-5 working days upon submission of complete requirements.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-800 text-xs font-semibold mb-1">
                <Phone size={14} /> Need Help?
              </div>
              <p className="text-xs text-green-700">Call (062) 333-1234 or visit our station at Poblacion, Ipil during office hours.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-800 text-xs font-semibold mb-1">
                <CheckCircle size={14} /> Track Online
              </div>
              <p className="text-xs text-yellow-700">Save your reference number to track request status anytime.</p>
            </div>
          </div>
        </>
      )}

      {mode === 'form' && (
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setMode('browse')} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to services
          </button>
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Submit a Service Request</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fill out the form below to submit your request.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  {serviceTypes.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. Juan B. Dela Cruz" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. 0917-123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name (optional)</label>
                  <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="If applicable" />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <strong>Note:</strong> Incomplete or incorrect information may delay processing.
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setMode('browse')} className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mode === 'done' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} />
            </div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Request Submitted</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your request is being processed</h2>
            <p className="text-sm text-gray-500 mb-4">Please save your reference number for tracking:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
              <div className="text-xs text-gray-500 mb-1">Reference Number</div>
              <div className="text-2xl font-bold text-red-700 font-mono tracking-wider">{submittedId}</div>
            </div>
            <div className="space-y-2">
              <button onClick={() => { setMode('track'); setTrackId(submittedId); }} className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
                Track This Request
              </button>
              <button onClick={() => setMode('browse')} className="w-full py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'track' && (
        <div className="max-w-lg mx-auto">
          <button onClick={() => { setMode('browse'); setTrackResult(null); }} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to services
          </button>
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Track Your Request</h2>
              <p className="text-xs text-gray-500 mt-0.5">Enter the reference number you received after submitting your request.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="e.g. SR-A1B2C"
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono uppercase"
                />
                <button type="submit" className="px-4 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
                  <Search size={16} />
                </button>
              </form>

              {trackResult && (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-semibold text-gray-900">{trackResult.id}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      trackResult.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      trackResult.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                      trackResult.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      trackResult.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                    }`}>{trackResult.status}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Service Type</span><span className="font-medium text-gray-900 text-right">{trackResult.type}</span></div>
                    <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Date Submitted</span><span className="font-medium text-gray-900">{trackResult.date}</span></div>
                    <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Requester</span><span className="font-medium text-gray-900">{trackResult.requester}</span></div>
                    {trackResult.business && <div className="flex justify-between py-1"><span className="text-gray-500">Business</span><span className="font-medium text-gray-900">{trackResult.business}</span></div>}
                  </div>
                </div>
              )}
              {trackResult === null && trackId.trim() && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  No request found with reference number <strong className="font-mono">{trackId}</strong>. Please check the number and try again.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
