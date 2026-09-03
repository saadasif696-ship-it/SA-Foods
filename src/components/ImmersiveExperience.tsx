import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Moon, Flame, GlassWater } from 'lucide-react';

export const ImmersiveExperience: React.FC = () => {
  const [activeZone, setActiveZone] = useState<number>(0);

  const zones = [
    {
      id: 'zone-1',
      number: 'ZONE 01',
      title: 'The Grand Courtyard',
      urduTitle: 'شاہی صحن',
      subtitle: 'Echoes of Ancient Lahore & Delhi',
      description:
        'Towering hand-carved terracotta arches, shimmering black reflecting pools, and flickering brass candle braziers create a serene sanctuary insulated from the urban pulse.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2M7sqnWFbJ_5XJmn6xA2IzAdhIj6KXTNTvVh74yJtNzYzPDaWdAHqZP89thj5Ekd8y0yLjZZiRYGPTneWheFP6-eYNBRLJQ0jxwqtt5LxPIELJQrVTJH9JkmFCm2OtZ3xSXAA4k9CPjAYMSw3g06kiEihs_ROdrKsw-EOImWhdxFtKlMJrIxE3veKGbLoESp2JBBTIvknQGWcHKC1qm2gtyuI4tw1kcQ1ktgbohrLSjIGzbbWa8oI',
      icon: Moon,
    },
    {
      id: 'zone-2',
      number: 'ZONE 02',
      title: 'The Spice Lounge & Salon',
      urduTitle: 'مصالحہ لاؤنج',
      subtitle: 'Intimate Velvet & Golden Ambiance',
      description:
        'Plush emerald and midnight velvet banquettes under recessed amber lighting. Designed for private gatherings, rare botanical mocktail pairings, and quiet contemplation.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXg4JHYeQVNbF5sBavWm1YTASde7w35dAKoivnu-1cdxGzLpfuYTtDpzICF1J_OiFhDpF191siteONSXSnRJrFBjthylpEqW8Ggl60I_5-Cjhl-I-iAdN2lcGIiFTUq10Ao9hE_Y7O3aKkSgeRCtA_GhMpTCWerrw5Ue2FGDt7OQgiPWeVBtO-9gFEBcs4HgTIBtKgPdgpDVt-MfHrEbws1HGzc1JI6G1QTxTTS7ZJQrk-6ggITisi',
      icon: GlassWater,
    },
    {
      id: 'zone-3',
      number: 'ZONE 03',
      title: 'Live Charcoal Kitchens',
      urduTitle: 'انگھیٹی و تندور',
      subtitle: 'The Roar of Wood-Fire Embers',
      description:
        'A glass-encased theatrical hearth where pitmasters tend glowing coals of babul wood and clay tandoor pits. Witness skewered kebabs and bubbling karahis come alive in real time.',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
      icon: Flame,
    },
  ];

  return (
    <section id="experience" className="w-full py-28 px-6 sm:px-8 lg:px-12 relative z-10 bg-[#070707]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D9A35F] block mb-2">
              Atmosphere & Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
              The Immersive Sanctuary
            </h2>
          </div>
          <p className="text-sm text-[#BDBDBD] font-light max-w-md">
            Conceived as an architectural retreat where ambient gold illumination, fragrant rosewood smoke, and intimate acoustic privacy converge.
          </p>
        </div>

        {/* 3 Zone Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {zones.map((zone, idx) => {
            const Icon = zone.icon;
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.0, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-[480px] border border-white/10 hover:border-[#D9A35F]/60 overflow-hidden flex flex-col justify-end p-8 transition-all duration-700 shadow-2xl"
                onMouseEnter={() => setActiveZone(idx)}
              >
                {/* Background Image with Zoom */}
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-108 transition-transform duration-1000 ease-out"
                  style={{ backgroundImage: `url('${zone.image}')` }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-black/30 opacity-90 group-hover:opacity-85 transition-opacity" />

                {/* Top Corner Badge */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1 bg-[#070707]/80 backdrop-blur-md border border-[#D9A35F]/30 text-[10px] font-mono text-[#D9A35F] tracking-widest">
                  <Icon className="w-3.5 h-3.5 text-[#D9A35F]" />
                  <span>{zone.number}</span>
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  <span className="text-xs text-[#D9A35F]/90 font-serif block mb-1">
                    {zone.urduTitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2 group-hover:text-[#D9A35F] transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-xs text-[#D9A35F] font-mono uppercase tracking-wider mb-3">
                    {zone.subtitle}
                  </p>
                  <p className="text-xs text-[#BDBDBD] font-light leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {zone.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
