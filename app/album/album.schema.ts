import { z } from 'zod';
import { mongoIdRegex } from '../../utils/general.utils';
import {
  paginationSchema,
  sortArraySchema,
} from '../../utils/validation.utils';

export const createSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    releaseDate: z.string().datetime(),
    artistId: z.string().regex(mongoIdRegex, 'Invalid id'),
    coverUrl: z.string().min(10).optional(),
  }),
});

export const updateSchema = z.object({
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid id'),
  }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    releaseDate: z.string().datetime().optional(),
    artistId: z.string().regex(mongoIdRegex, 'Invalid id').optional(),
    coverUrl: z.string().min(10).optional(),
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
    sort: sortArraySchema,
    ...paginationSchema.shape,
  }),
});

export type createSchemaType = z.infer<typeof createSchema>;
export type updateSchemaType = z.infer<typeof updateSchema>;
export type deleteSchemaType = z.infer<typeof deleteSchema>;
export type getSchemaType = z.infer<typeof getSchema>;
export type getAllSchemaType = z.infer<typeof getAllSchema>;
