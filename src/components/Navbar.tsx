import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar, Sparkles, Database } from 'lucide-react';

interface NavbarProps {
  onOpenMenuModal: () => void;
  onNavigateToReservations: () => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenuModal,
  onNavigateToReservations,
  onOpenSupabaseModal,
  isSupabaseConnected = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple active section detection
      const sections = ['home', 'menu', 'about', 'tasting', 'experience', 'reviews', 'gallery', 'reservations', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Tasting Voyage', href: '#tasting' },
    { name: 'Atmosphere', href: '#experience' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reservations', href: '#reservations' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#070707]/90 backdrop-blur-xl border-b border-[#D9A35F]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#070707]/80 via-[#070707]/40 to-transparent backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="group flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 border border-[#D9A35F]/60 flex items-center justify-center bg-[#070707]/60 group-hover:border-[#D9A35F] group-hover:bg-[#D9A35F]/10 transition-all duration-300">
            <span className="font-serif text-[#D9A35F] text-lg font-bold tracking-tighter">SA</span>
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl text-white tracking-widest block font-medium group-hover:text-[#D9A35F] transition-colors">
              SA FOODS
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D9A35F] block font-light">
              Fine Pakistani Dining
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-xs uppercase tracking-[0.16em] transition-all duration-300 relative py-1 ${
                  isActive
                    ? 'text-[#D9A35F] font-medium'
                    : 'text-[#BDBDBD] hover:text-white font-light'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9A35F] to-transparent"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="nav-quick-menu-btn"
            onClick={onOpenMenuModal}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider text-[#BDBDBD] hover:text-[#D9A35F] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9A35F]" />
            <span>Catalog</span>
          </button>

          <button
            id="nav-reserve-table-btn"
            onClick={onNavigateToReservations}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[#070707] bg-[#D9A35F] border border-[#D9A35F] hover:bg-transparent hover:text-[#D9A35F] transition-all duration-300 shadow-[0_0_20px_rgba(217,163,95,0.2)] active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve Table</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#BDBDBD] hover:text-white lg:hidden border border-white/10 ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#070707]/98 backdrop-blur-2xl border-b border-[#D9A35F]/20 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-sm uppercase tracking-widest text-[#BDBDBD] hover:text-[#D9A35F] py-2 border-b border-white/5 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-[#D9A35F] text-xs">→</span>
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                {onOpenSupabaseModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSupabaseModal();
                    }}
                    className="w-full py-2.5 border border-emerald-500/40 text-emerald-400 text-xs uppercase tracking-widest hover:bg-emerald-950/30 flex items-center justify-center gap-2"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Supabase DB Settings</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMenuModal();
                  }}
                  className="w-full py-2.5 border border-[#D9A35F]/40 text-[#D9A35F] text-xs uppercase tracking-widest hover:bg-[#D9A35F]/10"
                >
                  View Full Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
