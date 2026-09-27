import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, X, CheckCircle2, UtensilsCrossed, Calendar, MapPin, Phone, User, Copy, Check, Sparkles } from 'lucide-react';

export interface AnimatedReceiptSlipProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'reservation' | 'order';
  receiptNo: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  dateTime?: string;
  partySize?: string;
  seatingZone?: string;
  specialRequests?: string;
  items?: Array<{ name: string; qty: number; price: string | number }>;
  totalAmount?: string;
}

export const AnimatedReceiptSlip: React.FC<AnimatedReceiptSlipProps> = ({
  isOpen,
  onClose,
  type = 'reservation',
  receiptNo,
  customerName,
  customerPhone,
  customerEmail,
  dateTime,
  partySize,
  seatingZone,
  specialRequests,
  items,
  totalAmount,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(receiptNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dark Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Realistic Receipt Drop Container */}
          <motion.div
            initial={{ y: -160, opacity: 0, rotate: -2, scale: 0.88 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
              transition: {
                type: 'spring',
                damping: 22,
                stiffness: 260,
                mass: 0.9,
              },
            }}
            exit={{
              y: 80,
              opacity: 0,
              rotate: 1,
              scale: 0.92,
              transition: { duration: 0.25, ease: 'easeIn' },
            }}
            className="relative z-10 w-full max-w-[420px] my-auto select-none"
          >
            {/* Action Bar (Top Controls) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-3 px-1 print:hidden"
            >
              <div className="flex items-center gap-1.5 text-[#D9A35F] text-xs font-mono tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D9A35F]" />
                <span className="uppercase text-[11px] font-semibold">
                  {type === 'reservation' ? 'Official Reservation Slip' : 'Order Invoice Slip'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print receipt slip"
                  className="px-2.5 py-1.5 bg-[#D9A35F] hover:bg-[#e2b06e] text-[#070707] font-mono text-[11px] font-medium rounded flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  title="Close receipt"
                  className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Paper Receipt Body with Sawtooth Bottom Edge */}
            <div
              className="bg-[#FCFBF7] text-[#1E1E1E] font-mono text-xs rounded-t-sm shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
              style={{
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.6))',
              }}
            >
              {/* Subtle Thermal Paper Line Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
                }}
              />

              <div className="p-6 sm:p-7 relative z-10 pb-10">
                {/* Header Section */}
                <div className="text-center border-b-2 border-dashed border-[#1E1E1E]/25 pb-4">
                  <div className="inline-flex items-center justify-center gap-2 mb-1.5">
                    <div className="p-1.5 bg-[#1E1E1E] text-[#D9A35F] rounded-full">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-wider text-[#1E1E1E]">
                      SA FOODS
                    </span>
                  </div>

                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600 font-sans font-medium">
                    Royal Pakistani Dining & Charcoal Grill
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-sans">
                    Islamabad • Lahore • Karachi | Tel: +92 300 1234567
                  </p>

                  <div className="mt-3 inline-block px-3 py-1 bg-[#1E1E1E] text-[#FCFBF7] text-[10px] tracking-[0.25em] uppercase font-bold">
                    {type === 'reservation' ? 'TABLE RESERVATION SLIP' : 'GUEST ORDER RECEIPT'}
                  </div>
                </div>

                {/* Voucher Meta Info */}
                <div className="py-3 border-b border-dashed border-[#1E1E1E]/20 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-sans uppercase text-[10px] tracking-wider">
                      Reference Code:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="font-bold tracking-wider text-[#1E1E1E] flex items-center gap-1 hover:text-[#B27B32] transition-colors cursor-pointer group"
                      title="Click to copy code"
                    >
                      <span>{receiptNo}</span>
                      {copied ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-sans uppercase text-[10px] tracking-wider">
                      Issued On:
                    </span>
                    <span className="text-gray-700">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      •{' '}
                      {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-sans uppercase text-[10px] tracking-wider">
                      Booking Status:
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold uppercase text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed & Logged</span>
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-3 border-b border-dashed border-[#1E1E1E]/20 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-500 font-sans uppercase block">
                        Guest Name
                      </span>
                      <span className="font-bold text-sm text-[#1E1E1E]">{customerName}</span>
                    </div>
                  </div>

                  {customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="text-[10px] text-gray-500 font-sans uppercase">Contact:</span>
                        <span className="font-medium text-gray-800">{customerPhone}</span>
                      </div>
                    </div>
                  )}

                  {dateTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="text-[10px] text-gray-500 font-sans uppercase">Schedule:</span>
                        <span className="font-semibold text-gray-900">{dateTime}</span>
                      </div>
                    </div>
                  )}

                  {partySize && (
                    <div className="flex items-center justify-between pl-5.5 text-[11px]">
                      <span className="text-[10px] text-gray-500 font-sans uppercase">Party Size:</span>
                      <span className="font-bold text-[#1E1E1E]">{partySize} Guest(s)</span>
                    </div>
                  )}

                  {seatingZone && (
                    <div className="flex items-center justify-between pl-5.5 text-[11px]">
                      <span className="text-[10px] text-gray-500 font-sans uppercase">Atmosphere:</span>
                      <span className="font-medium text-[#B27B32] capitalize">
                        {seatingZone.replace('-', ' ')}
                      </span>
                    </div>
                  )}

                  {specialRequests && (
                    <div className="mt-2 pt-2 border-t border-dotted border-gray-300 text-[11px] bg-black/[0.03] p-2 rounded">
                      <span className="text-[10px] text-gray-500 font-sans uppercase block mb-0.5">
                        Special Requests / Preferences:
                      </span>
                      <p className="italic text-gray-700 leading-relaxed font-sans text-[11px]">
                        "{specialRequests}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Items / Ordered Dishes (If supplied) */}
                {items && items.length > 0 && (
                  <div className="py-3 border-b border-dashed border-[#1E1E1E]/20">
                    <div className="flex justify-between text-[10px] text-gray-500 font-sans font-bold uppercase mb-2">
                      <span>Course / Item</span>
                      <span>Qty & Price</span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="font-medium text-gray-900 truncate max-w-[200px]">
                            {it.name}
                          </span>
                          <span className="text-gray-700">
                            {it.qty} × {it.price}
                          </span>
                        </div>
                      ))}
                    </div>
                    {totalAmount && (
                      <div className="flex justify-between font-bold text-sm text-[#1E1E1E] pt-2 mt-2 border-t border-dotted border-gray-400">
                        <span>Total Estimate:</span>
                        <span>{totalAmount}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Barcode & Footer Notice */}
                <div className="pt-4 text-center space-y-2">
                  <p className="text-[10px] text-gray-600 font-sans font-medium uppercase tracking-wider">
                    Please present this receipt upon arrival at the foyer
                  </p>

                  {/* Simulated Thermal Barcode */}
                  <div className="flex justify-center items-center gap-[2.5px] h-10 my-2 px-6">
                    {Array.from({ length: 46 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#1E1E1E] h-full"
                        style={{
                          width: (i % 4 === 0 ? 3 : i % 3 === 0 ? 1.5 : 2) + 'px',
                          opacity: i % 7 === 0 ? 0.35 : 1,
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-[10px] tracking-[0.25em] text-gray-600 font-bold">
                    * {receiptNo} *
                  </p>

                  <div className="pt-2">
                    <p className="text-[9px] text-gray-400 tracking-widest uppercase font-sans">
                      Thank you for dining with SA Foods
                    </p>
                  </div>
                </div>
              </div>

              {/* Realistic Zig-Zag Sawtooth Tear Cut Bottom */}
              <div
                className="w-full h-4 bg-[#FCFBF7] -mt-1"
                style={{
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 0%, 97.5% 100%, 95% 0%, 92.5% 100%, 90% 0%, 87.5% 100%, 85% 0%, 82.5% 100%, 80% 0%, 77.5% 100%, 75% 0%, 72.5% 100%, 70% 0%, 67.5% 100%, 65% 0%, 62.5% 100%, 60% 0%, 57.5% 100%, 55% 0%, 52.5% 100%, 50% 0%, 47.5% 100%, 45% 0%, 42.5% 100%, 40% 0%, 37.5% 100%, 35% 0%, 32.5% 100%, 30% 0%, 27.5% 100%, 25% 0%, 22.5% 100%, 20% 0%, 17.5% 100%, 15% 0%, 12.5% 100%, 10% 0%, 7.5% 100%, 5% 0%, 2.5% 100%, 0% 0%)',
                }}
              />
            </div>

            {/* Bottom Dismiss Tip */}
            <div className="text-center mt-3 print:hidden">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-mono text-white/60 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
              >
                Click here or anywhere outside to dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
