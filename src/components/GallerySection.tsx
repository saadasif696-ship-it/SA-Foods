import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { GalleryItem } from '../types';
import { X, ZoomIn, Eye } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
            Visual Narrative
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-3">
            The Gallery & Artistry
          </h2>
          <p className="text-sm text-[#BDBDBD] font-light">
            Moments captured across our charcoal hearths, heirloom bronze tableware, and intimate night salons.
          </p>
        </div>

        {/* Editorial Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {/* Karahi Dish */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[0])}
              className="group relative aspect-[4/5] overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[0].imageUrl}
                alt={GALLERY_ITEMS[0].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[0].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[0].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Charcoal Skewers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[3])}
              className="group relative aspect-square overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[3].imageUrl}
                alt={GALLERY_ITEMS[3].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[3].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[3].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>
          </div>

          {/* Column 2 (Offset staggered) */}
          <div className="flex flex-col gap-6 md:pt-12">
            {/* Gourmet Burger on Slate */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[1])}
              className="group relative aspect-square overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[1].imageUrl}
                alt={GALLERY_ITEMS[1].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[1].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[1].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Plating Artistry */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[4])}
              className="group relative aspect-[4/5] overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[4].imageUrl}
                alt={GALLERY_ITEMS[4].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[4].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[4].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {/* Dum Biryani Handi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[2])}
              className="group relative aspect-[4/5] overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[2].imageUrl}
                alt={GALLERY_ITEMS[2].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[2].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[2].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Courtyard Dining Ambiance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.35 }}
              onClick={() => setActiveItem(GALLERY_ITEMS[5])}
              className="group relative aspect-square overflow-hidden border border-white/10 hover:border-[#D9A35F]/50 cursor-pointer bg-[#121414]"
            >
              <img
                src={GALLERY_ITEMS[5].imageUrl}
                alt={GALLERY_ITEMS[5].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#D9A35F] uppercase">
                  {GALLERY_ITEMS[5].category}
                </span>
                <h3 className="font-serif text-lg text-white font-normal">
                  {GALLERY_ITEMS[5].title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-[#070707]/80 text-[#D9A35F] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-[#070707]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#121414] border border-[#D9A35F]/40 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#070707]/80 border border-white/20 text-white flex items-center justify-center hover:bg-[#D9A35F] hover:text-[#070707] transition-all"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              <div className="p-6 sm:p-8 bg-[#121414] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D9A35F]">
                    {activeItem.category}
                  </span>
                  <h3 className="font-serif text-2xl text-white font-normal mt-0.5">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-[#BDBDBD] font-light mt-1 max-w-xl">
                    {activeItem.caption}
                  </p>
                </div>

                <div className="px-4 py-2 border border-[#D9A35F]/30 text-xs font-mono text-[#D9A35F]">
                  SA Foods Visual Archive
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
