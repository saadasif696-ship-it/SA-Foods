export interface DishItem {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  price: string;
  image: string;
  category: string;
  tag?: string;
  spicyLevel?: number;
  featured?: boolean;
}

export interface ThemeSettings {
  accentColor: string;
  accentLight: string;
  accentDark: string;
  burntOrange: string;
  bgColor: string;
  surfaceColor: string;
  preset: 'royal-gold' | 'emerald-palace' | 'ruby-imperial' | 'amber-hearth' | 'midnight-sapphire' | 'custom';
  glowOpacity: number;
}

export interface RestaurantInfo {
  brandName: string;
  tagline: string;
  chefName: string;
  phone: string;
  address: string;
  openingHours: string;
  announcementEnabled: boolean;
  announcementText: string;
}

export interface ReservationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  seating: string;
  special_requests?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface TastingCourse {
  courseNumber: string;
  title: string;
  urduTitle?: string;
  subtitle: string;
  description: string;
  pairingNote?: string;
  tag?: string;
}

export interface TastingChapter {
  chapter: string;
  title: string;
  subtitle: string;
  courses: TastingCourse[];
  pairingSummary: string;
  highlight?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  publication: string;
  rating?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  aspect: 'portrait' | 'square' | 'wide';
}

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  seating: string;
  specialRequests: string;
}
