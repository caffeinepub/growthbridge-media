import { CheckCircle2 } from 'lucide-react';

const BRAND_STEPS = [
  { step: 1, title: 'Submit Campaign Goal', desc: 'Tell us your objectives, target audience, and campaign vision.' },
  { step: 2, title: 'Get Matched with Curated Influencers', desc: 'We handpick micro-influencers who align with your brand values and niche.' },
  { step: 3, title: 'We Manage Execution & Reporting', desc: 'Sit back while we handle everything — from briefing to performance reports.' },
];

const INFLUENCER_STEPS = [
  { step: 1, title: 'Apply to Join Network', desc: 'Submit your profile, niche, and engagement stats to get started.' },
  { step: 2, title: 'Get Matched with Campaigns', desc: 'We connect you with brands that fit your audience and content style.' },
  { step: 3, title: 'Get Paid Securely', desc: 'Receive timely, secure payments for every completed campaign.' },
];

interface StepCardProps {
  step: number;
  title: string;
  desc: string;
  accent: 'teal' | 'amber';
}

function StepCard({ step, title, desc, accent }: StepCardProps) {
  const colors = {
    teal: { badge: 'bg-teal-600 text-white', line: 'bg-teal-100', icon: 'text-teal-600' },
    amber: { badge: 'bg-amber-500 text-white', line: 'bg-amber-100', icon: 'text-amber-600' },
  };
  const c = colors[accent];

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${c.badge} flex items-center justify-center text-sm font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
          {step}
        </div>
        {step < 3 && <div className={`w-0.5 h-full mt-2 ${c.line} min-h-[2rem]`} />}
      </div>
      <div className="pb-8">
        <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="for-brands" className="py-24 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-4 border border-teal-100">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Simple. Transparent. Effective.</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Whether you're a brand looking to grow or a creator ready to monetize, we've made the process seamless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* For Brands */}
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Brands</h3>
            </div>
            <div>
              {BRAND_STEPS.map((s) => (
                <StepCard key={s.step} {...s} accent="teal" />
              ))}
            </div>
          </div>

          {/* For Influencers */}
          <div id="for-influencers" className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 scroll-mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Influencers</h3>
            </div>
            <div>
              {INFLUENCER_STEPS.map((s) => (
                <StepCard key={s.step} {...s} accent="amber" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
