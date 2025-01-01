import { z } from 'zod';
import { mongoIdRegex } from '../../utils/general.util';

export const createSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    originYear: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(1000).optional(),
    popularInCountry: z.string().min(2).max(100).optional(),
  }),
});

export const updateSchema = z.object({
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid id'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    originYear: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(1000).optional(),
    popularInCountry: z.string().min(2).max(100).optional(),
  }),
});

export const deleteSchema = z.object({
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid id'),
  }),
});

export const getSchema = z.object({
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid id'),
  }),
});

export const getAllSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().min(0)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().min(1).max(100)),
    order: z
      .string()
      .optional()
      .refine((val) => !val || ['asc', 'desc'].includes(val), {
        message: "Order must be 'asc' or 'desc'",
      })
      .transform((val) => (val === '' || val === undefined ? 'desc' : val))
      .default('desc'),
    orderBy: z
      .string()
      .optional()
      .transform((val) => (val === '' || val === undefined ? 'createdAt' : val))
      .default('createdAt'),
  }),
});

export type createSchemaType = z.infer<typeof createSchema>;
export type updateSchemaType = z.infer<typeof updateSchema>;
export type deleteSchemaType = z.infer<typeof deleteSchema>;
export type getSchemaType = z.infer<typeof getSchema>;
export type getAllSchemaType = z.infer<typeof getAllSchema>;
