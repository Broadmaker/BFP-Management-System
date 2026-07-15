import { Outlet, Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Emergency Banner */}
      <div className="bg-red-700 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center sm:justify-between">
          <span className="flex items-center gap-1.5">
            <Phone size={12} className="fill-current" />
            <span className="hidden sm:inline">Emergency Hotline:</span>
            <strong className="text-sm">160</strong>
          </span>
          <span className="hidden sm:text-red-200 text-[10px]">For life-threatening emergencies only</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Branding */}
          <Link to="/public" className="flex items-center justify-center gap-3 mb-8">
            <img src="/bfp-logo.png" alt="BFP Logo" className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200" />
            <div>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Republic of the Philippines</div>
              <div className="text-base font-bold text-gray-900 leading-tight">Bureau of Fire Protection</div>
              <div className="text-xs text-gray-500">Ipil Station — Zamboanga Sibugay</div>
            </div>
          </Link>

          <Outlet />
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} BFP Ipil Station. All rights reserved.
      </div>
    </div>
  );
}
