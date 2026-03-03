import { Briefcase, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
  iconBg: string;
}

const STATS: StatItem[] = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: 320,
    suffix: "+",
    label: "Campaigns Completed",
    color: "text-cyan-400",
    iconBg: "bg-cyan-950/80",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 500,
    suffix: "+",
    label: "Influencers in Network",
    color: "text-[#4DFFD2]",
    iconBg: "bg-[#4DFFD2]/10",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: 150,
    suffix: "+",
    label: "Brands Served",
    color: "text-cyan-400",
    iconBg: "bg-cyan-950/80",
  },
  {
    icon: <Star className="w-6 h-6" />,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    color: "text-[#4DFFD2]",
    iconBg: "bg-[#4DFFD2]/10",
  },
];

function AnimatedCounter({
  target,
  suffix,
  duration = 2000,
}: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      className="py-16 bg-gradient-to-r from-cyan-950 to-[#0066B2]/40 border-y border-cyan-900/30"
      aria-label="Key statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div
                className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center ${stat.color} mb-3 group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <div className={`text-4xl font-extrabold ${stat.color} mb-1`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-slate-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
