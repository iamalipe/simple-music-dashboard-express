import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Handled OError errors
  if (err instanceof AppError) {
    // TODO Add Logger here then remove console
    console.error('Handled errors : globalErrorHandler', err.message);
    const status = err.options
      ? err.options.status
        ? err.options.status
        : 400
      : 400;
    const errors = err.options
      ? err.options.path
        ? [{ message: err.message, path: err.options.path }]
        : []
      : [];

    res.status(status).json({
      success: false,
      message: err.message,
      errors: errors,
    });
    return;
  }

  // Handled Zod - validation errors
  if (err instanceof z.ZodError) {
    const newErrors = err.errors.map((error) => {
      let path = '';
      if (error.path.includes('body')) {
        const err = error.path.filter((ex) => ex !== 'body');
        path = err.join('.');
      } else if (error.path.includes('query')) {
        const err = error.path.filter((ex) => ex !== 'query');
        path = err.join('.');
      } else if (error.path.includes('params')) {
        const err = error.path.filter((ex) => ex !== 'params');
        path = err.join('.');
      } else {
        path = error.path.join('.');
      }

      return {
        path: path,
        message: error.message,
      };
    });

    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: newErrors,
    });
    return;
  }

  // Unhandled errors
  // TODO Add Logger here then remove console
  console.error('Unhandled errors : globalErrorHandler', err.message);
  res
    .status(500)
    .json({ success: false, errors: [], message: 'Internal Server Error' });
  return;
};
