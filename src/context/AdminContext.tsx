import React, { createContext, useContext, useEffect, useState } from 'react';
import { DishItem, ThemeSettings, RestaurantInfo, ReservationRecord } from '../types';
import { FULL_MENU_ITEMS } from '../data/restaurantData';
import {
  fetchMenuFromSupabase,
  fetchReservationsFromSupabase,
  saveDishToSupabase,
  deleteDishFromSupabase,
  updateReservationStatusInSupabase,
  deleteReservationFromSupabase,
  getSupabaseClient,
} from '../lib/supabase';

export const ADMIN_SECRET_KEY = 'saadasif0098';

export const THEME_PRESETS: Record<string, Omit<ThemeSettings, 'preset'>> = {
  'royal-gold': {
    accentColor: '#D9A35F',
    accentLight: '#FFE3C2',
    accentDark: '#B88242',
    burntOrange: '#C97A2B',
    bgColor: '#070707',
    surfaceColor: '#121414',
    glowOpacity: 0.15,
  },
  'emerald-palace': {
    accentColor: '#10B981',
    accentLight: '#A7F3D0',
    accentDark: '#047857',
    burntOrange: '#059669',
    bgColor: '#050D0A',
    surfaceColor: '#0A1813',
    glowOpacity: 0.18,
  },
  'ruby-imperial': {
    accentColor: '#E11D48',
    accentLight: '#FECDD3',
    accentDark: '#9F1239',
    burntOrange: '#BE123C',
    bgColor: '#0D0507',
    surfaceColor: '#1A0A0E',
    glowOpacity: 0.18,
  },
  'amber-hearth': {
    accentColor: '#F59E0B',
    accentLight: '#FDE68A',
    accentDark: '#B45309',
    burntOrange: '#D97706',
    bgColor: '#0B0906',
    surfaceColor: '#17130D',
    glowOpacity: 0.2,
  },
  'midnight-sapphire': {
    accentColor: '#38BDF8',
    accentLight: '#BAE6FD',
    accentDark: '#0284C7',
    burntOrange: '#0369A1',
    bgColor: '#040810',
    surfaceColor: '#091222',
    glowOpacity: 0.18,
  },
  'velvet-amethyst': {
    accentColor: '#C084FC',
    accentLight: '#E9D5FF',
    accentDark: '#7E22CE',
    burntOrange: '#9333EA',
    bgColor: '#090510',
    surfaceColor: '#130C22',
    glowOpacity: 0.18,
  },
};

const DEFAULT_THEME: ThemeSettings = {
  ...THEME_PRESETS['royal-gold'],
  preset: 'royal-gold',
};

const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  brandName: 'SA Foods',
  tagline: 'Royal Mughlai Cuisine & Charcoal Smokehouse',
  chefName: 'Chef Muhammad Saad Asif',
  phone: '+92 300 1234567',
  address: 'Gulberg III, Lahore, Pakistan',
  openingHours: '18:00 – 01:00 Daily',
  announcementEnabled: false,
  announcementText: '✨ Special Tasting Menu: 7-Course Royal Mughlai Degustation now serving. Book table early.',
};

const DEFAULT_CATEGORIES = ['starters', 'mains', 'desserts', 'beverages'];

interface AdminContextType {
  // Authentication & Access
  isAdminUnlocked: boolean;
  isAdminModalOpen: boolean;
  unlockAdmin: (passphrase: string) => boolean;
  lockAdmin: () => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;

  // Theme & Styling
  themeSettings: ThemeSettings;
  updateThemeSettings: (newSettings: Partial<ThemeSettings>) => void;
  applyPreset: (presetKey: string) => void;
  resetThemeToDefault: () => void;

  // Restaurant Info
  restaurantInfo: RestaurantInfo;
  updateRestaurantInfo: (newInfo: Partial<RestaurantInfo>) => void;

  // Food Menu Items & Categories
  menuItems: DishItem[];
  categories: string[];
  addDish: (dish: DishItem) => Promise<boolean>;
  updateDish: (dish: DishItem) => Promise<boolean>;
  deleteDish: (id: string) => Promise<boolean>;
  addCategory: (categoryName: string) => void;
  deleteCategory: (categoryName: string) => void;
  refreshMenu: () => Promise<void>;

