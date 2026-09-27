import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface FeaturedMenuProps {
  onOpenMenuModal: () => void;
  onSelectDishForReservation?: (dishName: string) => void;
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({
  onOpenMenuModal,
  onSelectDishForReservation,
}) => {
  const { menuItems } = useAdmin();
  const featured = menuItems.filter((d) => d.featured);
  const displayDishes = featured.length > 0 ? featured.slice(0, 4) : menuItems.slice(0, 4);

  return (
    <section id="menu" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
              Gastronomic Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
              The Masterpieces
            </h2>
            <p className="text-sm text-[#BDBDBD] font-light mt-2 max-w-md">
              Pinnacle creations representing the heritage, fire, and fragrance of our royal kitchens.
            </p>
          </div>

          <button
            id="view-full-menu-btn"
            onClick={onOpenMenuModal}
            className="group inline-flex items-center gap-3 px-6 py-3 border border-[#D9A35F]/50 text-[#D9A35F] text-xs uppercase tracking-[0.2em] hover:bg-[#D9A35F] hover:text-[#070707] transition-all duration-300 backdrop-blur-md active:scale-95"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-[#121414] border border-white/10 hover:border-[#D9A35F]/50 transition-all duration-500 overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(217,163,95,0.12)]"
            >
              {/* Aspect 3/4 Image Container */}
              <div className="w-full aspect-[3/4] overflow-hidden relative bg-[#0d0e0f]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#070707]/85 backdrop-blur-md border border-[#D9A35F]/40 text-xs font-mono text-[#D9A35F]">
                  {dish.price}
                </div>

                {/* Tag Badge */}
                {dish.tag && (
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#070707]/85 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest uppercase text-white/90">
                    {dish.tag}
                  </div>
                )}
              </div>

              {/* Text Information Base */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-[#121414]/90 backdrop-blur-sm">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-normal group-hover:text-[#D9A35F] transition-colors">
                      {dish.name}
                    </h3>
                  </div>

                  {dish.urduName && (
                    <span className="text-xs text-[#D9A35F]/80 block font-serif mb-2 tracking-wide">
                      {dish.urduName}
                    </span>
                  )}

                  <p className="text-xs text-[#BDBDBD] font-light leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Card Action Row */}
                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#C97A2B] font-mono flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>ROYAL SERVICE</span>
                  </span>

                  <button
                    onClick={() => onSelectDishForReservation?.(dish.name)}
                    className="text-xs text-[#D9A35F] hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-all"
                  >
                    <span>Reserve Dish</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
