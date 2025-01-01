import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny): RequestHandler => {
  return async (req, res, next) => {
    const parseData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    Object.assign(req, parseData);

    next();
  };
};
