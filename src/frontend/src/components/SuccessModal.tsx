import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Submission Successful!",
  message = "Thank you! We have received your submission and will be in touch shortly.",
}: SuccessModalProps) {
  // ESC key support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 w-full h-full max-w-none max-h-none bg-transparent"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      open
      data-ocid="success.modal"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#0D1B2A]/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-[#112233] border border-cyan-900/40 rounded-3xl shadow-2xl shadow-cyan-900/20 p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-300 hover:bg-cyan-950/50 transition-colors"
          aria-label="Close modal"
          data-ocid="success.close_button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyan-950/50 border border-cyan-800/50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9 text-[#4DFFD2]" />
          </div>
          <h2
            id="success-modal-title"
            className="text-2xl font-bold text-white mb-2"
          >
            {title}
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0D1B2A] font-semibold rounded-xl transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#112233]"
            data-ocid="success.confirm_button"
          >
            Got it!
          </button>
        </div>
      </div>
    </dialog>
  );
}
