import { useState } from 'react';
import { useSubmitBrandInquiry } from '../hooks/useQueries';
import SuccessModal from './SuccessModal';
import { Loader2, Briefcase } from 'lucide-react';

interface FormData {
  brandName: string;
  industry: string;
  website: string;
  contactName: string;
  email: string;
  budgetRange: string;
  campaignGoal: string;
  timeline: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INDUSTRIES = ['Fashion & Apparel', 'Beauty & Cosmetics', 'Food & Beverage', 'Health & Wellness', 'Technology', 'Travel & Hospitality', 'Finance', 'Education', 'Entertainment', 'Sports & Fitness', 'Home & Lifestyle', 'Other'];
const BUDGET_RANGES = ['Under 1 Lakh', '1–5 Lakhs', '5–10 Lakhs', '10–25 Lakhs', '25 Lakhs+'];
const TIMELINES = ['ASAP (within 2 weeks)', '1 month', '2–3 months', '3–6 months', 'Flexible'];

const INITIAL: FormData = {
  brandName: '', industry: '', website: '', contactName: '',
  email: '', budgetRange: '', campaignGoal: '', timeline: '',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.brandName.trim()) errors.brandName = 'Brand name is required';
  if (!data.industry) errors.industry = 'Please select an industry';
  if (!data.contactName.trim()) errors.contactName = 'Contact name is required';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Enter a valid email address';
  if (!data.budgetRange) errors.budgetRange = 'Please select a budget range';
  if (!data.campaignGoal.trim()) errors.campaignGoal = 'Campaign goal is required';
  if (!data.timeline) errors.timeline = 'Please select a timeline';
  return errors;
}

export default function BrandInquiryForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync, isPending } = useSubmitBrandInquiry();

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
        brandName: form.brandName,
        industry: form.industry,
        website: form.website,
        contactName: form.contactName,
        email: form.email,
        budgetRange: form.budgetRange,
        campaignGoal: form.campaignGoal,
        timeline: form.timeline,
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
      <div className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 rounded-2xl mb-4">
              <Briefcase className="w-7 h-7 text-teal-600" />
            </div>
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-4 border border-teal-100">
              For Brands
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Start Your Campaign</h2>
            <p className="text-lg text-slate-500">
              Tell us about your brand and campaign goals. We'll match you with the perfect influencers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8 space-y-6"
            aria-label="Brand inquiry form"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Brand Name */}
              <div>
                <label htmlFor="brand-brandName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Brand Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="brand-brandName"
                  name="brandName"
                  type="text"
                  value={form.brandName}
                  onChange={handleChange}
                  placeholder="Your Brand Name"
                  className={inputClass('brandName')}
                  aria-required="true"
                  aria-describedby={errors.brandName ? 'brand-brandName-error' : undefined}
                />
                {errors.brandName && (
                  <p id="brand-brandName-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.brandName}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="brand-industry" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Industry <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="brand-industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className={inputClass('industry')}
                  aria-required="true"
                  aria-describedby={errors.industry ? 'brand-industry-error' : undefined}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                {errors.industry && (
                  <p id="brand-industry-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.industry}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label htmlFor="brand-website" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Website <span className="text-slate-400 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="brand-website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourbrand.com"
                  className={inputClass('website')}
                />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="brand-contactName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Marketing Contact Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="brand-contactName"
                  name="contactName"
                  type="text"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className={inputClass('contactName')}
                  aria-required="true"
                  aria-describedby={errors.contactName ? 'brand-contactName-error' : undefined}
                />
                {errors.contactName && (
                  <p id="brand-contactName-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.contactName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="brand-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="brand-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="marketing@yourbrand.com"
                  className={inputClass('email')}
                  aria-required="true"
                  aria-describedby={errors.email ? 'brand-email-error' : undefined}
                />
                {errors.email && (
                  <p id="brand-email-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.email}</p>
                )}
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="brand-budgetRange" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Budget Range <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="brand-budgetRange"
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={handleChange}
                  className={inputClass('budgetRange')}
                  aria-required="true"
                  aria-describedby={errors.budgetRange ? 'brand-budgetRange-error' : undefined}
                >
                  <option value="">Select budget range</option>
                  {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budgetRange && (
                  <p id="brand-budgetRange-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.budgetRange}</p>
                )}
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="brand-timeline" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Campaign Timeline <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="brand-timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  className={inputClass('timeline')}
                  aria-required="true"
                  aria-describedby={errors.timeline ? 'brand-timeline-error' : undefined}
                >
                  <option value="">Select timeline</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.timeline && (
                  <p id="brand-timeline-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.timeline}</p>
                )}
              </div>
            </div>

            {/* Campaign Goal */}
            <div>
              <label htmlFor="brand-campaignGoal" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Campaign Goal <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="brand-campaignGoal"
                name="campaignGoal"
                value={form.campaignGoal}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your campaign objectives, target audience, and what success looks like for you…"
                className={`${inputClass('campaignGoal')} resize-none`}
                aria-required="true"
                aria-describedby={errors.campaignGoal ? 'brand-campaignGoal-error' : undefined}
              />
              {errors.campaignGoal && (
                <p id="brand-campaignGoal-error" className="mt-1.5 text-xs text-red-600" role="alert">{errors.campaignGoal}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              aria-label="Submit brand inquiry"
              className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Submit Brand Inquiry'
              )}
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Inquiry Received!"
        message="Thank you for reaching out to GrowthBridge Media! Our team will review your campaign brief and get back to you within 24–48 hours."
      />
    </>
  );
}
