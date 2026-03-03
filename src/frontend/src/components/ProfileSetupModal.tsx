import { Loader2, User } from "lucide-react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const { mutateAsync, isPending } = useSaveCallerUserProfile();

  const validate = () => {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Valid email is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await mutateAsync({ name: name.trim(), email: email.trim() });
    } catch {
      // handled by mutation
    }
  };

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 w-full h-full max-w-none max-h-none bg-transparent"
      aria-modal="true"
      aria-labelledby="profile-setup-title"
      open
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-7 h-7 text-teal-600" />
          </div>
          <h2
            id="profile-setup-title"
            className="text-2xl font-bold text-slate-900 mb-1"
          >
            Welcome to BRANDSMITRA!
          </h2>
          <p className="text-slate-500 text-sm">
            Let's set up your profile to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Your Name{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Jane Doe"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.name ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              aria-required="true"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Email Address{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.email ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              aria-required="true"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </dialog>
  );
}
