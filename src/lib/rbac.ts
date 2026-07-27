/**
 * Role-Based Access Control (RBAC) & Data Protection Middleware/Guard
 * Prevents Unauthorized Data Access & Enforces Role Boundaries
 */

import { Role } from './types';

export interface AuthUserContext {
  id: string;
  role: Role;
  verificationStatus?: string;
}

export function authorizeRole(user: AuthUserContext | null, allowedRoles: Role[]): { authorized: boolean; reason?: string } {
  if (!user) {
    return { authorized: false, reason: 'Authentication required. Please sign in.' };
  }

  if (!allowedRoles.includes(user.role)) {
    return { 
      authorized: false, 
      reason: `Access denied. Action requires one of the following roles: [${allowedRoles.join(', ')}].` 
    };
  }

  return { authorized: true };
}

/**
 * Ensures user can only view or modify their own private data
 */
export function authorizeOwnerOrAdmin(user: AuthUserContext | null, resourceOwnerId: string): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true; // Admins can access for moderation
  return user.id === resourceOwnerId;
}

/**
 * Masks sensitive PII (Kenyan National ID) when returning data to non-admin roles
 */
export function maskNationalId(nationalId?: string): string {
  if (!nationalId) return 'N/A';
  if (nationalId.length <= 4) return '****';
  return nationalId.substring(0, 2) + '****' + nationalId.substring(nationalId.length - 2);
}
