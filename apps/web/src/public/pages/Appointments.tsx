import { useState } from 'react';
import { CheckCircle, Calendar, Clock, FileText, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'bfp-appointments';

function loadAppointments() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function makeId() { return `APP-${Date.now().toString(36).toUpperCase().slice(-5)}`; }

const barangays = [
  'Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil',
  'Sanito', 'Makilas', 'Lumbia', 'Labi', 'Taway',
];

export default function PublicAppointments() {
  const [form, setForm] = useState({
    name: '', contact: '', barangay: '', address: '',
    business: '', type: 'Initial Inspection',
    preferredDate: '', preferredTime: '',
  });
  const [submitted, setSubmitted] = useState('');
  const [loading, setLoading] = useState(false);

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  function formatTime(timeStr: string) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const ampm = +h >= 12 ? 'PM' : 'AM';
    const h12 = +h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const appointments = loadAppointments();
      const id = makeId();
      const date = formatDate(form.preferredDate);
      const time = formatTime(form.preferredTime);
      appointments.unshift({
        id, name: form.name, contact: form.contact,
        barangay: form.barangay, address: form.address,
        business: form.business || '—',
        type: form.type, date, time, status: 'Pending',
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      setSubmitted(id);
      setForm({ name: '', contact: '', barangay: '', address: '', business: '', type: 'Initial Inspection', preferredDate: '', preferredTime: '' });
      setLoading(false);
    }, 600);
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} />
            </div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Appointment Booked</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your inspection has been scheduled</h2>
            <p className="text-sm text-gray-500 mb-4">Please save your reference number:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
              <div className="text-xs text-gray-500 mb-1">Reference Number</div>
              <div className="text-2xl font-bold text-red-700 font-mono tracking-wider">{submitted}</div>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Our team will review your appointment and contact you for confirmation.
            </p>
            <button onClick={() => setSubmitted('')} className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
              Book Another Appointment
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
        <span className="text-gray-600">Inspection Appointments</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inspection Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Schedule a fire safety inspection for your establishment or property in Ipil, Zamboanga Sibugay.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Appointment Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">All fields marked with <span className="text-red-500">*</span> are required.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g. Juan B. Dela Cruz" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g. 0917-123-4567" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <select value={form.barangay} onChange={(e) => setForm({ ...form, barangay: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Select barangay...</option>
                  {barangays.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name (optional)
                </label>
                <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="If applicable" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Address <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Street, Barangay, Ipil, Zamboanga Sibugay" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Type <span className="text-red-500">*</span>
              </label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                <option>Initial Inspection</option>
                <option>Reinspection</option>
                <option>Annual Inspection</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <input type="time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Note:</strong> Your preferred schedule is subject to confirmation. We will contact you to confirm the final appointment details.
            </div>

            <button type="submit" disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? 'Submitting...' : <><Calendar size={16} /> Book Appointment</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-gray-400" /> What to Prepare
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              {['Valid government-issued ID', 'Business permit (if applicable)', 'Previous FSIC (for renewal)', 'Floor plan or building sketch'].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-gray-400" /> Process Flow
            </h3>
            <ol className="text-xs text-gray-600 space-y-2">
              {['Submit your appointment request', 'Inspector assigned to your request', 'Receive confirmation call or text', 'Inspection conducted on scheduled date'].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Phone size={14} /> Need to Reschedule?
            </h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Call <strong className="text-blue-800">(062) 333-1234</strong> or email <strong className="text-blue-800">ipil@bfp.gov.ph</strong> with your reference number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
