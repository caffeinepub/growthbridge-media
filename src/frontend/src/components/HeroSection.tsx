import { ArrowRight, TrendingUp, Users } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-[#0D1B2A] via-[#0a2233] to-[#0D1B2A]"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#4DFFD2]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0066B2]/10 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,221,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,221,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/80 border border-cyan-800/50 rounded-full text-cyan-300 text-sm font-medium">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Micro-Influencer Marketing Agency
          </div>

          <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Connecting Brands With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#4DFFD2]">
              High-Converting
            </span>{" "}
            Micro-Influencers
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
            We help brands scale with curated influencer campaigns and help
            creators secure consistent paid deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => scrollTo("influencer-form")}
              aria-label="Join as an influencer — scroll to application form"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-[#0D1B2A] font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]"
              data-ocid="hero.influencer.primary_button"
            >
              <Users className="w-5 h-5" />
              Join as Influencer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo("brand-form")}
              aria-label="Work with us as a brand — scroll to brand inquiry form"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-semibold rounded-2xl border-2 border-cyan-800 hover:border-cyan-500 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]"
              data-ocid="hero.brand.secondary_button"
            >
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Work With Us as a Brand
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {["T", "A", "M", "R"].map((letter, i) => (
                <div
                  key={letter}
                  className="w-9 h-9 rounded-full border-2 border-[#0D1B2A] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    backgroundColor: [
                      "#00AADD",
                      "#0066B2",
                      "#4DFFD2",
                      "#00DDFF",
                    ][i],
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">500+</span> influencers
              in our network
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-[#0066B2]/20 rounded-3xl blur-2xl scale-110" />
            <img
              src="/assets/generated/hero-illustration.dim_1200x600.png"
              alt="Brand and influencer connection network illustration"
              className="relative rounded-3xl shadow-2xl w-full max-w-lg object-cover border border-cyan-900/30"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-800 animate-bounce"
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase text-cyan-700">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-cyan-700 to-transparent" />
      </div>
    </section>
  );
}
