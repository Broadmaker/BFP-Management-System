import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', to: '/public' },
  { label: 'Services', to: '/public/services' },
  { label: 'Appointments', to: '/public/appointments' },
  { label: 'Seminars', to: '/public/seminars' },
  { label: 'Report Hazard', to: '/public/hazards' },
  { label: 'Information', to: '/public/info' },
];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Emergency Banner */}
      <div className="bg-red-700 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Phone size={12} className="fill-current" />
            <span className="hidden sm:inline">Emergency Hotline:</span>
            <strong className="text-sm">160</strong>
          </span>
          <span className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail size={11} /> ipil@bfp.gov.ph</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> Poblacion, Ipil, Zamboanga Sibugay</span>
          </span>
          <span className="text-red-200 text-[10px]">For life-threatening emergencies only</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/public" className="flex items-center gap-3">
              <img src="/bfp-logo.png" alt="BFP Logo" className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200" />
              <div className="hidden sm:block">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Republic of the Philippines</div>
                <div className="text-sm font-bold text-gray-900 leading-tight">Bureau of Fire Protection</div>
                <div className="text-xs text-gray-500">Ipil Station — Zamboanga Sibugay</div>
              </div>
              <div className="sm:hidden">
                <div className="text-xs font-bold text-gray-900 leading-tight">BFP Ipil Station</div>
                <div className="text-[10px] text-gray-500">Zamboanga Sibugay</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    pathname === link.to
                      ? 'bg-red-50 text-red-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/auth/login"
                className="ml-2 px-4 py-1.5 bg-red-700 text-white text-sm font-medium rounded-md hover:bg-red-800 transition-colors"
              >
                Login
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 pb-3 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-md ${
                    pathname === link.to ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 mt-1 text-sm font-medium text-red-700 bg-red-50 rounded-md"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/bfp-logo.png" alt="" className="w-9 h-9 rounded-lg ring-1 ring-gray-600" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Republic of the Philippines</div>
                  <div className="text-sm font-semibold text-white">BFP Ipil Station</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Serving the municipality of Ipil, Zamboanga Sibugay with fire prevention, suppression, and emergency services since 1991.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Online Services</h4>
              <div className="space-y-2 text-xs">
                <Link to="/public/services" className="block text-gray-400 hover:text-white transition-colors">File a Request</Link>
                <Link to="/public/appointments" className="block text-gray-400 hover:text-white transition-colors">Book Inspection</Link>
                <Link to="/public/seminars" className="block text-gray-400 hover:text-white transition-colors">Register for Seminar</Link>
                <Link to="/public/hazards" className="block text-gray-400 hover:text-white transition-colors">Report a Hazard</Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <div className="space-y-2 text-xs">
                <Link to="/public/info" className="block text-gray-400 hover:text-white transition-colors">FAQs</Link>
                <Link to="/public/info" className="block text-gray-400 hover:text-white transition-colors">Fire Prevention Tips</Link>
                <Link to="/auth/register" className="block text-gray-400 hover:text-white transition-colors">Create Account</Link>
                <a href="https://bfp.gov.ph" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">BFP National HQ</a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Contact</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-start gap-2">
                  <Phone size={12} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-300">Emergency: 160</div>
                    <div>Hotline: (062) 333-1234</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={12} className="mt-0.5 flex-shrink-0" />
                  <span>ipil@bfp.gov.ph</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                  <span>Poblacion, Ipil,<br />Zamboanga Sibugay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} Bureau of Fire Protection — Ipil Station. All rights reserved.</span>
            <span>Best viewed in Google Chrome, Mozilla Firefox, or Microsoft Edge.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
