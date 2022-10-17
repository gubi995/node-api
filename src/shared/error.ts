/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

import { HttpStatus } from '../types/http-status';

import logger from './logger';

export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;

  constructor(description: string, statusCode: number, isOperational = true) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  req: Request,
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
      console.log({ detail });

      return new AppError(detail.message, HttpStatus.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      return error;
    }

    return new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  handleError(error: AppError) {
    if (error.isOperational) {
      logger.warn(error.message);
    } else {
      logger.error(error);
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
