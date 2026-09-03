import React from 'react';
import { motion } from 'motion/react';
import { TASTING_MENU_CHAPTERS } from '../data/restaurantData';
import { Sparkles, Wine, Flame } from 'lucide-react';

interface TastingMenuProps {
  onReserveTasting: () => void;
}

export const TastingMenu: React.FC<TastingMenuProps> = ({ onReserveTasting }) => {
  return (
    <section id="tasting" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
            The Grand Voyage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-4">
            7-Course Royal Mughlai Tasting Menu
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDBD] font-light leading-relaxed">
            A curated progression of delicate clarified essences, 12-hour slow-braised cuts, and heirloom sweets paired with botanical infusions.
          </p>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TASTING_MENU_CHAPTERS.map((chapter, colIdx) => (
            <motion.div
              key={chapter.chapter}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.0, delay: colIdx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative bg-[#121414] border p-8 flex flex-col justify-between transition-all duration-500 ${
                chapter.highlight
                  ? 'border-[#D9A35F] shadow-[0_0_40px_rgba(217,163,95,0.15)]'
                  : 'border-white/10 hover:border-[#D9A35F]/40'
              }`}
            >
              {/* Highlight Badge */}
              {chapter.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D9A35F] text-[#070707] text-[10px] font-mono font-semibold tracking-widest uppercase">
                  SIGNATURE BANQUET
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#D9A35F]">
                    {chapter.chapter}
                  </span>
                  <span className="text-xs text-[#BDBDBD]/60 font-mono">
                    {chapter.subtitle}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white font-normal mb-8 pb-4 border-b border-white/10">
                  {chapter.title}
                </h3>

                {/* Courses List */}
                <div className="space-y-6">
                  {chapter.courses.map((course) => (
                    <div key={course.courseNumber} className="group">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-serif text-base text-white group-hover:text-[#D9A35F] transition-colors">
                          {course.title}
                        </span>
                        <span className="text-xs font-mono text-[#D9A35F] ml-2">
                          Course {course.courseNumber}
                        </span>
                      </div>

                      {course.urduTitle && (
                        <span className="text-xs text-[#D9A35F]/60 font-serif block mb-1">
                          {course.urduTitle}
                        </span>
                      )}

                      <p className="text-xs text-[#BDBDBD] font-light leading-relaxed mb-2">
                        {course.description}
                      </p>

                      {course.pairingNote && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#C97A2B] font-mono">
                          <Wine className="w-3 h-3" />
                          <span>{course.pairingNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Summary Bar */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD] mb-4">
                  {chapter.pairingSummary}
                </div>
                {chapter.highlight && (
                  <button
                    onClick={onReserveTasting}
                    className="w-full py-3 bg-[#D9A35F] text-[#070707] text-xs font-medium uppercase tracking-[0.2em] hover:bg-transparent hover:text-[#D9A35F] border border-[#D9A35F] transition-all"
                  >
                    Reserve Tasting Table
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tasting Details Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-12 p-6 sm:p-8 bg-[#121414]/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#D9A35F]/40 flex items-center justify-center text-[#D9A35F] bg-[#D9A35F]/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white">
                Mughlai Royal Degustation — PKR 14,500 / Guest
              </h4>
              <p className="text-xs text-[#BDBDBD] font-light mt-0.5">
                Available exclusively by prior reservation (minimum 24 hours advance notice). Includes welcome infusion and chef tableside presentation.
              </p>
            </div>
          </div>

          <button
            onClick={onReserveTasting}
            className="px-6 py-3 border border-[#D9A35F] text-[#D9A35F] text-xs uppercase tracking-[0.2em] hover:bg-[#D9A35F] hover:text-[#070707] transition-all whitespace-nowrap active:scale-95"
          >
            Book Degustation
          </button>
        </motion.div>
      </div>
    </section>
  );
};
