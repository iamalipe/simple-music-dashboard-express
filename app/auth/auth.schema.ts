import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
      .min(3)
      .max(100),
    password: z.string().min(8).max(64),
  }),
});
export const usernameCheckSchema = z.object({
  body: z.object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
      .min(3)
      .max(100),
  }),
});
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email().max(500),
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
      .min(3)
      .max(100),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    password: z.string().min(8).max(64),
    country: z.string().length(3),
    state: z.string().min(2).max(50),
  }),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type usernameCheckSchemaType = z.infer<typeof usernameCheckSchema>;
