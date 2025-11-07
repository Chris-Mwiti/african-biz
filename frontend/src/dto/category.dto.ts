import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
