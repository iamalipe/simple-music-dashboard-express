import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().max(500),
    password: z.string().min(8).max(64),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(500).optional(),
    email: z.string().email().max(500),
    password: z.string().min(8).max(64),
  }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
