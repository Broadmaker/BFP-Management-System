import { FileText } from 'lucide-react';

export default function Complaints() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-gray-500 font-medium">Public Service</div>
        <h1 className="text-xl font-semibold text-gray-900 mt-0.5">Complaints & Feedback</h1>
        <p className="text-xs text-gray-400 mt-0.5">Citizen-submitted complaints and suggestions</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <FileText size={40} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-sm font-medium text-gray-900">No complaints submitted yet</h3>
        <p className="text-xs text-gray-500 mt-1">This section will populate once citizens submit feedback through the public portal.</p>
      </div>
    </div>
  );
}
