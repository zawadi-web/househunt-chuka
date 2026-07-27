import { House, User, Review, ViewingBooking } from './types';

export const CHUKA_UNIVERSITY_COORDS = {
  lat: -0.3325,
  lng: 37.6450,
  name: "Chuka University Main Campus",
  county: "Tharaka Nithi County",
  highway: "Nairobi - Meru Highway (B6)",
  subCounty: "Chuka / Igambang'ombe",
  elevation: "2,000 meters above sea level",
  keyLandmarks: [
    "Campus Gate A (Main Highway Entrance — Nairobi-Meru Hwy B6)",
    "Campus Gate B (KK Mwendwa Reservoir Road)",
    "Campus Gate C (Ndia Ndoro Pathway)",
    "Campus Gate F (Mungoni Side Entrance)",
    "Ndagani Student Commercial Center",
    "Lowlands Area (Near Lowlands Hotel & Spa)",
    "Slaughterhouse Area (Lowlands)",
    "Mungoni Village",
    "Juvera's Junction",
    "Historic Mutunguruni Tree Shrine",
    "Jerusha Kanyua Memorial Area",
    "Mariani Ridge",
    "Nithi River Valley",
    "Chuka Town Center (2.3 km)"
  ]
};

// 100% Real Data Mode — No dummy data
export const MOCK_LANDLORDS: User[] = [];

export const MOCK_HOUSES: House[] = [];

export const MOCK_REVIEWS: Review[] = [];

export const MOCK_BOOKINGS: ViewingBooking[] = [];
