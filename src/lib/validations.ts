/**
 * Strict Input Validation Schemas for HouseHunt Chuka
 * Prevents SQL Injection, XSS, and Malicious Input Payloads
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  // Accepts East African phone formats e.g. +254 712345678, 0712345678
  const phoneRegex = /^(?:\+254|0)?(7|1)\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

export function validateNationalId(id: string): boolean {
  // Kenyan National ID is typically 7-8 digits
  const idRegex = /^\d{7,8}$/;
  return idRegex.test(id.trim());
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export interface HouseListingInput {
  title: string;
  description: string;
  rentPerMonth: number;
  depositRequired: number;
  areaName: string;
  roomType: string;
  distanceFromCampus: number;
}

export function validateHouseListing(data: HouseListingInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  if (!data.description || data.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters long');
  }
  if (typeof data.rentPerMonth !== 'number' || data.rentPerMonth < 1000 || data.rentPerMonth > 100000) {
    errors.push('Monthly rent must be between KSh 1,000 and KSh 100,000');
  }
  if (typeof data.depositRequired !== 'number' || data.depositRequired < 0 || data.depositRequired > 100000) {
    errors.push('Deposit must be between KSh 0 and KSh 100,000');
  }
  if (!data.areaName || data.areaName.trim().length === 0) {
    errors.push('Campus Zone / Area is required');
  }
  if (typeof data.distanceFromCampus !== 'number' || data.distanceFromCampus < 0.1 || data.distanceFromCampus > 15) {
    errors.push('Distance from campus must be between 0.1km and 15km');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export interface VerificationDocumentInput {
  landlordId: string;
  nationalIdNumber: string;
  idFrontUrl: string;
  selfieUrl: string;
}

export function validateVerificationDocument(data: VerificationDocumentInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.landlordId) {
    errors.push('Landlord ID is required');
  }
  if (!validateNationalId(data.nationalIdNumber)) {
    errors.push('Valid 7-8 digit Kenyan National ID number is required');
  }
  if (!data.idFrontUrl || !data.idFrontUrl.startsWith('http')) {
    errors.push('Valid National ID front image URL is required');
  }
  if (!data.selfieUrl || !data.selfieUrl.startsWith('http')) {
    errors.push('Valid live selfie image URL is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
