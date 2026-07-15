import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>BFP Ipil Station</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Incidents</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 hover:text-gray-900">Docs</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Notifications</button>
            <div className="w-7 h-7 rounded-full bg-gray-200" />
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
