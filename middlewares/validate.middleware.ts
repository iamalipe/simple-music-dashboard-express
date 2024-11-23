import { RequestHandler } from 'express';
import { ZodTypeAny, z } from 'zod';

export const validate = (schema: ZodTypeAny): RequestHandler => {
  return async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  };
};
