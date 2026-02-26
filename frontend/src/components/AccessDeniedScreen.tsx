import { ShieldX } from 'lucide-react';

interface AccessDeniedScreenProps {
  onBack?: () => void;
}

export default function AccessDeniedScreen({ onBack }: AccessDeniedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Access Denied</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          You don't have permission to access the Admin Dashboard. This area is restricted to authorized administrators only.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Main Site
          </button>
        )}
      </div>
    </div>
  );
}
