import { ArrowRight, Users, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-50/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-sm font-medium">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Micro-Influencer Marketing Agency
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Connecting Brands With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
              High-Converting
            </span>{' '}
            Micro-Influencers
          </h1>

          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            We help brands scale with curated influencer campaigns and help creators secure consistent paid deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('influencer-form')}
              aria-label="Join as an influencer — scroll to application form"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <Users className="w-5 h-5" />
              Join as Influencer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('brand-form')}
              aria-label="Work with us as a brand — scroll to brand inquiry form"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-semibold rounded-2xl border-2 border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Work With Us as a Brand
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-teal-600" />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {['T', 'A', 'M', 'R'].map((letter, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: ['#0d9488', '#f59e0b', '#6366f1', '#ec4899'][i] }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">500+</span> influencers in our network
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-amber-100/30 rounded-3xl blur-2xl scale-110" />
            <img
              src="/assets/generated/hero-illustration.dim_1200x600.png"
              alt="Brand and influencer connection network illustration"
              className="relative rounded-3xl shadow-2xl w-full max-w-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce" aria-hidden="true">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent" />
      </div>
    </section>
  );
}
