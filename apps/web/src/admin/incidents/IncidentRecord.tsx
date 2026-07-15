import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function IncidentRecord() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Incident Management</div>
          <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Record New Incident</h1>
        </div>
        <Link to="/admin/incidents" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to List
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Incident Information</h2>
          <p className="text-xs text-gray-500 mb-5">Enter details about the incident.</p>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Incident Type <span className="text-red-500">*</span></label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Structural Fire</option>
                  <option>Vehicle Fire</option>
                  <option>Grass/Brush Fire</option>
                  <option>Hazardous Materials</option>
                  <option>Medical Emergency</option>
                  <option>Rescue Operation</option>
                  <option>False Alarm</option>
                  <option>Gas Leak</option>
                  <option>Electrical Fire</option>
                  <option>Industrial Accident</option>
                  <option>Building Collapse</option>
                  <option>Flooding</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Severity <span className="text-red-500">*</span></label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Minor</option>
                  <option>Moderate</option>
                  <option>Major</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time <span className="text-red-500">*</span></label>
                <input type="time" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Street, Barangay, City" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Barangay <span className="text-red-500">*</span></label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i}>Barangay {i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Occupancy Type</label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Institutional</option>
                  <option>Open Area</option>
                  <option>Vehicle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Incident Description</label>
              <textarea rows={4} placeholder="Describe the incident, initial assessment, and any immediate actions taken." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Reporting Party</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" placeholder="Full name" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="tel" placeholder="09XX-XXX-XXXX" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="reset" className="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Save as Draft
              </button>
              <button type="submit" className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                Submit Incident Report
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Incident Number</h3>
            <div className="text-lg font-bold text-red-600 font-mono tracking-wide">#BFP-4001</div>
            <div className="text-[11px] text-gray-500 mt-1">Auto-generated on submission</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Quick Tips</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><strong className="text-gray-900">Severity</strong> — Critical: immediate danger. Major: significant but contained. Minor: low impact.</li>
              <li><strong className="text-gray-900">Location</strong> — Be as specific as possible. Include landmarks.</li>
              <li><strong className="text-gray-900">Photos</strong> can be added after the initial report.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
