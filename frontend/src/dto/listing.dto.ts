import { z } from 'zod';

export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
});

export const CreateListingSchema = z.object({
  title: z.string().min(1, { message: 'Business name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  website: z.string().url({ message: 'Invalid URL' }).optional(),
  social_links: z.array(SocialLinkSchema).optional(),
  images: z.array(z.string()).optional(),
  category_id: z.string().min(1, { message: 'Category is required' }),
  is_premium: z.boolean().optional(),
});

export type CreateListingDto = z.infer<typeof CreateListingSchema>;

export const UpdateListingSchema = CreateListingSchema.partial();

export type UpdateListingDto = z.infer<typeof UpdateListingSchema>;
