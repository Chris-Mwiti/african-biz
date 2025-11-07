/**
 * Authentication constants
 */



// Local storage keys
export const STORAGE_KEYS = {
  USER: 'aypusaUser',
  TOKEN: 'aypusaToken',
} as const;

// Session duration (in milliseconds)
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
