import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  X,
  Palette,
  UtensilsCrossed,
  Tags,
  CalendarCheck,
  Building2,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Flame,
  Search,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useAdmin, THEME_PRESETS, ADMIN_SECRET_KEY } from '../context/AdminContext';
import { DishItem, ReservationRecord } from '../types';
import { seedInitialMenuToSupabase, getStoredSupabaseConfig } from '../lib/supabase';

export const AdminModal: React.FC = () => {
  const {
    isAdminUnlocked,
    isAdminModalOpen,
    unlockAdmin,
    lockAdmin,
    closeAdminModal,
    themeSettings,
    updateThemeSettings,
    applyPreset,
    resetThemeToDefault,
    restaurantInfo,
    updateRestaurantInfo,
    menuItems,
    categories,
    addDish,
    updateDish,
    deleteDish,
    addCategory,
    deleteCategory,
    refreshMenu,
    reservations,
    isLoadingReservations,
    refreshReservations,
    updateReservationStatus,
    deleteReservation,
  } = useAdmin();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'theme' | 'menu' | 'categories' | 'reservations' | 'info' | 'tools'
  >('theme');

  // Passphrase Lock State
  const [passphraseInput, setPassphraseInput] = useState('');
  const [passphraseError, setPassphraseError] = useState(false);

  // Menu Form State (Add / Edit)
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishFormData, setDishFormData] = useState<DishItem>({
    id: '',
    name: '',
    urduName: '',
    category: 'mains',
    price: 'PKR 2,500',
    description: '',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
    tag: '',
    featured: false,
    spicyLevel: 2,
  });
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');

  // New Category State
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Notifications
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  if (!isAdminModalOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(passphraseInput);
    if (success) {
      setPassphraseError(false);
      setPassphraseInput('');
      refreshReservations();
    } else {
      setPassphraseError(true);
    }
  };

  const openNewDishForm = () => {
    setEditingDishId(null);
    setDishFormData({
      id: `dish-custom-${Date.now()}`,
      name: '',
      urduName: '',
      category: categories[0] || 'mains',
      price: 'PKR 2,800',
      description: '',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
      tag: "CHEF'S SPECIAL",
      featured: false,
      spicyLevel: 2,
    });
    setIsEditingDish(true);
  };

  const openEditDishForm = (dish: DishItem) => {
    setEditingDishId(dish.id);
    setDishFormData({ ...dish });
    setIsEditingDish(true);
  };

  const handleDishSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishFormData.name.trim()) return;

    if (editingDishId) {
      await updateDish(dishFormData);
      showFeedback(`Dish "${dishFormData.name}" updated successfully!`);
    } else {
      await addDish(dishFormData);
      showFeedback(`New dish "${dishFormData.name}" added to menu!`);
    }
    setIsEditingDish(false);
  };

  const handleDeleteDish = async (dish: DishItem) => {
    if (window.confirm(`Are you sure you want to remove "${dish.name}" from the menu?`)) {
      await deleteDish(dish.id);
      showFeedback(`Dish "${dish.name}" removed.`);
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    addCategory(newCategoryInput.trim());
    showFeedback(`Category "${newCategoryInput}" created!`);
    setNewCategoryInput('');
  };

  const handleSeedMenu = async () => {
    setIsSeeding(true);
    const res = await seedInitialMenuToSupabase();
    setIsSeeding(false);
    if (res.success) {
      await refreshMenu();
      showFeedback(`Successfully seeded ${res.count} dishes to Supabase!`);
    } else {
      showFeedback(`Supabase seed: ${res.message}`);
    }
  };

  const supabaseConfig = getStoredSupabaseConfig();
  const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  // Filtered Menu Items
  const filteredDishes = menuItems.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (d.urduName && d.urduName.includes(menuSearch)) ||
      d.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory =
      menuFilterCategory === 'all' || d.category.toLowerCase() === menuFilterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-5xl h-[92vh] max-h-[900px] bg-[#0c0e10] border border-[#D9A35F]/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white rounded-lg relative"
      >
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#161a1d] border border-[#D9A35F] text-[#D9A35F] px-5 py-2.5 rounded-full text-xs font-mono shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* 1. LOCK SCREEN (If Passphrase Not Entered) */}
        {/* ============================================================== */}
        {!isAdminUnlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full border border-[#D9A35F]/40 bg-[#D9A35F]/10 flex items-center justify-center text-[#D9A35F] mb-6 shadow-[0_0_40px_rgba(217,163,95,0.2)]">
              <Lock className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#D9A35F] mb-2">
              SA Foods • Owner Control Panel
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-3">
              Admin Login
            </h2>
            <p className="text-xs sm:text-sm text-[#BDBDBD] font-light leading-relaxed mb-8">
              Enter your password to customize website colors, food items, categories, and manage reservations.
            </p>

            <form onSubmit={handleUnlockSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passphraseInput}
                  onChange={(e) => {
                    setPassphraseInput(e.target.value);
                    setPassphraseError(false);
                  }}
                  placeholder="Enter Password"
                  className={`w-full bg-[#141618] border px-4 py-3.5 text-center text-sm font-mono tracking-wider outline-none transition-colors rounded ${
                    passphraseError
                      ? 'border-red-500 text-red-400 placeholder:text-red-400/40'
                      : 'border-[#D9A35F]/40 focus:border-[#D9A35F] text-white placeholder:text-white/30'
                  }`}
                  autoFocus
                />
                {passphraseError && (
                  <p className="text-[11px] text-red-400 font-mono mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect password. Please try again.</span>
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D9A35F] text-[#070707] font-medium text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#e4b57b] transition-all flex items-center justify-center gap-2 cursor-pointer rounded shadow-lg active:scale-98"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Login to Admin Panel</span>
                </button>
              </div>
            </form>

            <button
              onClick={closeAdminModal}
              className="mt-8 text-xs font-mono uppercase tracking-widest text-[#BDBDBD]/60 hover:text-white transition-colors"
            >
              Cancel & Return to Site
            </button>
          </div>
        ) : (
          /* ============================================================== */
          /* 2. UNLOCKED EXECUTIVE ADMIN DASHBOARD */
          /* ============================================================== */
          <>
            {/* Top Bar Header */}
            <div className="border-b border-[#D9A35F]/30 bg-[#0e1012] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D9A35F]/15 border border-[#D9A35F] flex items-center justify-center text-[#D9A35F]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg text-white font-medium tracking-wide">
                      {restaurantInfo.brandName}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#D9A35F]/20 text-[#D9A35F] border border-[#D9A35F]/40">
                      Admin Suite
                    </span>
                  </div>
                  <span className="text-[11px] text-[#BDBDBD] font-mono flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span>{isSupabaseConfigured ? 'Supabase Live Connected' : 'Local State Mode'}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={lockAdmin}
                  className="px-3 py-1.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Lock Admin session"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>

                <button
                  onClick={closeAdminModal}
                  className="w-8 h-8 rounded border border-white/20 hover:border-[#D9A35F] text-white/70 hover:text-[#D9A35F] flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Admin Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="border-b border-white/10 bg-[#121417] px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  setActiveTab('theme');
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'theme'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Live Colors & Theme</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('menu');
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'menu'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dishes & Menu ({menuItems.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('categories');
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'categories'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <Tags className="w-3.5 h-3.5" />
                <span>Categories ({categories.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('reservations');
                  refreshReservations();
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Live Reservations ({reservations.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('info');
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'info'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Restaurant Info</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tools');
                  setIsEditingDish(false);
                }}
                className={`py-3.5 px-3 sm:px-4 text-xs font-mono tracking-wider uppercase border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'tools'
                    ? 'border-[#D9A35F] text-[#D9A35F] font-semibold'
                    : 'border-transparent text-[#BDBDBD]/70 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>DB Tools</span>
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0c0e10]">
              {/* ============================================================== */}
              {/* TAB 1: LIVE COLORS & THEME GRADIENTS */}
              {/* ============================================================== */}
              {activeTab === 'theme' && (
                <div className="space-y-8 max-w-4xl">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Live Color Palette & Imperial Gradients
                    </h3>
                    <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                      Select a bespoke Pakistani luxury preset or pick custom hex colors. Any change instantly transforms every button, border, glowing accent, and text gradient across the website!
                    </p>
                  </div>

                  {/* Preset Cards */}
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[#D9A35F] block mb-3">
                      1. Instant Mughal Aesthetic Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                        const isSelected = themeSettings.preset === key;
                        const label =
                          key === 'royal-gold'
                            ? 'Royal Gold'
                            : key === 'emerald-palace'
                            ? 'Emerald Palace'
                            : key === 'ruby-imperial'
                            ? 'Mughal Ruby'
                            : key === 'amber-hearth'
                            ? 'Amber Hearth'
                            : key === 'midnight-sapphire'
                            ? 'Midnight Sapphire'
                            : 'Velvet Amethyst';

                        return (
                          <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`p-3 rounded border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#D9A35F] bg-[#1a1d20] shadow-[0_0_20px_rgba(217,163,95,0.2)]'
                                : 'border-white/10 bg-[#121416] hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-5 h-5 rounded-full border border-white/20 shadow"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white/20"
                                style={{ backgroundColor: preset.burntOrange }}
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-mono text-white font-medium block truncate">
                                {label}
                              </span>
                              <span className="text-[9px] font-mono text-[#BDBDBD]/60 uppercase block">
                                {preset.accentColor}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Hex Color Pickers */}
                  <div className="border border-white/10 bg-[#121416] p-6 rounded space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-widest text-[#D9A35F] flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span>2. Custom Color & Glow Sliders</span>
                      </label>
                      <button
                        onClick={resetThemeToDefault}
                        className="text-[11px] font-mono text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset to Default Gold</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Primary Accent Color */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-mono text-white">Primary Gold / Accent</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeSettings.accentColor}
                            onChange={(e) => updateThemeSettings({ accentColor: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border border-white/20 bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={themeSettings.accentColor}
                            onChange={(e) => updateThemeSettings({ accentColor: e.target.value })}
                            className="bg-[#08090a] border border-white/20 px-3 py-2 text-xs font-mono text-white rounded w-full outline-none focus:border-[#D9A35F]"
                          />
                        </div>
                      </div>

                      {/* Burnt Orange / Secondary Accent */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-mono text-white">Gradient Secondary</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeSettings.burntOrange}
                            onChange={(e) => updateThemeSettings({ burntOrange: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border border-white/20 bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={themeSettings.burntOrange}
                            onChange={(e) => updateThemeSettings({ burntOrange: e.target.value })}
                            className="bg-[#08090a] border border-white/20 px-3 py-2 text-xs font-mono text-white rounded w-full outline-none focus:border-[#D9A35F]"
                          />
                        </div>
                      </div>

                      {/* Background Tone */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-mono text-white">Background Shade</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeSettings.bgColor}
                            onChange={(e) => updateThemeSettings({ bgColor: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border border-white/20 bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={themeSettings.bgColor}
                            onChange={(e) => updateThemeSettings({ bgColor: e.target.value })}
                            className="bg-[#08090a] border border-white/20 px-3 py-2 text-xs font-mono text-white rounded w-full outline-none focus:border-[#D9A35F]"
                          />
                        </div>
                      </div>

                      {/* Glow Intensity */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-mono text-white">
                          <span>Radial Glow Opacity</span>
                          <span className="text-[#D9A35F]">
                            {Math.round(themeSettings.glowOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.4"
                          step="0.02"
                          value={themeSettings.glowOpacity}
                          onChange={(e) =>
                            updateThemeSettings({ glowOpacity: parseFloat(e.target.value) })
                          }
                          className="mt-3 cursor-pointer accent-[#D9A35F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Component Preview Card */}
                  <div className="border border-white/10 bg-[#121416] p-6 rounded space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D9A35F] block">
                      3. Live Theme Preview
                    </span>

                    <div
                      className="p-6 rounded border transition-colors relative overflow-hidden"
                      style={{
                        backgroundColor: themeSettings.surfaceColor,
                        borderColor: `${themeSettings.accentColor}55`,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span
                            className="text-[10px] font-mono tracking-widest uppercase block mb-1"
                            style={{ color: themeSettings.accentColor }}
                          >
                            Live Gradient Test
                          </span>
                          <h4
                            className="font-serif text-2xl font-normal"
                            style={{
                              backgroundImage: `linear-gradient(135deg, ${themeSettings.accentColor}, ${themeSettings.accentLight}, ${themeSettings.burntOrange})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            Mughlai Charcoal Smoked Delicacies
                          </h4>
                        </div>

                        <button
                          className="px-6 py-2.5 rounded text-xs font-mono uppercase tracking-widest font-medium transition-all"
                          style={{
                            backgroundColor: themeSettings.accentColor,
                            color: '#070707',
                            boxShadow: `0 0 25px ${themeSettings.accentColor}55`,
                          }}
                        >
                          Book Table
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: DISHES & MENU MANAGEMENT */}
              {/* ============================================================== */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl text-white font-normal mb-1">
                        Dishes & Culinary Offerings
                      </h3>
                      <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                        Add, edit prices, descriptions, images, and categories. Changes sync locally and directly to Supabase!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={openNewDishForm}
                        className="px-4 py-2.5 bg-[#D9A35F] text-[#070707] font-mono text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#e4b57b] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Dish</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Dish Form Modal Inside Admin */}
                  {isEditingDish && (
                    <motion.form
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleDishSave}
                      className="border border-[#D9A35F] bg-[#14171a] p-6 rounded space-y-4 shadow-2xl relative"
                    >
                      <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="font-serif text-lg text-[#D9A35F]">
                          {editingDishId ? 'Edit Dish Details' : 'Create New Menu Item'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditingDish(false)}
                          className="text-white/60 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        {/* Name (English) */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Dish Name (English) *</label>
                          <input
                            type="text"
                            required
                            value={dishFormData.name}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, name: e.target.value })
                            }
                            placeholder="e.g. Special Mutton Ribs"
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                          />
                        </div>

                        {/* Urdu Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Urdu Name (اردو نام)</label>
                          <input
                            type="text"
                            value={dishFormData.urduName || ''}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, urduName: e.target.value })
                            }
                            placeholder="خصوصی مٹن رِبز"
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none text-right font-serif"
                          />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Category *</label>
                          <select
                            value={dishFormData.category}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, category: e.target.value })
                            }
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none capitalize"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c} className="capitalize bg-[#121417]">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Price (e.g. PKR 3,400) *</label>
                          <input
                            type="text"
                            required
                            value={dishFormData.price}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, price: e.target.value })
                            }
                            placeholder="PKR 3,400"
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                          />
                        </div>

                        {/* Tag */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Badge / Tag</label>
                          <input
                            type="text"
                            value={dishFormData.tag || ''}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, tag: e.target.value })
                            }
                            placeholder="CHEF'S SIGNATURE"
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none uppercase"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Image URL</label>
                          <input
                            type="url"
                            value={dishFormData.image}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, image: e.target.value })
                            }
                            placeholder="https://..."
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-3 flex flex-col gap-1.5">
                          <label className="text-[#BDBDBD]">Description *</label>
                          <textarea
                            required
                            rows={2}
                            value={dishFormData.description}
                            onChange={(e) =>
                              setDishFormData({ ...dishFormData, description: e.target.value })
                            }
                            placeholder="Detailed cooking technique, marinade, spices, and cut of meat..."
                            className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                          />
                        </div>

                        {/* Featured Checkbox & Spicy */}
                        <div className="md:col-span-3 flex items-center gap-6 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-white">
                            <input
                              type="checkbox"
                              checked={Boolean(dishFormData.featured)}
                              onChange={(e) =>
                                setDishFormData({ ...dishFormData, featured: e.target.checked })
                              }
                              className="accent-[#D9A35F] w-4 h-4 cursor-pointer"
                            />
                            <span>Featured on Homepage</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsEditingDish(false)}
                          className="px-4 py-2 border border-white/20 text-white/70 hover:text-white rounded text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#D9A35F] text-[#070707] font-semibold rounded text-xs font-mono uppercase tracking-wider hover:bg-[#e4b57b] transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save & Sync Dish</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* Search and Category Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="Search dishes by name or description..."
                        className="w-full bg-[#121417] border border-white/15 focus:border-[#D9A35F] pl-9 pr-3 py-2 text-xs font-mono text-white rounded outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                      <button
                        onClick={() => setMenuFilterCategory('all')}
                        className={`px-3 py-1.5 text-xs font-mono rounded capitalize transition-colors ${
                          menuFilterCategory === 'all'
                            ? 'bg-[#D9A35F] text-[#070707] font-semibold'
                            : 'bg-[#121417] text-white/70 hover:text-white'
                        }`}
                      >
                        All ({menuItems.length})
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setMenuFilterCategory(c)}
                          className={`px-3 py-1.5 text-xs font-mono rounded capitalize transition-colors whitespace-nowrap ${
                            menuFilterCategory === c
                              ? 'bg-[#D9A35F] text-[#070707] font-semibold'
                              : 'bg-[#121417] text-white/70 hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-[#121416] border border-white/10 hover:border-[#D9A35F]/40 p-4 rounded flex flex-col justify-between transition-all group relative"
                      >
                        <div>
                          <div className="relative h-36 w-full rounded overflow-hidden mb-3 bg-black/40">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {dish.tag && (
                              <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm border border-[#D9A35F]/50 text-[#D9A35F] text-[9px] font-mono px-2 py-0.5 rounded uppercase">
                                {dish.tag}
                              </span>
                            )}
                            <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                              {dish.category}
                            </span>
                          </div>

                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="font-serif text-base text-white font-medium leading-snug">
                              {dish.name}
                            </h4>
                            <span className="font-mono text-xs text-[#D9A35F] font-semibold whitespace-nowrap">
                              {dish.price}
                            </span>
                          </div>

                          {dish.urduName && (
                            <span className="font-serif text-xs text-[#D9A35F]/80 block text-right mb-2">
                              {dish.urduName}
                            </span>
                          )}

                          <p className="text-[11px] text-[#BDBDBD] font-light line-clamp-2 leading-relaxed mb-4">
                            {dish.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
                          <span className="text-[10px] text-white/50">
                            {dish.featured ? '⭐ Featured' : 'Regular'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditDishForm(dish)}
                              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-[#D9A35F] transition-colors cursor-pointer"
                              title="Edit dish"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: CATEGORIES MANAGER */}
              {/* ============================================================== */}
              {activeTab === 'categories' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Menu Categories
                    </h3>
                    <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                      Create new categories (e.g. "Royal Handi", "Charcoal Steaks", "Mocktails") to organize your menu items.
                    </p>
                  </div>

                  {/* Add Category Form */}
                  <form
                    onSubmit={handleAddCategorySubmit}
                    className="flex gap-2 border border-white/15 bg-[#121416] p-4 rounded"
                  >
                    <input
                      type="text"
                      required
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="e.g. Royal Karahi & Handi, Charcoal BBQ..."
                      className="flex-1 bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-4 py-2.5 text-xs font-mono text-white rounded outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#D9A35F] text-[#070707] font-mono text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#e4b57b] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </form>

                  {/* Categories List */}
                  <div className="border border-white/10 bg-[#121416] rounded divide-y divide-white/10">
                    {categories.map((cat) => {
                      const count = menuItems.filter(
                        (d) => d.category.toLowerCase() === cat.toLowerCase()
                      ).length;
                      const isDefault = ['starters', 'mains', 'desserts', 'beverages'].includes(cat);

                      return (
                        <div key={cat} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A35F]" />
                            <div>
                              <span className="text-sm font-mono text-white font-medium capitalize block">
                                {cat}
                              </span>
                              <span className="text-[11px] font-mono text-[#BDBDBD]/60">
                                {count} dish(es) assigned
                              </span>
                            </div>
                          </div>

                          {!isDefault && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat}"?`)) {
                                  deleteCategory(cat);
                                  showFeedback(`Category "${cat}" removed.`);
                                }
                              }}
                              className="p-1.5 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: LIVE RESERVATIONS FROM SUPABASE */}
              {/* ============================================================== */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl text-white font-normal mb-1">
                        Live Customer Reservations
                      </h3>
                      <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                        Real-time bookings recorded in your Supabase database table (<code className="text-[#D9A35F]">reservations</code>).
                      </p>
                    </div>

                    <button
                      onClick={refreshReservations}
                      disabled={isLoadingReservations}
                      className="px-4 py-2 border border-[#D9A35F] text-[#D9A35F] hover:bg-[#D9A35F] hover:text-[#070707] rounded text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoadingReservations ? 'animate-spin' : ''}`}
                      />
                      <span>Refresh Live Data</span>
                    </button>
                  </div>

                  {/* Summary Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#121416] border border-white/10 p-3 rounded">
                      <span className="text-[10px] font-mono uppercase text-[#BDBDBD] block">
                        Total Requests
                      </span>
                      <span className="text-2xl font-serif text-white font-medium">
                        {reservations.length}
                      </span>
                    </div>
                    <div className="bg-[#121416] border border-emerald-500/20 p-3 rounded">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                        Confirmed
                      </span>
                      <span className="text-2xl font-serif text-emerald-300 font-medium">
                        {reservations.filter((r) => r.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="bg-[#121416] border border-sky-500/20 p-3 rounded">
                      <span className="text-[10px] font-mono uppercase text-sky-400 block">
                        Seated / Active
                      </span>
                      <span className="text-2xl font-serif text-sky-300 font-medium">
                        {reservations.filter((r) => r.status === 'seated').length}
                      </span>
                    </div>
                    <div className="bg-[#121416] border border-red-500/20 p-3 rounded">
                      <span className="text-[10px] font-mono uppercase text-red-400 block">
                        Cancelled
                      </span>
                      <span className="text-2xl font-serif text-red-300 font-medium">
                        {reservations.filter((r) => r.status === 'cancelled').length}
                      </span>
                    </div>
                  </div>

                  {/* Reservations Table */}
                  {reservations.length === 0 ? (
                    <div className="bg-[#121416] border border-white/10 p-12 text-center rounded space-y-3">
                      <CalendarCheck className="w-10 h-10 text-[#D9A35F]/60 mx-auto" />
                      <h4 className="font-serif text-lg text-white font-normal">
                        No reservations recorded yet
                      </h4>
                      <p className="text-xs text-[#BDBDBD] font-light max-w-md mx-auto">
                        When a customer fills out the "Reserve Table" form on the website, their full contact details and date will appear here instantly!
                      </p>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded overflow-x-auto bg-[#121416]">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="border-b border-white/15 bg-black/30 text-[#D9A35F]">
                            <th className="p-3">Voucher / ID</th>
                            <th className="p-3">Guest</th>
                            <th className="p-3">Date & Time</th>
                            <th className="p-3">Party & Zone</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Special Notes</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {reservations.map((r) => {
                            const cleanPhone = r.phone.replace(/[^0-9]/g, '');
                            const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                              r.name
                            )},%20confirming%20your%20table%20reservation%20at%20SA%20Foods%20for%20${
                              r.date
                            }%20at%20${r.time}.`;

                            return (
                              <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-semibold text-white whitespace-nowrap">
                                  {r.id}
                                </td>
                                <td className="p-3">
                                  <span className="text-white font-medium block">{r.name}</span>
                                  <span className="text-[10px] text-white/50">{r.email}</span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-[#BDBDBD]">
                                  <span className="text-white block">{r.date}</span>
                                  <span className="text-[10px] text-[#D9A35F]">{r.time}</span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="text-white block">{r.guests} Guest(s)</span>
                                  <span className="text-[10px] text-[#BDBDBD] capitalize">
                                    {r.seating}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white">{r.phone}</span>
                                    {r.phone && (
                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-emerald-500/10"
                                        title="Chat on WhatsApp"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 max-w-[200px] truncate text-white/70 italic text-[11px]">
                                  {r.special_requests || '—'}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <select
                                    value={r.status}
                                    onChange={(e) =>
                                      updateReservationStatus(
                                        r.id,
                                        e.target.value as ReservationRecord['status']
                                      )
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-mono outline-none border cursor-pointer ${
                                      r.status === 'confirmed'
                                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                                        : r.status === 'seated'
                                        ? 'bg-sky-950/40 border-sky-500 text-sky-300'
                                        : r.status === 'completed'
                                        ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                                        : 'bg-red-950/40 border-red-500 text-red-300'
                                    }`}
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="seated">Seated</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={async () => {
                                      if (
                                        window.confirm(
                                          `Delete reservation record "${r.id}" for ${r.name}?`
                                        )
                                      ) {
                                        await deleteReservation(r.id);
                                        showFeedback(`Reservation ${r.id} deleted.`);
                                      }
                                    }}
                                    className="p-1 text-white/40 hover:text-red-400 transition-colors"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: RESTAURANT INFO & HERO SETTINGS */}
              {/* ============================================================== */}
              {activeTab === 'info' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Restaurant Information & Announcement Bar
                    </h3>
                    <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                      Customize your brand title, chef's name, booking phone, address, and live announcement banner.
                    </p>
                  </div>

                  <div className="border border-white/10 bg-[#121416] p-6 rounded space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Brand Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Brand Name</label>
                        <input
                          type="text"
                          value={restaurantInfo.brandName}
                          onChange={(e) => updateRestaurantInfo({ brandName: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>

                      {/* Tagline */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Hero Tagline</label>
                        <input
                          type="text"
                          value={restaurantInfo.tagline}
                          onChange={(e) => updateRestaurantInfo({ tagline: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>

                      {/* Chef Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Executive Chef / Visionary</label>
                        <input
                          type="text"
                          value={restaurantInfo.chefName}
                          onChange={(e) => updateRestaurantInfo({ chefName: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>

                      {/* Phone / WhatsApp */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Booking Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={restaurantInfo.phone}
                          onChange={(e) => updateRestaurantInfo({ phone: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>

                      {/* Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Physical Address</label>
                        <input
                          type="text"
                          value={restaurantInfo.address}
                          onChange={(e) => updateRestaurantInfo({ address: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>

                      {/* Timings */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[#BDBDBD]">Operating Hours</label>
                        <input
                          type="text"
                          value={restaurantInfo.openingHours}
                          onChange={(e) => updateRestaurantInfo({ openingHours: e.target.value })}
                          className="bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Announcement Banner */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-white font-medium flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D9A35F]" />
                          <span>Top Announcement Banner</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restaurantInfo.announcementEnabled}
                            onChange={(e) =>
                              updateRestaurantInfo({ announcementEnabled: e.target.checked })
                            }
                            className="accent-[#D9A35F] w-4 h-4"
                          />
                          <span className="text-[#D9A35F]">
                            {restaurantInfo.announcementEnabled ? 'Enabled (Live)' : 'Disabled'}
                          </span>
                        </label>
                      </div>

                      <input
                        type="text"
                        value={restaurantInfo.announcementText}
                        onChange={(e) =>
                          updateRestaurantInfo({ announcementText: e.target.value })
                        }
                        placeholder="e.g. Special Tasting Menu: 7-Course Royal Mughlai Degustation now serving..."
                        className="w-full bg-[#0b0d0e] border border-white/20 focus:border-[#D9A35F] px-3 py-2 text-white rounded outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 6: DB TOOLS & HELPERS */}
              {/* ============================================================== */}
              {activeTab === 'tools' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Database Sync & Maintenance Tools
                    </h3>
                    <p className="text-xs sm:text-sm text-[#BDBDBD] font-light">
                      One-click seed tools and Supabase table synchronization.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Seed Menu Button */}
                    <div className="bg-[#121416] border border-white/10 p-5 rounded space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-mono uppercase text-[#D9A35F] block mb-1">
                          Seed All Dishes to Supabase
                        </span>
                        <p className="text-[11px] text-[#BDBDBD] font-light">
                          Uploads and overwrites all 12 initial restaurant dishes (Karahi, Charsi Tikka, Seekh Kebab, etc.) to your live Supabase <code className="text-[#D9A35F]">menu_items</code> table.
                        </p>
                      </div>

                      <button
                        onClick={handleSeedMenu}
                        disabled={isSeeding}
                        className="w-full py-2.5 bg-[#D9A35F] text-[#070707] font-mono text-xs uppercase font-semibold rounded hover:bg-[#e4b57b] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                        <span>{isSeeding ? 'Seeding to Supabase...' : 'Seed 12 Dishes Now'}</span>
                      </button>
                    </div>

                    {/* Reload from Supabase */}
                    <div className="bg-[#121416] border border-white/10 p-5 rounded space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-mono uppercase text-sky-400 block mb-1">
                          Pull Fresh Data from Supabase
                        </span>
                        <p className="text-[11px] text-[#BDBDBD] font-light">
                          Fetch latest menu changes and reload the live database into this session.
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          await refreshMenu();
                          await refreshReservations();
                          showFeedback('Pulled fresh menu and reservations from Supabase!');
                        }}
                        className="w-full py-2.5 border border-sky-400 text-sky-300 font-mono text-xs uppercase font-semibold rounded hover:bg-sky-400 hover:text-[#070707] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Pull & Reload All</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
