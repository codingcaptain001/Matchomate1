import type { ErrorRequestHandler } from 'express';

export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  const reportedStatus = typeof error === 'object' && error !== null && 'status' in error
    ? Number(error.status)
    : 500;
  const status = error instanceof AppError
    ? error.statusCode
    : reportedStatus >= 400 && reportedStatus < 500 ? reportedStatus : 500;
  const message = status === 500 ? 'Internal server error' : error.message;
  if (status === 500) console.error(error);
  response.status(status).json({ success: false, error: { message } });
};