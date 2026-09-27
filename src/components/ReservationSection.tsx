import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, Send, Database } from 'lucide-react';
import { ReservationData } from '../types';
import { saveReservationToSupabase, getSupabaseClient } from '../lib/supabase';

interface ReservationSectionProps {
  prefilledNotes?: string;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ prefilledNotes = '' }) => {
  const [formData, setFormData] = useState<ReservationData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '20:00',
    guests: '2',
    seating: 'courtyard',
    specialRequests: prefilledNotes,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [savedToSupabase, setSavedToSupabase] = useState(false);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Update specialRequests if prefilled changes
  React.useEffect(() => {
    if (prefilledNotes) {
      setFormData((prev) => ({
        ...prev,
        specialRequests: prev.specialRequests
          ? `${prev.specialRequests}; Interested in: ${prefilledNotes}`
          : `Interested in: ${prefilledNotes}`,
      }));
    }
  }, [prefilledNotes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setSupabaseLoading(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `SAF-2026-${randomNum}`;
    setReservationCode(code);

    try {
      const res = await saveReservationToSupabase(code, formData);
      setSupabaseLoading(false);
      setIsSubmitted(true);
      if (res.success) {
        setSavedToSupabase(true);
      } else {
        setSubmissionError(res.message);
      }
    } catch (err: any) {
      setSupabaseLoading(false);
      setIsSubmitted(true);
      setSubmissionError(err?.message || 'Sync error');
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSavedToSupabase(false);
    setSubmissionError(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '20:00',
      guests: '2',
      seating: 'courtyard',
      specialRequests: '',
    });
  };

  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <section id="reservations" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10 overflow-hidden">
      {/* Subtle gold glowing radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(217, 163, 95, 0.08) 0%, rgba(201, 122, 43, 0.03) 45%, transparent 75%)',
        }}
      />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
            Secure Your Table
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-3">
            Reservation Request
          </h2>
          <p className="text-sm text-[#BDBDBD] font-light leading-relaxed">
            We welcome reservations up to 30 days in advance. For tasting menu bookings or parties exceeding 8 guests, our concierge personally attends to your preferences.
          </p>
        </div>

        {/* Form or Confirmation Card */}
        <div className="bg-[#121414] border border-[#D9A35F]/40 p-8 sm:p-12 lg:p-14 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Muhammad Saad Asif"
                    className="bg-[#070707] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="saadasif0014@gmail.com"
                    className="bg-[#070707] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD]">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="bg-[#070707] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D9A35F]" />
                    <span>Seating Date *</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={minDate}
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="bg-[#070707] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                {/* Time Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D9A35F]" />
                    <span>Seating Time *</span>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="bg-[#121212] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="18:30">06:30 PM — Twilight Seating</option>
                    <option value="19:30">07:30 PM — Imperial Dinner</option>
                    <option value="20:30">08:30 PM — Prime Candlelight</option>
                    <option value="21:30">09:30 PM — Hearth Service</option>
                    <option value="22:30">10:30 PM — Late Night Nocturne</option>
                  </select>
                </div>

                {/* Number of Guests */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D9A35F]" />
                    <span>Party Size *</span>
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="bg-[#121212] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="1">1 Guest (Solo Connoisseur)</option>
                    <option value="2">2 Guests (Intimate Romance)</option>
                    <option value="4">4 Guests (Royal Table)</option>
                    <option value="6">6 Guests (Courtyard Banquet)</option>
                    <option value="8">8 Guests (Salon Dining)</option>
                    <option value="12">10+ Guests (Private Buyout inquiry)</option>
                  </select>
                </div>

                {/* Preferred Atmosphere Zone */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D9A35F]" />
                    <span>Preferred Atmosphere & Dining Room</span>
                  </label>
                  <select
                    name="seating"
                    value={formData.seating}
                    onChange={handleChange}
                    className="bg-[#121212] border-b border-white/20 focus:border-[#D9A35F] px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="courtyard">The Grand Courtyard (Candlelit Archways & Reflecting Pool)</option>
                    <option value="lounge">The Spice Lounge (Plush Velvet & Botanical Elixirs)</option>
                    <option value="kitchen">Chef's Live Counter (View of Glowing Charcoal Hearths)</option>
                    <option value="mughal-salon">Private Mughlai Salon (Secluded Imperial Suite)</option>
                  </select>
                </div>

                {/* Dietary Preferences & Notes */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[#BDBDBD]">
                    Dietary Requirements, Anniversaries, or Selected Courses
                  </label>
                  <textarea
                    name="specialRequests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="e.g. Celebrating an anniversary, Halal preference, requests for SA's Special Smash Patty Burger or 7-Course Tasting..."
                    className="bg-[#070707] border border-white/20 focus:border-[#D9A35F] p-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={supabaseLoading}
                    className="w-full py-4 bg-[#D9A35F] text-[#070707] font-medium text-xs uppercase tracking-[0.2em] border border-[#D9A35F] hover:bg-[#E5B57A] transition-all duration-300 shadow-[0_0_30px_rgba(217,163,95,0.25)] flex items-center justify-center gap-3 active:scale-98 disabled:opacity-60 cursor-pointer"
                  >
                    {supabaseLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#070707] border-t-transparent rounded-full animate-spin" />
                        <span>Reserving & Syncing to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm Reservation Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#BDBDBD]/60 font-light mt-3">
                    A confirmation call or SMS will be dispatched 24 hours prior to confirm seating.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-[#D9A35F] flex items-center justify-center text-[#D9A35F] bg-[#D9A35F]/10 mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D9A35F] block mb-2">
                  Request Received & Logged
                </span>

                <h3 className="font-serif text-3xl text-white font-normal mb-4">
                  Table Reserved for {formData.name}
                </h3>

                <p className="text-sm text-[#BDBDBD] font-light max-w-md mb-8 leading-relaxed">
                  Thank you for choosing SA Foods. Our maître d' will review your preferred seating and contact you at <strong className="text-white">{formData.email}</strong>.
                </p>

                {/* Booking Voucher Slip */}
                <div className="w-full max-w-md bg-[#070707] border border-[#D9A35F]/40 p-6 text-left mb-8 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <span className="font-serif text-lg text-[#D9A35F]">SA Foods</span>
                    <span className="font-mono text-xs text-white/80">{reservationCode}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#BDBDBD]">Guest Name:</span>
                      <span className="text-white font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BDBDBD]">Date & Time:</span>
                      <span className="text-white font-medium">
                        {formData.date || 'Tomorrow'} at {formData.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BDBDBD]">Party:</span>
                      <span className="text-white font-medium">{formData.guests} Guest(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BDBDBD]">Zone:</span>
                      <span className="text-[#D9A35F] capitalize font-medium">{formData.seating}</span>
                    </div>
                    {formData.specialRequests && (
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <span className="text-[#BDBDBD] block mb-1">Notes:</span>
                        <span className="text-white/80 italic">{formData.specialRequests}</span>
                      </div>
                    )}
                    {savedToSupabase && (
                      <div className="pt-2 border-t border-emerald-500/20 mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                        <Database className="w-3.5 h-3.5" />
                        <span>Synchronized with Supabase DB (Table: reservations)</span>
                      </div>
                    )}
                    {submissionError && (
                      <div className="pt-2 border-t border-amber-500/20 mt-2 flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
                        <span>DB Status: {submissionError}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-8 py-3 border border-[#D9A35F] text-[#D9A35F] text-xs uppercase tracking-widest hover:bg-[#D9A35F] hover:text-[#070707] transition-all"
                >
                  Make Another Reservation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
