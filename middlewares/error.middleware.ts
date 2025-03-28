import { Prisma } from '@prisma/client';
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
  // Handled AppError errors
  if (err instanceof AppError) {
    // TODO Add Logger here then remove console
    // console.error('Handled errors : globalErrorHandler', err.message);
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message = 'Database Error';
    let status = 400;

    // Handle specific Prisma error codes
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        message = `Unique constraint violation on ${
          err.meta?.target || 'field'
        }`;
        break;
      case 'P2003': // Foreign key constraint failed
        message = `Foreign key constraint failed on ${
          err.meta?.field_name || 'field'
        }`;
        break;
      case 'P2025': // Record not found
        message = 'Record not found';
        status = 404;
        break;
      case 'P2001': // Record does not exist
        message = 'Record does not exist';
        status = 404;
        break;
      default:
        message = `Database error: ${err.code}`;
    }

    res.status(status).json({
      success: false,
      message,
      errors: [{ message, path: (err.meta?.target as string) || '' }],
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Database Validation Error',
      errors: [],
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unhandled errors
  // TODO Add Logger here then remove console
  console.error('Unhandled errors : globalErrorHandler', err.message);
  res.status(500).json({
    success: false,
    errors: [],
    message: err.message,
    timestamp: new Date().toISOString(),
  });
  return;
};
