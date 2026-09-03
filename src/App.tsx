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

export default function App() {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [prefilledReservationNotes, setPrefilledReservationNotes] = useState('');

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
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D9A35F] selection:text-[#070707] relative overflow-x-hidden font-sans">
      {/* Custom Spring Cursor */}
      <CustomCursor />

      {/* Ambient Simmering Shader Canvas */}
      <AmbientShader opacity={0.2} />

      {/* Sticky Luxury Navbar */}
      <Navbar
        onOpenMenuModal={() => setIsMenuModalOpen(true)}
        onNavigateToReservations={scrollToReservations}
      />

      {/* Main Container - Constrained to max-w-[1280px] on desktop as requested */}
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

      {/* Footer & Owner Contact */}
      <Footer />
    </div>
  );
}
