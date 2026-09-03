import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Utensils, Award, Flame, Clock } from 'lucide-react';

interface HeroProps {
  onReserveClick: () => void;
  onTastingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReserveClick, onTastingClick }) => {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-28 pb-20 px-6 sm:px-8 lg:px-12"
    >
      {/* Background Image with precise radial vignette & left readability gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-[1.02] transform"
          style={{
            backgroundImage: `url('https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/restaurant_bg.png')`,
          }}
        />
        {/* Subtle edge vignette to softly darken corners without washing out the interior */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(7, 7, 7, 0.4) 70%, rgba(7, 7, 7, 0.95) 100%)',
          }}
        />
        {/* Left-side directional gradient for razor-sharp typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/90 via-[#070707]/60 to-transparent pointer-events-none" />
        {/* Bottom fade into the page body */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container (max-w-[1280px] boxed layout) */}
      <div className="max-w-[1280px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Headlines & Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Subtle gold badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#D9A35F]/10 border border-[#D9A35F]/30 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#D9A35F] animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D9A35F]">
              A Culinary Masterpiece by Muhammad Saad Asif
            </span>
          </motion.div>

          {/* Staggered Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] text-white font-normal leading-[1.12] tracking-tight mb-6"
          >
            Crafting{' '}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D9A35F] via-[#ffddb7] to-[#C97A2B]">
              Exceptional
            </span>{' '}
            <br className="hidden sm:inline" />
            Authentic Pakistani <br className="hidden sm:inline" />
            Culinary Experiences
          </motion.h1>

          {/* Body Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#BDBDBD] font-light leading-relaxed max-w-xl mb-8"
          >
            An immersive voyage across ancient spice routes and imperial Mughal banquets,
            reinvented for the contemporary global connoisseur in an atmosphere of hushed luxury
            and live open-fire hearths.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto"
          >
            <button
              id="hero-reserve-btn"
              onClick={onReserveClick}
              className="group w-full sm:w-auto px-8 py-4 bg-[#D9A35F] text-[#070707] font-medium text-xs uppercase tracking-[0.2em] border border-[#D9A35F] hover:bg-transparent hover:text-[#D9A35F] transition-all duration-300 shadow-[0_0_30px_rgba(217,163,95,0.25)] flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Reserve Your Table</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-tasting-btn"
              onClick={onTastingClick}
              className="w-full sm:w-auto px-8 py-4 bg-[#070707]/60 text-white font-normal text-xs uppercase tracking-[0.2em] border border-white/20 hover:border-[#D9A35F] hover:text-[#D9A35F] backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Explore Tasting Menu</span>
            </button>
          </motion.div>

          {/* Metric Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.65 }}
            className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 w-full max-w-lg"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[#D9A35F] text-xs font-mono mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>32 SPICES</span>
              </div>
              <p className="text-[11px] text-[#BDBDBD] uppercase tracking-wider font-light">
                Proprietary Pot Blend
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#D9A35F] text-xs font-mono mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>18 HOURS</span>
              </div>
              <p className="text-[11px] text-[#BDBDBD] uppercase tracking-wider font-light">
                Slow Charcoal Simmer
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#D9A35F] text-xs font-mono mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>MUGHLAL ERA</span>
              </div>
              <p className="text-[11px] text-[#BDBDBD] uppercase tracking-wider font-light">
                Preserved Gastronomy
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Floating Luxury Video Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -12, 0],
            }}
            transition={{
              opacity: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
              y: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 5.5,
                ease: 'easeInOut',
              },
            }}
            className="relative w-full max-w-[450px] aspect-[4/5] border border-[#D9A35F]/30 bg-[#070707]/60 backdrop-blur-md p-2 group shadow-[0_0_50px_rgba(217,163,95,0.15)]"
          >
            {/* Corner Luxury Frame Accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D9A35F]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D9A35F]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D9A35F]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D9A35F]" />

            <div className="relative w-full h-full overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              >
                <source
                  src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_food_video.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-85" />

              {/* Glass Overlay Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#070707]/85 backdrop-blur-md border border-[#D9A35F]/40 flex items-center justify-between shadow-2xl">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D9A35F] block mb-0.5">
                    Chef's Special
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-white font-medium">
                    SA's Special Smash Patty Burger
                  </h2>
                  <span className="text-[11px] text-[#BDBDBD] block font-light">
                    Dual Smashed Prime Beef & Brioche
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#D9A35F]/40 flex items-center justify-center text-[#D9A35F] bg-[#D9A35F]/10">
                  <Utensils className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
