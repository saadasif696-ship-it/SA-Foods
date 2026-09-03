import React from 'react';
import { motion } from 'motion/react';
import { Compass, Flame, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text on Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-white font-normal leading-[1.2]">
                Honoring Centuries of Royal Heritage Through Modern Gastronomy
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#BDBDBD] font-light leading-relaxed">
              Founded by culinary visionary and designer <strong>Muhammad Saad Asif</strong>, SA Foods is an impassioned ode to the magnificent culinary courts of the Mughal emperors and the rugged, time-honored hearths of the North-West Frontier.
            </p>

            <p className="text-sm sm:text-base text-[#BDBDBD] font-light leading-relaxed">
              For generations, Pakistani cuisine has been celebrated for its depth, aroma, and intensity. Saad Asif’s mission is to translate this profound heritage into an unapologetic, world-class fine-dining art form. Every dish reflects years of research into authentic clay handi techniques, slow charcoal roasting, cold-pressed ghee infusions, and ancient wild botanicals.
            </p>

            {/* Three Pillar Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#D9A35F]">
                  <Compass className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-mono">Origins</span>
                </div>
                <p className="text-xs text-[#BDBDBD] font-light">
                  Hand-sourced saffron, aged basmati, & mountain salts.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#D9A35F]">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-mono">Embers</span>
                </div>
                <p className="text-xs text-[#BDBDBD] font-light">
                  Direct charcoal cooking & 18-hour clay pot dum.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#D9A35F]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-mono">Elegance</span>
                </div>
                <p className="text-xs text-[#BDBDBD] font-light">
                  Contemporary slate plating & candlelight intimacy.
                </p>
              </div>
            </div>

            {/* Italicized signature as specified */}
            <div className="pt-6">
              <div className="font-serif italic text-4xl text-[#BDBDBD] opacity-80 mb-1 tracking-wide">
                Muhammad Saad Asif
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D9A35F] block font-mono">
                Founder & Executive Chef — SA Foods
              </span>
            </div>
          </motion.div>

          {/* Overlapping Circular Image on Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] rounded-full p-3 sm:p-4 border border-[#D9A35F]/40 shadow-[0_0_60px_rgba(217,163,95,0.15)] bg-[#070707]/60 backdrop-blur-md">
              {/* Outer decorative ring */}
              <div className="absolute inset-1 rounded-full border border-dashed border-[#D9A35F]/20 animate-[spin_60s_linear_infinite]" />

              {/* Inner Circular Image Container */}
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#121414]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3onT80_eyKDoyxtPIOv3OFg4lBazOG9VDVILwK0hO8XyyeEmPUBh3DypP3nzt40HauvnwbcIazreg2jeieP-tSgt9-n49oWFoHXDb9lz7rG0kbM6V2O-QTsVWejLYGlZzt4IQBcGKo2Hy7mdMcNCe4hP2tfL-YmqCg0pXofX9Ev_JWADgPlnjOQgVUGUnM5xP0Ul_N_rE9cjxBiArQ5N8Qc3JK1eawlsf-UjQa094tmEeTjNHZkePNXeBl-ZLLbcUw"
                  alt="Chef Muhammad Saad Asif"
                  className="w-full h-full object-cover object-center filter grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* EST. 2026 Badge */}
              <div className="absolute -bottom-2 right-8 sm:right-12 px-5 py-2 bg-[#070707] border border-[#D9A35F] text-[#D9A35F] text-xs font-mono tracking-widest uppercase shadow-xl">
                EST. 2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
