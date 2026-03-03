import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

interface NavbarProps {
  onAdminClick?: () => void;
  showAdminBack?: boolean;
  onBackToSite?: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "For Brands", href: "#for-brands" },
  { label: "For Influencers", href: "#for-influencers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({
  onAdminClick,
  showAdminBack,
  onBackToSite,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (showAdminBack) return;
    const sectionIds = [
      "home",
      "for-brands",
      "for-influencers",
      "pricing",
      "contact",
    ];
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, [showAdminBack]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
    setMobileOpen(false);
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1B2A]/95 backdrop-blur-md shadow-soft border-b border-cyan-900/30"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          {showAdminBack ? (
            <button
              type="button"
              onClick={onBackToSite}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Back to main site"
              data-ocid="nav.back.button"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Site
            </button>
          ) : (
            <button
              type="button"
              onClick={() => scrollToSection("#home")}
              aria-label="BRANDSMITRA home"
              className="flex items-center gap-2 group"
              data-ocid="nav.home.link"
            >
              <img
                src="/assets/uploads/ChatGPT-Image-Mar-3-2026-09_04_21-PM-2.png"
                alt="BRANDSMITRA"
                className="h-10 w-auto"
                style={{ mixBlendMode: "screen" }}
              />
            </button>
          )}
        </div>

        {/* Desktop Nav Links */}
        {!showAdminBack && (
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-cyan-400 bg-cyan-950/50"
                        : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/30"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    data-ocid={`nav.${id}.link`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {showAdminBack && (
          <span className="hidden md:block text-sm font-semibold text-cyan-400 tracking-wide uppercase">
            Admin Dashboard
          </span>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && isAdmin && !showAdminBack && (
            <button
              type="button"
              onClick={onAdminClick}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#4DFFD2] bg-cyan-950/50 hover:bg-cyan-900/50 rounded-full transition-colors"
              aria-label="Open admin dashboard"
              data-ocid="nav.admin.button"
            >
              Admin
            </button>
          )}
          <button
            type="button"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className={`hidden md:flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isAuthenticated
                ? "bg-cyan-950/50 hover:bg-cyan-900/50 text-slate-300"
                : "bg-cyan-500 hover:bg-cyan-400 text-[#0D1B2A] shadow-sm hover:shadow-cyan-glow"
            } disabled:opacity-50`}
            aria-label={isAuthenticated ? "Logout" : "Login"}
            data-ocid="nav.login.button"
          >
            {isLoggingIn ? "Logging in…" : isAuthenticated ? "Logout" : "Login"}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-cyan-300 hover:bg-cyan-950/50 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            data-ocid="nav.mobile.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0D1B2A] border-b border-cyan-900/30 shadow-lg`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-3 space-y-1">
          {!showAdminBack &&
            NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-cyan-400 bg-cyan-950/50"
                      : "text-slate-300 hover:bg-cyan-950/30"
                  }`}
                  data-ocid={`nav.mobile.${id}.link`}
                >
                  {link.label}
                </button>
              );
            })}
          {isAuthenticated && isAdmin && !showAdminBack && (
            <button
              type="button"
              onClick={() => {
                onAdminClick?.();
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-[#4DFFD2] bg-cyan-950/50"
              data-ocid="nav.mobile.admin.button"
            >
              Admin Dashboard
            </button>
          )}
          <div className="pt-2 border-t border-cyan-900/30">
            <button
              type="button"
              onClick={() => {
                handleAuth();
                setMobileOpen(false);
              }}
              disabled={isLoggingIn}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isAuthenticated
                  ? "bg-cyan-950/50 text-slate-300"
                  : "bg-cyan-500 text-[#0D1B2A]"
              } disabled:opacity-50`}
              data-ocid="nav.mobile.login.button"
            >
              {isLoggingIn
                ? "Logging in…"
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
