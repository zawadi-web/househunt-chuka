/**
 * Rate Limiter Utility for Next.js API Routes & Server Actions
 * Protects endpoints against DDoS, brute force, and automated spam.
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const memoryStore: RateLimitStore = {};

export interface RateLimitOptions {
  limit?: number;        // Maximum allowed requests
  windowMs?: number;     // Time window in milliseconds
}

export function rateLimit(identifier: string, options: RateLimitOptions = {}) {
  const limit = options.limit || 20;            // Default: 20 requests
  const windowMs = options.windowMs || 60 * 1000; // Default: per 1 minute

  const now = Date.now();
  const record = memoryStore[identifier];

  if (!record || now > record.resetTime) {
    memoryStore[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
