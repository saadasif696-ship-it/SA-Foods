import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowUp, Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full bg-[#070707] pt-24 pb-12 border-t border-[#D9A35F]/20 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#D9A35F] flex items-center justify-center bg-[#070707]">
                <span className="font-serif text-[#D9A35F] text-lg font-bold">SA</span>
              </div>
              <span className="font-serif text-2xl text-white tracking-widest font-normal">
                SA FOODS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#BDBDBD] font-light leading-relaxed max-w-sm">
              An architectural celebration of authentic Pakistani gastronomy, centuries-old spice routes, and Mughlai fire-craft by Muhammad Saad Asif.
            </p>

            <div className="pt-2 text-[11px] font-mono uppercase tracking-widest text-[#D9A35F]">
              FINE DINING • PRIVATE SANCTUARY
            </div>
          </div>

          {/* Concierge & Hours */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h3 className="font-serif text-lg text-white font-normal mb-1">
              Dining Hours & Service
            </h3>
            <div className="text-xs text-[#BDBDBD] font-light space-y-2">
              <p>
                <strong className="text-white font-medium">Tuesday — Sunday:</strong>
                <br />
                Dinner: 06:30 PM — 11:30 PM
              </p>
              <p>
                <strong className="text-white font-medium">Friday & Saturday:</strong>
                <br />
                Late Hearth: 06:30 PM — 01:00 AM
              </p>
              <p className="text-[#C97A2B] text-[11px] font-mono">
                * Mondays Reserved for Private Banquets
              </p>
            </div>
          </div>

          {/* Owner / Developer Contact (MANDATORY EXACT DATA) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <h3 className="font-serif text-lg text-white font-normal mb-1">
              Owner & Culinary Direction
            </h3>

            <div className="bg-[#121414] border border-white/10 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#D9A35F] font-mono">Founder / Chef:</span>
                <strong>Muhammad Saad Asif</strong>
              </div>

              <div className="flex items-center gap-2 text-[#BDBDBD]">
                <MapPin className="w-3.5 h-3.5 text-[#D9A35F]" />
                <span>Karachi, Pakistan</span>
              </div>

              <div className="flex items-center gap-2 text-[#BDBDBD]">
                <Mail className="w-3.5 h-3.5 text-[#D9A35F]" />
                <a
                  href="mailto:saadasif0014@gmail.com"
                  className="hover:text-[#D9A35F] transition-colors underline-offset-4 hover:underline"
                >
                  saadasif0014@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BDBDBD] block mb-2">
                Private Table Invitations & Seasonal Menus
              </span>

              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#D9A35F] bg-[#D9A35F]/10 border border-[#D9A35F]/30 p-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Invitation request confirmed. Welcome to SA Foods.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    placeholder="Enter email for private tastings..."
                    className="bg-[#121414] border border-white/20 focus:border-[#D9A35F] px-3.5 py-2 text-xs text-white placeholder:text-white/30 outline-none flex-grow"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D9A35F] text-[#070707] text-xs uppercase font-medium tracking-wider hover:bg-white transition-colors flex items-center gap-1"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar with mandatory copyright & scroll to top */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#BDBDBD] font-light">
          <p>© 2026 SA Foods by Muhammad Saad Asif. All rights reserved.</p>

          <div className="flex items-center gap-6 text-[11px] font-mono tracking-wider">
            <a href="#about" className="hover:text-[#D9A35F] transition-colors">
              PHILOSOPHY
            </a>
            <a href="#menu" className="hover:text-[#D9A35F] transition-colors">
              MENU
            </a>
            <a href="#reservations" className="hover:text-[#D9A35F] transition-colors">
              CONCIERGE
            </a>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 border border-white/20 hover:border-[#D9A35F] flex items-center justify-center text-white hover:text-[#D9A35F] transition-all ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
