import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().max(500).optional(),
    // username: z.string().url().optional(),
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    password: z.string().min(8).max(64).optional(),
    profileImage: z.string().min(10).optional(),
    country: z.string().length(3).optional(),
    state: z.string().min(2).max(50).optional(),
  }),
});

export type updateUserSchemaType = z.infer<typeof updateUserSchema>;
