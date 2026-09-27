import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DishItem, ReservationData } from '../types';
import { FULL_MENU_ITEMS } from '../data/restaurantData';

export const DEFAULT_SUPABASE_URL = 'https://tferhpqipxnekdvdbntt.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZXJocHFpcHhuZWtkdmRibnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0ODQ2NDYsImV4cCI6MjEwNjA2MDY0Nn0.IbPrisMvYLZlOFLIRwIVWFPYMxCwgLrR3lln-V4mqVY';

const STORAGE_KEY_URL = 'safoods_supabase_url';
const STORAGE_KEY_ANON = 'safoods_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) || '' : '';

  // Default hardcoded project credentials always take precedence to ensure 100% connectivity anywhere
  const finalUrl = DEFAULT_SUPABASE_URL || storedUrl || envUrl;
  const finalKey = DEFAULT_SUPABASE_ANON_KEY || storedKey || envKey;

  return {
    url: finalUrl,
    anonKey: finalKey,
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    supabaseInstance = null; // reset cached instance
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Test connectivity with Supabase project
 */
export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const targetUrl = url || getStoredSupabaseConfig().url;
    const targetKey = anonKey || getStoredSupabaseConfig().anonKey;

    if (!targetUrl || !targetKey) {
      return { success: false, message: 'Supabase URL aur Anon Key provide karein.' };
    }

    const testClient = createClient(targetUrl, targetKey);
    // Simple query to check connectivity
    const { error } = await testClient.from('menu_items').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, connection is still valid!
      if (error.message.includes('relation "public.menu_items" does not exist') || error.code === '42P01') {
        return {
          success: true,
          message: 'Supabase Connected! Lekin "menu_items" table abhi nahi bani. SQL Editor me table create karein.',
        };
      }
      return { success: false, message: `Error: ${error.message}` };
    }

    return { success: true, message: 'Zabardast! Supabase se successfully connect ho chuka hai.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection fail ho gaya.' };
  }
}

/**
 * Fetch menu items from Supabase with fallback to static menu
 */
export async function fetchMenuItems(): Promise<{ items: DishItem[]; isFromDatabase: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { items: FULL_MENU_ITEMS, isFromDatabase: false };
  }

  try {
    const { data, error } = await client
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return { items: FULL_MENU_ITEMS, isFromDatabase: false };
    }

    const mapped: DishItem[] = data.map((row: any) => ({
      id: row.id,
      name: row.name || row.title,
      urduName: row.urdu_name || '',
      description: row.description || '',
      price: typeof row.price === 'number' ? `PKR ${row.price.toLocaleString()}` : row.price,
      image: row.image || row.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
      category: row.category || 'mains',
      tag: row.tag || '',
      featured: row.featured || false,
    }));

    return { items: mapped, isFromDatabase: true };
  } catch (err) {
    console.warn('Error reading from Supabase, using fallback menu data', err);
    return { items: FULL_MENU_ITEMS, isFromDatabase: false };
  }
}

/**
 * Save table reservation to Supabase
 */
export async function saveReservationToSupabase(
  reservationCode: string,
  data: ReservationData
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    const { error } = await client.from('reservations').insert({
      id: reservationCode,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      seating: data.seating,
      special_requests: data.specialRequests,
      status: 'confirmed',
    });

    if (error) {
      console.error('Supabase reservation insert error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Reservation saved to Supabase!' };
  } catch (err: any) {
    console.error('Reservation error:', err);
    return { success: false, message: err.message };
  }
}

/**
 * Seed initial SA Foods menu items to Supabase
 */
export async function seedInitialMenuToSupabase(): Promise<{ success: boolean; count: number; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, message: 'Supabase connected nahi hai' };
  }

  try {
    const payload = FULL_MENU_ITEMS.map((dish) => ({
      id: dish.id,
      name: dish.name,
      urdu_name: dish.urduName || '',
      description: dish.description,
      price: dish.price,
      category: dish.category,
      tag: dish.tag || '',
      image: dish.image,
      featured: dish.featured || false,
    }));

    const { error } = await client.from('menu_items').upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, count: 0, message: error.message };
    }

    return { success: true, count: payload.length, message: `${payload.length} menu items Supabase mein successfully seed ho gaye!` };
  } catch (err: any) {
    return { success: false, count: 0, message: err.message };
  }
}

export const SUPABASE_SQL_DDL = `-- ==========================================
-- SA Foods Pakistani Cuisine Database Schema
-- Run this in Supabase Dashboard -> SQL Editor
-- ==========================================

-- 1. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    urdu_name TEXT,
    description TEXT,
    price TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'mains',
    tag TEXT,
    image TEXT,
    featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT,
    total_amount TEXT NOT NULL,
    order_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    dish_id TEXT,
    dish_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    guests TEXT NOT NULL,
    seating TEXT DEFAULT 'courtyard',
    special_requests TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Public read access for menu items
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow Insert/Update Menu Items" ON public.menu_items FOR ALL USING (true);

-- Allow customers to submit orders & reservations
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Public Insert Reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Reservations" ON public.reservations FOR SELECT USING (true);
`;