  // Reservations
  reservations: ReservationRecord[];
  isLoadingReservations: boolean;
  refreshReservations: () => Promise<void>;
  updateReservationStatus: (id: string, status: ReservationRecord['status']) => Promise<boolean>;
  deleteReservation: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Secret Access
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('safoods_admin_unlocked') === 'true';
    }
    return false;
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // 2. Theme Customizer
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('safoods_theme_settings');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_THEME;
  });

  // Apply Theme CSS Variables to Root DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--theme-gold', themeSettings.accentColor);
    root.style.setProperty('--theme-gold-light', themeSettings.accentLight);
    root.style.setProperty('--theme-gold-dark', themeSettings.accentDark);
    root.style.setProperty('--theme-burnt-orange', themeSettings.burntOrange);
    root.style.setProperty('--theme-bg', themeSettings.bgColor);
    root.style.setProperty('--theme-surface', themeSettings.surfaceColor);
    root.style.setProperty(
      '--theme-glow',
      `rgba(${hexToRgb(themeSettings.accentColor)}, ${themeSettings.glowOpacity})`
    );

    // Also update body background
    document.body.style.backgroundColor = themeSettings.bgColor;

    localStorage.setItem('safoods_theme_settings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  // 3. Restaurant Information
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('safoods_restaurant_info');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_RESTAURANT_INFO;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('safoods_restaurant_info', JSON.stringify(restaurantInfo));
    }
  }, [restaurantInfo]);

  // 4. Categories
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('safoods_categories');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('safoods_categories', JSON.stringify(categories));
    }
  }, [categories]);

  // 5. Menu Items
  const [menuItems, setMenuItems] = useState<DishItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('safoods_custom_menu');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return FULL_MENU_ITEMS;
  });

  // Load from Supabase on start
  const refreshMenu = async () => {
    const res = await fetchMenuFromSupabase();
    if (res.items && res.items.length > 0) {
      setMenuItems(res.items);
      if (typeof window !== 'undefined') {
        localStorage.setItem('safoods_custom_menu', JSON.stringify(res.items));
      }
    }
  };

  useEffect(() => {
    refreshMenu();
  }, []);

  // 6. Reservations (Live)
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  const refreshReservations = async () => {
    setIsLoadingReservations(true);
    const res = await fetchReservationsFromSupabase();
    setIsLoadingReservations(false);
    if (res.data) {
      const mapped: ReservationRecord[] = res.data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        date: row.date,
        time: row.time,
        guests: String(row.guests || '2'),
        seating: row.seating || 'courtyard',
        special_requests: row.special_requests || '',
        status: row.status || 'confirmed',
        created_at: row.created_at,
      }));
      setReservations(mapped);
    }
  };

  // Listen strictly for /adminpanelofSAfoods in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAdminRoute = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (
        pathname.includes('adminpanelofsafoods') ||
        pathname.includes('adminpanelofsaffods') ||
        pathname.includes('adminpanelofsafood') ||
        pathname.includes('adminpaneofsafoods') ||
        pathname.includes('admin.safoods') ||
        hash.includes('adminpanelofsafoods') ||
        hash.includes('adminpanelofsaffods') ||
        hash.includes('adminpanelofsafood') ||
        hash.includes('adminpaneofsafoods') ||
        hash.includes('admin.safoods')
      ) {
        setIsAdminModalOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Keyboard shortcut listener: Ctrl + Shift + A (or Cmd + Shift + A) opens Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Authentication Handlers
  const unlockAdmin = (passphrase: string): boolean => {
    const cleanInput = passphrase.trim();
    // Accept simple password saadasif0098
    if (
      cleanInput === 'saadasif0098' ||
      cleanInput.toLowerCase() === 'saadasif0098' ||
      cleanInput.toUpperCase() === 'SA FOODS ADMIN PANEL' ||
      cleanInput.toUpperCase() === 'SAFOODS'
    ) {
      setIsAdminUnlocked(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('safoods_admin_unlocked', 'true');
      }
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safoods_admin_unlocked');
    }
  };

  const openAdminModal = () => {
    setIsAdminModalOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.toLowerCase().includes('adminpanelofsafoods')) {
      window.history.pushState(null, '', '/adminpanelofSAfoods');
    }
    if (isAdminUnlocked) {
      refreshReservations();
    }
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('admin') || h.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  // Theme Handlers
  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => ({
      ...prev,
      ...newSettings,
      preset: newSettings.preset || 'custom',
    }));
  };

  const applyPreset = (presetKey: string) => {
    const found = THEME_PRESETS[presetKey];
    if (found) {
      setThemeSettings({
        ...found,
        preset: presetKey as any,
      });
    }
  };

  const resetThemeToDefault = () => {
    setThemeSettings(DEFAULT_THEME);
  };

  // Restaurant Info Handlers
  const updateRestaurantInfo = (newInfo: Partial<RestaurantInfo>) => {
    setRestaurantInfo((prev) => ({ ...prev, ...newInfo }));
  };

  // Menu Handlers
  const addDish = async (dish: DishItem): Promise<boolean> => {
    const updated = [dish, ...menuItems];
    setMenuItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safoods_custom_menu', JSON.stringify(updated));
    }
    // Also sync to Supabase
    if (getSupabaseClient()) {
      await saveDishToSupabase(dish);
    }
    return true;
  };

  const updateDish = async (dish: DishItem): Promise<boolean> => {
    const updated = menuItems.map((item) => (item.id === dish.id ? dish : item));
    setMenuItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safoods_custom_menu', JSON.stringify(updated));
    }
    if (getSupabaseClient()) {
      await saveDishToSupabase(dish);
    }
    return true;
  };

  const deleteDish = async (id: string): Promise<boolean> => {
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safoods_custom_menu', JSON.stringify(updated));
    }
    if (getSupabaseClient()) {
      await deleteDishFromSupabase(id);
    }
    return true;
  };

  const addCategory = (categoryName: string) => {
    const clean = categoryName.trim().toLowerCase();
    if (clean && !categories.includes(clean)) {
      setCategories([...categories, clean]);
    }
  };

  const deleteCategory = (categoryName: string) => {
    setCategories(categories.filter((c) => c !== categoryName));
  };

  // Reservation Handlers
  const updateReservationStatus = async (
    id: string,
    status: ReservationRecord['status']
  ): Promise<boolean> => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    return await updateReservationStatusInSupabase(id, status);
  };

  const deleteReservation = async (id: string): Promise<boolean> => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    return await deleteReservationFromSupabase(id);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminUnlocked,
        isAdminModalOpen,
        unlockAdmin,
        lockAdmin,
        openAdminModal,
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
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Helper to convert hex to rgb string "217, 163, 95"
function hexToRgb(hex: string): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return '217, 163, 95';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}
