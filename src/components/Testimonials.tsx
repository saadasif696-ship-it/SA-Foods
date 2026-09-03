import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data/restaurantData';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="reviews" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10 bg-[#070707]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
            Critical Acclaim
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            Voices of Epicures
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Subtle gold glow behind active review */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9A35F]/5 to-transparent blur-3xl pointer-events-none" />

          <div className="relative bg-[#121414] border border-[#D9A35F]/30 p-8 sm:p-14 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-start mb-8">
              <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-[#D9A35F]/30" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D9A35F] text-[#D9A35F]" />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-[160px] flex flex-col justify-between"
              >
                <p className="font-serif text-lg sm:text-2xl text-white font-light italic leading-relaxed mb-8">
                  "{current.quote}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-t border-white/10 pt-6">
                  <div>
                    <span className="font-serif text-lg sm:text-xl text-white block">
                      {current.author}
                    </span>
                    <span className="text-xs text-[#BDBDBD] font-light">
                      {current.role}
                    </span>
                  </div>

                  <span className="text-xs font-mono tracking-wider uppercase text-[#D9A35F]">
                    {current.publication}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 transition-all duration-300 ${
                      currentIndex === index
                        ? 'w-8 bg-[#D9A35F]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 border border-white/20 hover:border-[#D9A35F] text-[#BDBDBD] hover:text-[#D9A35F] flex items-center justify-center transition-all active:scale-90"
                  aria-label="Previous quote"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 border border-white/20 hover:border-[#D9A35F] text-[#BDBDBD] hover:text-[#D9A35F] flex items-center justify-center transition-all active:scale-90"
                  aria-label="Next quote"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
