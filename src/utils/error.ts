import { ErrorRequestHandler, Request, Response } from 'express';

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
  error: AppError,
  req: Request,
  res: Response
) => {
  errorHandler.handleError(error);

  const status = error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    error: error.message,
    status,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
  });
};

export class ErrorHandler {
  handleError(error: Error) {
    logger.error(error.message);
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
