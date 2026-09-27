import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Utensils, Check, Database, Receipt } from 'lucide-react';
import { DishItem } from '../types';
import { useAdmin } from '../context/AdminContext';
import { AnimatedReceiptSlip } from './AnimatedReceiptSlip';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForReservation?: (dishName: string) => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onSelectForReservation,
}) => {
  const { menuItems, categories } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [orderCode, setOrderCode] = useState(() => `SAF-ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  // Background scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryTabs = [
    { id: 'all', label: 'Complete Collection' },
    ...categories.map((c) => ({
      id: c.toLowerCase(),
      label: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ];

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  const starters = menuItems.filter((item) => item.category === 'starters');
  const mains = menuItems.filter((item) => item.category === 'mains');
  const desserts = menuItems.filter((item) => item.category === 'desserts');
  const beverages = menuItems.filter((item) => item.category === 'beverages');

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderSection = (title: string, urduSubtitle: string, items: DishItem[]) => (
    <div className="mb-14">
      <div className="flex items-baseline justify-between border-b border-[#D9A35F]/30 pb-3 mb-6">
        <div>
          <h3 className="font-serif text-2xl text-[#D9A35F] tracking-wide font-normal">
            {title}
          </h3>
          <span className="text-xs text-[#BDBDBD] tracking-widest uppercase font-light">
            Traditional Mughlai & Frontier Preparations
          </span>
        </div>
        <span className="font-serif text-lg text-[#D9A35F]/60 italic">{urduSubtitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="group flex gap-3.5 sm:gap-4 p-3 hover:bg-white/[0.03] transition-colors border-b border-white/5 items-start"
            >
              {item.image && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border border-white/10 group-hover:border-[#D9A35F]/50 transition-colors bg-[#0d0e0f] relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
                </div>
              )}

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-base sm:text-lg text-white font-normal group-hover:text-[#D9A35F] transition-colors">
                      {item.name}
                    </span>
                    {item.tag && (
                      <span className="text-[9px] px-1.5 py-0.5 border border-[#D9A35F]/30 text-[#D9A35F] font-mono uppercase tracking-wider whitespace-nowrap">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Elegant dashed line connecting to price */}
                  <div className="flex-grow mx-2 border-b border-dashed border-white/20 min-w-[12px] hidden sm:block" />

                  <span className="font-mono text-sm sm:text-base text-[#D9A35F] whitespace-nowrap font-medium">
                    {item.price}
                  </span>
                </div>

                {item.urduName && (
                  <span className="text-xs text-[#BDBDBD]/60 font-serif my-0.5">
                    {item.urduName}
                  </span>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
                  <p className="text-xs text-[#BDBDBD] font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                    {item.description}
                  </p>
                  <button
                    onClick={() => {
                      toggleSelectItem(item.id);
                      onSelectForReservation?.(item.name);
                    }}
                    className={`self-start sm:self-auto sm:ml-3 text-[10px] uppercase font-mono px-2 py-1 transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[#D9A35F] text-[#070707] font-semibold'
                        : 'border border-white/20 text-[#BDBDBD] hover:border-[#D9A35F] hover:text-[#D9A35F]'
                    }`}
                  >
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Added
                      </span>
                    ) : (
                      '+ Add to Interest'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-[#070707]/95 backdrop-blur-2xl flex flex-col overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#070707]/90 backdrop-blur-xl border-b border-[#D9A35F]/20 py-5 px-6 sm:px-8 lg:px-12">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] mb-1">
                <Sparkles className="w-3 h-3" />
                <span>SA Foods Master Catalog</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Complete Culinary Selection
              </h2>
            </div>

            <button
              id="close-menu-modal-btn"
              onClick={onClose}
              className="w-11 h-11 rounded-full border border-[#D9A35F]/40 flex items-center justify-center text-[#D9A35F] hover:bg-[#D9A35F] hover:text-[#070707] transition-all duration-300 active:scale-90"
              aria-label="Close menu modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="max-w-[1280px] mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto pt-4 no-scrollbar">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#D9A35F] text-[#070707] font-medium'
                    : 'text-[#BDBDBD] hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-10 flex-grow">
          {activeCategory === 'all' ? (
            <>
              {categories.map((cat) => {
                const catDishes = menuItems.filter(
                  (d) => d.category.toLowerCase() === cat.toLowerCase()
                );
                if (catDishes.length === 0) return null;
                const title = cat.charAt(0).toUpperCase() + cat.slice(1);
                return (
                  <React.Fragment key={cat}>
                    {renderSection(title, '', catDishes)}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                {filteredItems.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="group flex gap-3.5 sm:gap-4 p-4 bg-[#121414]/60 border border-white/5 hover:border-[#D9A35F]/30 transition-all items-start"
                    >
                      {item.image && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border border-white/10 group-hover:border-[#D9A35F]/50 transition-colors bg-[#0d0e0f] relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-lg text-white font-normal group-hover:text-[#D9A35F] transition-colors">
                              {item.name}
                            </span>
                            {item.tag && (
                              <span className="text-[9px] px-1.5 py-0.5 border border-[#D9A35F]/30 text-[#D9A35F] font-mono uppercase tracking-wider whitespace-nowrap">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex-grow mx-2 border-b border-dashed border-white/20 hidden sm:block" />
                          <span className="font-mono text-base text-[#D9A35F] font-medium whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                        {item.urduName && (
                          <span className="text-xs text-[#BDBDBD]/60 font-serif my-0.5">
                            {item.urduName}
                          </span>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                          <p className="text-xs text-[#BDBDBD] font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                            {item.description}
                          </p>
                          <button
                            onClick={() => {
                              toggleSelectItem(item.id);
                              onSelectForReservation?.(item.name);
                            }}
                            className={`self-start sm:self-auto sm:ml-3 text-[10px] uppercase font-mono px-2.5 py-1.5 transition-all shrink-0 ${
                              isSelected
                                ? 'bg-[#D9A35F] text-[#070707] font-semibold'
                                : 'border border-white/20 text-[#BDBDBD] hover:border-[#D9A35F] hover:text-[#D9A35F]'
                            }`}
                          >
                            {isSelected ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected items notification bar */}
          {selectedItems.length > 0 && (() => {
            const chosenDishes = menuItems.filter((m) => selectedItems.includes(m.id));
            const totalNumber = chosenDishes.reduce((acc, curr) => {
              const numeric = parseInt(curr.price.replace(/[^\d]/g, ''), 10) || 0;
              return acc + numeric;
            }, 0);
            const formattedTotal = `PKR ${totalNumber.toLocaleString()}`;

            return (
              <div className="sticky bottom-6 mt-8 p-4 bg-[#121414] border border-[#D9A35F] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl z-30">
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-[#D9A35F]" />
                  <span className="text-xs sm:text-sm text-white font-light">
                    You have selected <strong className="text-[#D9A35F]">{selectedItems.length}</strong> dish(es) • Estimated Total: <strong className="text-[#D9A35F]">{formattedTotal}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderCode(`SAF-ORD-${Math.floor(1000 + Math.random() * 9000)}`);
                      setIsSlipOpen(true);
                    }}
                    className="px-4 py-2 bg-[#1E1E1E] border border-[#D9A35F]/60 text-[#D9A35F] hover:bg-[#D9A35F] hover:text-[#070707] text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Slip Animation</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-[#D9A35F] text-[#070707] text-xs uppercase font-medium tracking-widest hover:bg-[#e4b57b] transition-colors cursor-pointer"
                  >
                    Proceed to Table
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Animated Order Slip for Selected Menu Dishes */}
        {(() => {
          const chosenDishes = menuItems.filter((m) => selectedItems.includes(m.id));
          const totalNumber = chosenDishes.reduce((acc, curr) => {
            const numeric = parseInt(curr.price.replace(/[^\d]/g, ''), 10) || 0;
            return acc + numeric;
          }, 0);
          const formattedTotal = `PKR ${totalNumber.toLocaleString()}`;

          return (
            <AnimatedReceiptSlip
              isOpen={isSlipOpen}
              onClose={() => setIsSlipOpen(false)}
              type="order"
              receiptNo={orderCode}
              customerName="Valued Guest"
              customerPhone="+92 300 1234567"
              dateTime={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Dine-in / Takeaway'}
              items={chosenDishes.map((d) => ({
                name: d.name,
                qty: 1,
                price: d.price,
              }))}
              totalAmount={formattedTotal}
              specialRequests="Selected from SA Foods Master Menu Catalog"
            />
          );
        })()}
      </motion.div>
    </AnimatePresence>
  );
};
