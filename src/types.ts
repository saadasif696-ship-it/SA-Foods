export interface DishItem {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  price: string;
  image: string;
  category: 'starters' | 'mains' | 'desserts' | 'beverages';
  tag?: string;
  spicyLevel?: number;
  featured?: boolean;
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
