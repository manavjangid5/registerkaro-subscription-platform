import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type ValidatedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = Request & {
  validatedBody?: TBody;
  validatedQuery?: TQuery;
  validatedParams?: TParams;
};

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
      return;
    }
    (req as ValidatedRequest<T>).validatedBody = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
      return;
    }
    (req as ValidatedRequest<unknown, T>).validatedQuery = result.data;
    next();
  };
}

export function validateParams<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
      return;
    }
    (req as ValidatedRequest<unknown, unknown, T>).validatedParams = result.data;
    next();
  };
}

export type { ValidatedRequest };
