import { ReactNode } from 'react';

interface PagePlaceholderProps {
  title: string;
  pretitle: string;
  description?: string;
  children?: ReactNode;
}

export default function PagePlaceholder({ title, pretitle, description, children }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-gray-500 font-medium">{pretitle}</div>
        <h1 className="text-xl font-semibold text-gray-900 mt-0.5">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {children || (
        <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Coming Soon</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            This module is being built. Use the Gentelella HTML reference for UI patterns.
          </p>
        </div>
      )}
    </div>
  );
}
