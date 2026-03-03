import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onAdminClick?: () => void;
  showAdminBack?: boolean;
  onBackToSite?: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'For Brands', href: '#for-brands' },
  { label: 'For Influencers', href: '#for-influencers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onAdminClick, showAdminBack, onBackToSite }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (showAdminBack) return;
    const sectionIds = ['home', 'for-brands', 'for-influencers', 'pricing', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [showAdminBack]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-100' : 'bg-transparent'
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
              onClick={onBackToSite}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
              aria-label="Back to main site"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Site
            </button>
          ) : (
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              aria-label="HP BRIDGE MEDIA home"
              className="flex items-center gap-2 group"
            >
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                HP <span className="text-teal-600">BRIDGE</span> MEDIA
              </span>
            </a>
          )}
        </div>

        {/* Desktop Nav Links */}
        {!showAdminBack && (
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-teal-700 bg-teal-50'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {showAdminBack && (
          <span className="hidden md:block text-sm font-semibold text-teal-700 tracking-wide uppercase">
            Admin Dashboard
          </span>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && isAdmin && !showAdminBack && (
            <button
              onClick={onAdminClick}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
              aria-label="Open admin dashboard"
            >
              Admin
            </button>
          )}
          <button
            onClick={handleAuth}
            disabled={isLoggingIn}
            className={`hidden md:flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isAuthenticated
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md'
            } disabled:opacity-50`}
            aria-label={isAuthenticated ? 'Logout' : 'Login'}
          >
            {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-white border-b border-slate-100 shadow-lg`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-3 space-y-1">
          {!showAdminBack && NAV_LINKS.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = activeSection === id;
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {isAuthenticated && isAdmin && !showAdminBack && (
            <button
              onClick={() => { onAdminClick?.(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-700 bg-amber-50"
            >
              Admin Dashboard
            </button>
          )}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => { handleAuth(); setMobileOpen(false); }}
              disabled={isLoggingIn}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isAuthenticated
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-teal-600 text-white'
              } disabled:opacity-50`}
            >
              {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
