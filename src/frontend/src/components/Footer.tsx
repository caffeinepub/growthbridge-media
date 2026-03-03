import { Heart } from "lucide-react";
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si";

const FOOTER_LINKS = {
  Company: ["About Us", "Our Team", "Careers", "Press"],
  Services: ["For Brands", "For Influencers", "Pricing", "Case Studies"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "brandsmitra",
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="bg-[#0D1B2A] text-slate-400 scroll-mt-16 border-t border-cyan-900/20"
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <img
              src="/assets/uploads/ChatGPT-Image-Mar-3-2026-09_04_21-PM-2.png"
              alt="BRANDSMITRA"
              className="h-10 w-auto mb-4"
              style={{ mixBlendMode: "screen" }}
            />
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting brands with high-converting micro-influencers. We
              manage campaigns end-to-end on a transparent 20% commission model.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <SiInstagram className="w-4 h-4" />,
                  label: "Instagram",
                },
                { icon: <SiLinkedin className="w-4 h-4" />, label: "LinkedIn" },
                { icon: <SiX className="w-4 h-4" />, label: "X (Twitter)" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={`BRANDSMITRA on ${label}`}
                  className="w-9 h-9 bg-cyan-950 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors text-slate-300"
                  data-ocid={`footer.${label.toLowerCase()}.link`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-cyan-300 font-semibold text-sm mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-cyan-950/80 to-[#0066B2]/20 rounded-2xl border border-cyan-900/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                Ready to grow your brand?
              </h3>
              <p className="text-slate-400 text-sm">
                Get in touch and let's build your next campaign together.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollTo("influencer-form")}
                className="px-6 py-2.5 bg-[#4DFFD2] hover:bg-cyan-300 text-[#0D1B2A] font-semibold rounded-xl text-sm transition-colors"
                aria-label="Join as influencer"
                data-ocid="footer.influencer.primary_button"
              >
                Join as Influencer
              </button>
              <button
                type="button"
                onClick={() => scrollTo("brand-form")}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm transition-colors"
                aria-label="Work with us as a brand"
                data-ocid="footer.brand.secondary_button"
              >
                Work With Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {year} BRANDSMITRA. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
