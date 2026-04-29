
export enum UserRole {
  USER = 'USER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum TravelType {
  SOLO = 'Solo',
  COUPLE = 'Couple',
  FAMILY = 'Family',
  FRIENDS = 'Friends',
  BIKER = 'Biker'
}

export enum TripCategory {
  CITY = 'Cities',
  PILGRIM = 'Pilgrim',
  COASTAL = 'Coastal',
  HILLS = 'Hills',
  CUSTOM = 'Custom'
}

export enum Language {
  ENGLISH = 'English',
  TAMIL = 'Tamil',
  HINDI = 'Hindi',
  MALAYALAM = 'Malayalam'
}

export enum Currency {
  USD = 'USD',
  INR = 'INR',
  EUR = 'EUR'
}

export interface TransportOption {
  mode: string; // Bus, Train, Flight, Cab, Bike
  cost: number;
  duration: string;
  comfort: number; // 1-5
  carbonFootprint: string; // Low, Med, High
  recommended: boolean;
}

export interface Activity {
  name: string;
  cost: number;
  type: 'Free' | 'Paid';
  isPopular: boolean;
  isHiddenGem: boolean;
}

export interface TripLeg {
  day: number;
  from: string;
  to: string;
  stay: {
    name: string;
    type: string;
    cost: number;
    rating: number;
  };
  transportOptions: TransportOption[];
  activities: Activity[];
}

export interface TripPlan {
  id: string;
  name: string;
  totalBudget: number;
  budgetUsed: number;
  durationDays: number;
  peopleCount: number;
  category: TripCategory;
  safetyScore: number;
  savingsVsMarket: number;
  legs: TripLeg[];
  summary: string;
  currency: Currency;
}

export interface ProviderPackage {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  image?: string;
  status: 'Active' | 'Draft';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  points: number;
  avatar?: string;
  preferences?: {
    language: Language;
    currency: Currency;
  };
}
