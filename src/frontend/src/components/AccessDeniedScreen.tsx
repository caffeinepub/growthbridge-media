import { ShieldX } from "lucide-react";

interface AccessDeniedScreenProps {
  onBack?: () => void;
}

export default function AccessDeniedScreen({
  onBack,
}: AccessDeniedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A] px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-950/50 border border-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Access Denied
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          You don't have permission to access the Admin Dashboard. This area is
          restricted to authorized administrators only.
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0D1B2A] font-semibold rounded-xl transition-colors"
            data-ocid="access-denied.back.button"
          >
            Back to Main Site
          </button>
        )}
      </div>
    </div>
  );
}
