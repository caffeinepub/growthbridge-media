import { Check, Crown, Shield, Zap } from "lucide-react";

const PLANS = [
  {
    icon: <Zap className="w-6 h-6" />,
    name: "Starter",
    tagline: "Perfect for first-time campaigns",
    commission: "20% commission",
    features: [
      "Up to 3 influencer matches",
      "Single campaign management",
      "Basic performance reporting",
      "Email support",
      "Campaign brief creation",
    ],
    cta: "Get Started",
    highlight: false,
    accent: "cyan" as const,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    name: "Professional",
    tagline: "For growing brands with ongoing needs",
    commission: "20% commission",
    features: [
      "Up to 10 influencer matches",
      "Multi-campaign management",
      "Advanced analytics & reporting",
      "Dedicated account manager",
      "Content review & approval",
      "Priority support",
    ],
    cta: "Most Popular",
    highlight: true,
    accent: "cyan" as const,
  },
  {
    icon: <Crown className="w-6 h-6" />,
    name: "Enterprise",
    tagline: "Full-scale influencer marketing operations",
    commission: "20% commission",
    features: [
      "Unlimited influencer matches",
      "Full campaign portfolio management",
      "Custom reporting & dashboards",
      "Dedicated strategy team",
      "Geo-targeted campaign support",
      "Long-term partnership facilitation",
      "White-glove onboarding",
    ],
    cta: "Contact Us",
    highlight: false,
    accent: "mint" as const,
  },
];

export default function PricingSection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-24 bg-[#0a1a2e] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-cyan-950/80 text-cyan-300 text-sm font-semibold rounded-full mb-4 border border-cyan-800/50">
            Pricing
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We operate on a straightforward{" "}
            <span className="font-bold text-cyan-400">
              20% commission model
            </span>{" "}
            — you only pay when campaigns deliver results. No hidden fees, no
            upfront costs.
          </p>
        </div>

        {/* Commission callout */}
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-gradient-to-r from-cyan-600 to-[#0066B2] rounded-3xl text-white text-center shadow-xl shadow-cyan-900/50">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">
            Our Model
          </p>
          <p className="text-3xl font-extrabold mb-2">
            20% Commission Per Campaign
          </p>
          <p className="text-cyan-100 text-sm">
            We earn only when you succeed. Our commission is calculated on the
            total campaign deal value.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlight
                  ? "bg-gradient-to-br from-cyan-600 to-[#0066B2] text-white shadow-2xl shadow-cyan-900/50 scale-105"
                  : "bg-[#112233] border border-cyan-900/30 hover:border-cyan-500/50 shadow-soft"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#4DFFD2] text-[#0D1B2A] text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                  Most Popular
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.highlight
                    ? "bg-white/20"
                    : plan.accent === "cyan"
                      ? "bg-cyan-950/50 text-cyan-400"
                      : "bg-[#4DFFD2]/10 text-[#4DFFD2]"
                }`}
              >
                {plan.icon}
              </div>

              <h3
                className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-white"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-4 ${plan.highlight ? "text-cyan-100" : "text-slate-400"}`}
              >
                {plan.tagline}
              </p>

              <div
                className={`text-sm font-semibold mb-6 px-3 py-1.5 rounded-full inline-block w-fit ${
                  plan.highlight
                    ? "bg-white/20 text-white"
                    : "bg-cyan-950/50 text-cyan-300"
                }`}
              >
                {plan.commission}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-cyan-200" : "text-cyan-500"}`}
                    />
                    <span
                      className={
                        plan.highlight ? "text-cyan-50" : "text-slate-300"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={scrollToContact}
                aria-label={`Get started with ${plan.name} plan`}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  plan.highlight
                    ? "bg-white text-[#0066B2] hover:bg-cyan-50 focus-visible:ring-white"
                    : plan.accent === "mint"
                      ? "bg-[#4DFFD2] text-[#0D1B2A] hover:bg-cyan-300 focus-visible:ring-cyan-400"
                      : "bg-cyan-500 text-[#0D1B2A] hover:bg-cyan-400 focus-visible:ring-cyan-500"
                }`}
                data-ocid={`pricing.${plan.name.toLowerCase()}.primary_button`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
