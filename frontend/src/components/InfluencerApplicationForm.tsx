import { useState } from 'react';
import { useSubmitInfluencerApplication } from '../hooks/useQueries';
import SuccessModal from './SuccessModal';
import { Loader2, Instagram, Users } from 'lucide-react';

interface FormData {
  fullName: string;
  instagramHandle: string;
  followersCount: string;
  niche: string;
  engagementRate: string;
  email: string;
  location: string;
  rateCard: string;
  portfolioLink: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const NICHES = ['Fashion', 'Beauty', 'Fitness', 'Food', 'Travel', 'Tech', 'Lifestyle', 'Gaming', 'Finance', 'Education', 'Other'];

const INITIAL: FormData = {
  fullName: '', instagramHandle: '', followersCount: '', niche: '',
  engagementRate: '', email: '', location: '', rateCard: '', portfolioLink: '',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.instagramHandle.trim()) errors.instagramHandle = 'Instagram handle is required';
  if (!data.followersCount || isNaN(Number(data.followersCount)) || Number(data.followersCount) < 0)
    errors.followersCount = 'Enter a valid followers count';
  if (!data.niche) errors.niche = 'Please select a niche';
  if (!data.engagementRate || isNaN(Number(data.engagementRate)) || Number(data.engagementRate) < 0 || Number(data.engagementRate) > 100)
    errors.engagementRate = 'Enter a valid engagement rate (0–100)';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Enter a valid email address';
  if (!data.location.trim()) errors.location = 'Location is required';
  if (!data.rateCard.trim()) errors.rateCard = 'Rate card is required';
  return errors;
}

export default function InfluencerApplicationForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync, isPending } = useSubmitInfluencerApplication();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await mutateAsync({
        id: BigInt(0),
        fullName: form.fullName,
        instagramHandle: form.instagramHandle,
        followersCount: BigInt(Number(form.followersCount)),
        niche: form.niche,
        engagementRate: BigInt(Math.round(Number(form.engagementRate))),
        email: form.email,
        location: form.location,
        rateCard: form.rateCard,
        portfolioLink: form.portfolioLink,
        approved: false,
        createdAt: BigInt(0),
      });
      setForm(INITIAL);
      setErrors({});
      setShowSuccess(true);
    } catch {
      // error handled by mutation
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
    }`;

  return (
    <>
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-4">
              <Instagram className="w-7 h-7 text-amber-600" />
            </div>
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-semibold rounded-full mb-4 border border-amber-100">
              For Influencers
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Join Our Influencer Network</h2>
            <p className="text-lg text-slate-500">
              Apply to become part of GrowthBridge Media's curated network of micro-influencers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8 space-y-6"
            aria-label="Influencer application form"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="inf-fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="inf-fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className={inputClass('fullName')}
                  aria-required="true"
                  aria-describedby={errors.fullName ? 'inf-fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="inf-fullName-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.fullName}</p>
                )}
              </div>

              {/* Instagram Handle */}
              <div>
                <label htmlFor="inf-instagramHandle" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Instagram Handle <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input
                    id="inf-instagramHandle"
                    name="instagramHandle"
                    type="text"
                    value={form.instagramHandle}
                    onChange={handleChange}
                    placeholder="yourhandle"
                    className={`${inputClass('instagramHandle')} pl-8`}
                    aria-required="true"
                    aria-describedby={errors.instagramHandle ? 'inf-instagramHandle-error' : undefined}
                  />
                </div>
                {errors.instagramHandle && (
                  <p id="inf-instagramHandle-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.instagramHandle}</p>
                )}
              </div>

              {/* Followers Count */}
              <div>
                <label htmlFor="inf-followersCount" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Followers Count <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="inf-followersCount"
                    name="followersCount"
                    type="number"
                    min="0"
                    value={form.followersCount}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    className={`${inputClass('followersCount')} pl-9`}
                    aria-required="true"
                    aria-describedby={errors.followersCount ? 'inf-followersCount-error' : undefined}
                  />
                </div>
                {errors.followersCount && (
                  <p id="inf-followersCount-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.followersCount}</p>
                )}
              </div>

              {/* Niche */}
              <div>
                <label htmlFor="inf-niche" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Niche <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="inf-niche"
                  name="niche"
                  value={form.niche}
                  onChange={handleChange}
                  className={inputClass('niche')}
                  aria-required="true"
                  aria-describedby={errors.niche ? 'inf-niche-error' : undefined}
                >
                  <option value="">Select your niche</option>
                  {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.niche && (
                  <p id="inf-niche-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.niche}</p>
                )}
              </div>

              {/* Engagement Rate */}
              <div>
                <label htmlFor="inf-engagementRate" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Engagement Rate (%) <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="inf-engagementRate"
                  name="engagementRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.engagementRate}
                  onChange={handleChange}
                  placeholder="e.g. 4.5"
                  className={inputClass('engagementRate')}
                  aria-required="true"
                  aria-describedby={errors.engagementRate ? 'inf-engagementRate-error' : undefined}
                />
                {errors.engagementRate && (
                  <p id="inf-engagementRate-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.engagementRate}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="inf-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="inf-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass('email')}
                  aria-required="true"
                  aria-describedby={errors.email ? 'inf-email-error' : undefined}
                />
                {errors.email && (
                  <p id="inf-email-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.email}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="inf-location" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Location <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="inf-location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className={inputClass('location')}
                  aria-required="true"
                  aria-describedby={errors.location ? 'inf-location-error' : undefined}
                />
                {errors.location && (
                  <p id="inf-location-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.location}</p>
                )}
              </div>

              {/* Rate Card */}
              <div>
                <label htmlFor="inf-rateCard" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Rate Card <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="inf-rateCard"
                  name="rateCard"
                  type="text"
                  value={form.rateCard}
                  onChange={handleChange}
                  placeholder="e.g. Story post, Reel, etc."
                  className={inputClass('rateCard')}
                  aria-required="true"
                  aria-describedby={errors.rateCard ? 'inf-rateCard-error' : undefined}
                />
                {errors.rateCard && (
                  <p id="inf-rateCard-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.rateCard}</p>
                )}
              </div>
            </div>

            {/* Portfolio Link */}
            <div>
              <label htmlFor="inf-portfolioLink" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Portfolio Link <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <input
                id="inf-portfolioLink"
                name="portfolioLink"
                type="url"
                value={form.portfolioLink}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className={inputClass('portfolioLink')}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              aria-label="Submit influencer application"
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-amber-200 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Application Received!"
        message="Thank you for applying to GrowthBridge Media! Our team will review your profile and reach out within 3–5 business days."
      />
    </>
  );
}
