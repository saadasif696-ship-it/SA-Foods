import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/CustomCursor';
import { AmbientShader } from './components/AmbientShader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMenu } from './components/FeaturedMenu';
import { MenuModal } from './components/MenuModal';
import { AboutSection } from './components/AboutSection';
import { TastingMenu } from './components/TastingMenu';
import { ImmersiveExperience } from './components/ImmersiveExperience';
import { Testimonials } from './components/Testimonials';
import { ReservationSection } from './components/ReservationSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { SupabaseModal } from './components/SupabaseModal';
import { AdminModal } from './components/AdminModal';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { getStoredSupabaseConfig, testSupabaseConnection } from './lib/supabase';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { restaurantInfo, themeSettings } = useAdmin();
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [prefilledReservationNotes, setPrefilledReservationNotes] = useState('');

  // Check Supabase connection on load
  useEffect(() => {
    const config = getStoredSupabaseConfig();
    if (config.url && config.anonKey) {
      testSupabaseConnection(config.url, config.anonKey).then((res) => {
        setIsSupabaseConnected(res.success);
      });
    }
  }, []);

  // Initialize Lenis for buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animFrameId = requestAnimationFrame(raf);
    }

    animFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animFrameId);
      lenis.destroy();
    };
  }, []);

  const scrollToReservations = () => {
    const el = document.getElementById('reservations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTasting = () => {
    const el = document.getElementById('tasting');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDishForReservation = (dishName: string) => {
    setPrefilledReservationNotes(dishName);
    scrollToReservations();
  };

  const handleReserveTasting = () => {
    setPrefilledReservationNotes('7-Course Royal Mughlai Tasting Menu Degustation');
    scrollToReservations();
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden font-sans transition-colors duration-500"
      style={{
        backgroundColor: themeSettings.bgColor,
        color: '#FFFFFF',
      }}
    >
      {/* Custom Spring Cursor */}
      <CustomCursor />

      {/* Ambient Simmering Shader Canvas */}
      <AmbientShader opacity={themeSettings.glowOpacity} />

      {/* Live Announcement Banner (Customizable via Admin Panel) */}
      {restaurantInfo.announcementEnabled && restaurantInfo.announcementText && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] py-2 px-4 text-center text-xs font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg"
          style={{
            backgroundColor: themeSettings.surfaceColor,
            borderBottom: `1px solid ${themeSettings.accentColor}66`,
            color: themeSettings.accentColor,
          }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{restaurantInfo.announcementText}</span>
        </div>
      )}

      {/* Sticky Luxury Navbar */}
      <Navbar
        onOpenMenuModal={() => setIsMenuModalOpen(true)}
        onNavigateToReservations={scrollToReservations}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* Main Container - Constrained to max-w-[1280px] on desktop */}
      <main className="w-full relative z-10">
        {/* Hero Section */}
        <Hero
          onReserveClick={scrollToReservations}
          onTastingClick={scrollToTasting}
        />

        {/* Featured Dishes Menu Preview */}
        <FeaturedMenu
          onOpenMenuModal={() => setIsMenuModalOpen(true)}
          onSelectDishForReservation={handleSelectDishForReservation}
        />

        {/* About Section - Chef Muhammad Saad Asif's Vision */}
        <AboutSection />

        {/* 7-Course Royal Mughlai Tasting Menu */}
        <TastingMenu onReserveTasting={handleReserveTasting} />

        {/* Immersive Experience & Sanctuary Atmosphere */}
        <ImmersiveExperience />

        {/* Critical Acclaim Testimonials Carousel */}
        <Testimonials />

        {/* Reservation Booking Section */}
        <ReservationSection prefilledNotes={prefilledReservationNotes} />

        {/* Visual Story Gallery */}
        <GallerySection />
      </main>

      {/* Full-Screen Glassmorphism Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSelectForReservation={(dishName) => {
          setPrefilledReservationNotes(dishName);
        }}
      />

      {/* Supabase Integration & Database Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnectedChange={(connected) => setIsSupabaseConnected(connected)}
      />

      {/* Full Executive Admin Modal (Secret key: SA FOODS ADMIN PANEL) */}
      <AdminModal />

      {/* Footer & Owner Contact */}
      <Footer onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
