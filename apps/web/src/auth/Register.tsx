import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const barangays = [
  'Poblacion', 'Ipil Heights', 'Don Basilio', 'Bangkerohan', 'Upper Ipil',
  'Sanito', 'Makilas', 'Lumbia', 'Labi', 'Taway',
];

export default function Register() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 text-center">
        <h1 className="text-lg font-bold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500 mt-0.5">Register for a citizen account to access online services</p>
      </div>

      <form className="p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Juan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Dela Cruz" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
          <input type="email" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="you@example.com" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
            <input type="tel" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="09XX-XXX-XXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barangay <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
              <option value="">Select barangay...</option>
              {barangays.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
          <input type="password" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="At least 8 characters" />
          <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters with a number and a letter.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
          <input type="password" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Re-enter password" />
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
          <span className="text-xs text-gray-500 leading-relaxed">
            I agree to the <a href="#" className="text-red-700 hover:text-red-800 font-medium">Terms of Service</a> and <a href="#" className="text-red-700 hover:text-red-800 font-medium">Data Privacy Policy</a>.
          </span>
        </label>

        <button type="submit" className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
          Create Account
        </button>
      </form>

      <div className="px-6 pb-5 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-red-700 hover:text-red-800 font-medium">Sign in</Link>
      </div>

      <div className="px-6 pb-5 text-center">
        <Link to="/public" className="text-xs text-gray-400 hover:text-gray-600 inline-flex items-center gap-1">
          <ArrowLeft size={11} /> Back to public portal
        </Link>
      </div>
    </div>
  );
}
