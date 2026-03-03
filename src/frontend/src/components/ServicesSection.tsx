import {
  Globe,
  Handshake,
  HeartHandshake,
  Link,
  MapPin,
  Megaphone,
  Rocket,
  Search,
  Target,
} from "lucide-react";

const BRAND_SERVICES = [
  {
    icon: <Megaphone className="w-5 h-5" />,
    title: "Influencer Campaign Management",
    desc: "End-to-end campaign execution from strategy to reporting.",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Product Launch Campaigns",
    desc: "Create buzz and drive conversions for new product launches.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Brand Awareness Campaigns",
    desc: "Expand your reach and build lasting brand recognition.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Niche Targeting",
    desc: "Reach hyper-specific audiences with precision-matched creators.",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Geo-targeted Campaigns",
    desc: "Drive local engagement with region-specific influencer campaigns.",
  },
];

const INFLUENCER_SERVICES = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "Brand Deal Sourcing",
    desc: "We actively find and bring relevant brand deals to you.",
  },
  {
    icon: <Handshake className="w-5 h-5" />,
    title: "Negotiation Handling",
    desc: "We negotiate rates and terms on your behalf for the best outcomes.",
  },
  {
    icon: <Link className="w-5 h-5" />,
    title: "Long-term Partnerships",
    desc: "Build ongoing relationships with brands that value your content.",
  },
  {
    icon: <HeartHandshake className="w-5 h-5" />,
    title: "Campaign Support",
    desc: "Dedicated support throughout every campaign you participate in.",
  },
];

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "cyan" | "mint";
}

function ServiceCard({ icon, title, desc, accent }: ServiceCardProps) {
  const colors = {
    cyan: "bg-cyan-950/50 text-cyan-400 group-hover:bg-cyan-900/50",
    mint: "bg-[#4DFFD2]/10 text-[#4DFFD2] group-hover:bg-[#4DFFD2]/20",
  };

  return (
    <div className="group flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${colors[accent]}`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1 text-sm">{title}</h4>
        <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-cyan-950/80 text-cyan-300 text-sm font-semibold rounded-full mb-4 border border-cyan-800/50">
            Our Services
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#4DFFD2]">
              Grow
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive services designed for both brands and creators to
            achieve their goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Brands */}
          <div className="rounded-3xl border border-cyan-900/30 bg-[#112233] hover:border-cyan-500/50 transition-colors p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-cyan-500 text-[#0D1B2A] text-xs font-bold rounded-full uppercase tracking-wide mb-3">
                For Brands
              </span>
              <h3 className="text-2xl font-bold text-white">
                Scale Your Brand
              </h3>
            </div>
            <div className="space-y-1">
              {BRAND_SERVICES.map((s) => (
                <ServiceCard key={s.title} {...s} accent="cyan" />
              ))}
            </div>
          </div>

          {/* For Influencers */}
          <div className="rounded-3xl border border-cyan-900/30 bg-[#112233] hover:border-[#4DFFD2]/30 transition-colors p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#4DFFD2] text-[#0D1B2A] text-xs font-bold rounded-full uppercase tracking-wide mb-3">
                For Influencers
              </span>
              <h3 className="text-2xl font-bold text-white">
                Grow Your Income
              </h3>
            </div>
            <div className="space-y-1">
              {INFLUENCER_SERVICES.map((s) => (
                <ServiceCard key={s.title} {...s} accent="mint" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
