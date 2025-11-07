/**
 * General application constants
 */

export const APP_NAME = 'African Yellow Pages USA';
export const APP_SHORT_NAME = 'AYPUSA';
export const APP_DESCRIPTION = 'The premier directory for African businesses across the United States';

export const CONTACT_INFO = {
  EMAIL: 'info@africanyellowpagesusa.com',
  PHONE: '+1 (469) 570-1370',
  ADDRESS: 'Dallas, USA',
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
