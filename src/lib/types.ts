export type Role = 'STUDENT' | 'LANDLORD' | 'AGENT' | 'ADMIN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ListingStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  image?: string;
  role: Role;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  nationalIdNumber?: string;
  nationalIdUrlFront?: string;
  nationalIdUrlBack?: string;
  selfieUrl?: string;
  subscriptionTier?: 'FREE' | 'PREMIUM';
  createdAt: string;
}

export interface HouseImage {
  id: string;
  url: string;
  isPrimary?: boolean;
  imageHash?: string;
}

export interface House {
  id: string;
  title: string;
  slug: string;
  description: string;
  rentPerMonth: number;
  depositRequired: number;
  availableRooms: number;
  totalRooms: number;
  roomType: 'Bedsitter' | 'Single' | '1 Bedroom' | '2 Bedroom' | 'Shared';
  
  // Amenities
  waterAvailability: '24/7 Borehole' | 'City Water' | 'Tank Backup' | 'Periodic Supply';
  electricityType: 'Prepaid Token' | 'Inclusive' | 'Postpaid Meter';
  wifiAvailable: boolean;
  securityGuarded: boolean;
  cctv: boolean;
  gatedFence: boolean;
  furnished: boolean;
  parking: boolean;
  balcony: boolean;
  garbageCollection: boolean;

  // Location
  address: string;
  areaName: string; // e.g. "Ndagani", "Mariani", "Campus Gate B"
  latitude: number;
  longitude: number;
  distanceFromCampus: number; // in Km

  // Anti-scam & Status
  status: ListingStatus;
  isFeatured: boolean;
  lastVerifiedAt: string;
  images: HouseImage[];
  videoUrl?: string;

  // Landlord
  landlord: User;
  
  // Rating & Stats
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  houseId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  landlordRating: number;
  comment: string;
  verifiedTenant: boolean;
  createdAt: string;
}

export interface ViewingBooking {
  id: string;
  houseId: string;
  houseTitle: string;
  studentName: string;
  studentPhone: string;
  preferredDate: string;
  preferredTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  areaName: string;
  roomType: string;
  minPrice: number;
  maxPrice: number;
  maxDistance: number; // km
  water247: boolean;
  wifiOnly: boolean;
  securityGuarded: boolean;
  furnishedOnly: boolean;
  verifiedOnly: boolean;
}
