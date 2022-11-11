/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

import { HttpStatus } from '../types/http-status';

import logger from './logger';

type AppErrorOptions = {
  description: string;
  statusCode: number;
  metadata?: object;
  isOperational?: boolean;
};

export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;
  public readonly metadata?: object;

  constructor({
    description,
    statusCode,
    isOperational = true,
    metadata,
  }: AppErrorOptions) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;
    Error.captureStackTrace(this);
  }
}

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appError = errorHandler.parse(error);

  errorHandler.handleError(appError);

  res.status(appError.statusCode).json({
    error: appError.message,
    status: appError.statusCode,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
  });
};

export class ErrorHandler {
  parse(error: any) {
    if (error?.error instanceof ValidationError) {
      const [detail] = error.error.details;

      return new AppError({
        description: detail.message,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (error instanceof AppError) {
      return error;
    }

    return new AppError({
      description: error.message ?? 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  handleError(error: AppError) {
    if (error.isOperational) {
      logger.warn(error.message, error);
    } else {
      logger.error(error.message, error);
    }

    // sendEmail if it is critical
  }

  isTrustedError(error: Error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }
}

export const errorHandler = new ErrorHandler();
